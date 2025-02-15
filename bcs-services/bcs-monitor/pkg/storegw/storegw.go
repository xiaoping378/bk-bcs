/*
 * Tencent is pleased to support the open source community by making Blueking Container Service available.
 * Copyright (C) 2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package storegw

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/common/model"
	"github.com/prometheus/prometheus/discovery/targetgroup"
	"github.com/thanos-io/thanos/pkg/store/storepb"

	"github.com/Tencent/bk-bcs/bcs-services/bcs-monitor/pkg/config"
)

// StoreFactory 工厂模式
type StoreFactory func(logger log.Logger, reg *prometheus.Registry, conf *config.StoreConf) (storepb.StoreServer, error)

// StoreGW Store 管理结构
type StoreGW struct {
	confs           []*config.StoreConf
	stores          map[string]*Store
	logger          log.Logger
	ctx             context.Context
	reg             *prometheus.Registry
	stop            func()
	GRPCAdvertiseIP string
	portRange       *PortRange
	storeFunc       StoreFactory
}

// NewStoreGW :
func NewStoreGW(ctx context.Context, logger log.Logger, reg *prometheus.Registry, gprcAdvertiseIP string, grpcAdvertisePortRangeStr string, confs []*config.StoreConf, storeFunc StoreFactory) (*StoreGW, error) {
	portRange, err := NewPortRange(grpcAdvertisePortRangeStr)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(ctx)

	gw := &StoreGW{
		confs:           confs,
		ctx:             ctx,
		stop:            cancel,
		logger:          logger,
		reg:             reg,
		GRPCAdvertiseIP: gprcAdvertiseIP,
		portRange:       portRange,
		stores:          map[string]*Store{},
		storeFunc:       storeFunc,
	}

	return gw, nil
}

// Run 启动服务
func (s *StoreGW) Run() error {
	for idx, conf := range s.confs {
		logger := log.With(s.logger, "provider", conf.Type, "id", idx)
		port, err := s.portRange.AllocatePort(int64(idx))
		if err != nil {
			return err
		}

		address := fmt.Sprintf("%s:%d", s.GRPCAdvertiseIP, port)

		storeSvr, err := s.storeFunc(logger, s.reg, conf)
		if err != nil {
			return err
		}

		store, err := NewStore(s.ctx, logger, s.reg, address, conf, storeSvr)
		if err != nil {
			return err
		}

		id := strconv.Itoa(idx)
		s.stores[id] = store
		go func() {
			// 因为阻塞, 另外启动，同时打印日志
			err := store.ListenAndServe()
			if err != nil {
				level.Error(logger).Log("msg", "ListenAndServe grpc server done", "err", err)
				return
			}
			level.Info(logger).Log("msg", "ListenAndServe grpc server done")
		}()
	}

	<-s.ctx.Done()

	return nil
}

// Shutdown
func (s *StoreGW) Shutdown(err error) {
	s.stop()
}

// Group 兼容 targetgroup.Group, 老版本没有MarshalJSON, 按最新版本
// 参考 https://github.com/prometheus/prometheus/blob/v2.36.2/discovery/targetgroup/targetgroup.go#L96
type Group struct {
	targetgroup.Group
}

// MarshalJSON implements the json.Marshaler interface.
func (tg Group) MarshalJSON() ([]byte, error) {
	g := &struct {
		Targets []string       `json:"targets"`
		Labels  model.LabelSet `json:"labels,omitempty"`
	}{
		Targets: make([]string, 0, len(tg.Targets)),
		Labels:  tg.Labels,
	}
	for _, t := range tg.Targets {
		g.Targets = append(g.Targets, string(t[model.AddressLabel]))
	}
	return json.Marshal(g)
}

// TargetGroups 返回标准的targets
func (s *StoreGW) TargetGroups() []*Group {
	tgs := make([]*Group, 0, len(s.stores))
	for _, store := range s.stores {
		tgs = append(tgs, &Group{targetgroup.Group{
			Targets: []model.LabelSet{
				{model.AddressLabel: model.LabelValue(store.Address)},
			},
			Labels: model.LabelSet{},
		}})
	}
	return tgs
}
