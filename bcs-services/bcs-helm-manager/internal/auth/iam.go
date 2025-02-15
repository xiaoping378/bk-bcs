/*
 * Tencent is pleased to support the open source community by making Blueking Container Service available.
 * Copyright (C) 2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under,
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

package auth

import (
	"github.com/Tencent/bk-bcs/bcs-common/pkg/auth/iam"
	"github.com/Tencent/bk-bcs/bcs-services/pkg/bcs-auth/cluster"
	"github.com/Tencent/bk-bcs/bcs-services/pkg/bcs-auth/project"
)

// IAMClient iam client
var IAMClient iam.PermClient

// ProjectIamClient project iam client
var ProjectIamClient *project.BCSProjectPerm

// ClusterIamClient cluster iam client
var ClusterIamClient *cluster.BCSClusterPerm

// InitPermClient new a perm client
func InitPermClient(iamClient iam.PermClient) {
	ProjectIamClient = project.NewBCSProjectPermClient(iamClient)
	ClusterIamClient = cluster.NewBCSClusterPermClient(iamClient)
}
