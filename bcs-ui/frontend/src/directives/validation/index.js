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

import Rules from './rules';

/**
 *  解析type
 */
// function parseType (type) {
//     if (typeof type !== 'string') {
//         return {
//             el: 'input',
//             type: 'text'
//         }
//     }

//     const $type = type.split(':')

//     return {
//         el: $type[0],
//         type: $type[1]
//     }
// }

/**
 *  解析rule
 */
function parseRule(rule) {
  if (typeof rule !== 'string') {
    return {
      rule: 'not_empty',
    };
  }

  const $rule = rule.split(':');

  return {
    rule: $rule[0],
    ext: $rule[1],
  };
}

/**
 *  错误控制
 *  @param {Element} el - 当前绑定了指令的DOM节点
 *  @param {Boolean} valid - 当前的值是否通过检测
 */
function ErrorHandler(el, valid) {
  if (!valid) {
    el.classList.add('has-error');
    el.setAttribute('data-bk-valid', false);
  } else {
    el.classList.remove('has-error');
    el.setAttribute('data-bk-valid', true);
  }
}

const install = (Vue) => {
  Vue.directive('bk-validation', {
    inserted() {
      // el.focus()
    },
    update(el, binding) {
      const {
        value,
        oldValue,
      } = binding;

      // 避免不必要的更新
      if (value.val === oldValue.val) return;

      const parsedRule = parseRule(value.rule);
      let result;

      switch (parsedRule.rule) {
        case 'not_empty':
          result = Rules.notEmpty(value.val);
          break;
        case 'limit':
          result = Rules.limit(value.val, parsedRule.ext);
          break;
      }

      ErrorHandler(el, result);
    },
  });
};

export default install;
