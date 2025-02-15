/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
import moment from 'moment';

export default {
  tooltip: {
    trigger: 'axis',
    confine: true,
    extraCssText: 'width: 300px;',
    axisPointer: {
      type: 'line',
      animation: false,
      label: {
        backgroundColor: '#6a7985',
      },
    },
    formatter(params) {
      let ret = `<div>${moment(params[0].value[0]).format('YYYY-MM-DD HH:mm:ss')}</div>`;
      params.forEach((item) => {
        ret += '<div style="text-align: left; white-space: normal;word-break: break-all;">'
                    + `${item.seriesName}：<span style="font-weight: 700; color: #30d873;">`
                    + `${(item.value[1]).toFixed(2)}%</span></div>`;
      });
      return ret;
    },
  },
  grid: {
    show: false,
    top: '4%',
    left: '4%',
    right: '5%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'time',
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#dde4eb',
        },
      },
      axisTick: {
        alignWithLabel: true,
        length: 5,
        lineStyle: {
          color: '#ebf0f5',
          // color: '#868b97'
        },
      },
      axisLabel: {
        color: '#868b97',
        formatter(value) {
          return moment(value).format('HH:mm');
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ebf0f5'],
          type: 'dashed',
        },
      },
    },
  ],
  yAxis: [
    {
      boundaryGap: [0, '2%'],
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#dde4eb',
        },
      },
      axisTick: {
        alignWithLabel: true,
        length: 0,
        lineStyle: {
          color: 'red',
        },
      },
      axisLabel: {
        color: '#868b97',
        formatter(value) {
          return `${value}%`;
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ebf0f5'],
          type: 'dashed',
        },
      },
    },
  ],
};
