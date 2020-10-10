import * as validators from './verifiers'
import {isArray, isFunction, nestedSet} from '../../utils'

/**
 * 数组方式校验器。
 * 如：
 * export default {
 *  data() {
 *    return {
 *      myModelName: 123
 *    }
 *  },
 *  verifier: {
 *    myModelName: ['integer:10'] // myModelName必须为整形，并且最大长度为10
 *  }
 * }
 * @param modelName 属性名，上例中的'myModelName'
 * @param rules 需要应用的规则数组，上例中的'integer', ':10'为该校验规则的options
 */
const applyArr = function (modelName, rules) {
  this.$watch(modelName, (newVal, oldVal) => {
    for (const validatorName of rules) {
      if (!newVal) continue
      const [ruleName, ...options] = validatorName.split(':')
      const valid = validators[ruleName](newVal, options)
      if (!valid) nestedSet(this, modelName, oldVal)
    }
  })
}

/**
 * 函数方式校验器。
 * 如：
 * export default {
 *  data() {
 *    return {
 *      myModelName: 123
 *    }
 *  },
 *  verifier: {
 *    myModelName(param, options) {
 *      return param.length > 10
 *    }
 *  }
 * }
 * @param modelName 属性名，上例中的myModelName()函数的名称
 * @param rule 需要应用的规则函数，上例中的myModelName()函数
 */
const applyFun = function (modelName, rule) {
  this.$watch(modelName, (newVal, oldVal) => {
    if (!newVal) return
    const valid = rule(newVal)
    if (!valid) nestedSet(this, modelName, oldVal)
  })
}

export default (Vue, options = {}) => {
  Vue.mixin({
    beforeMount() {
      if (!this.$options.verifier) return

      for (const [modelName, rule] of Object.entries(this.$options.verifier)) {
        // 当rule是数组或者函数时，调用对应的处理函数
        if (isArray(rule)) applyArr.call(this, modelName, rule)
        else if (isFunction(rule)) applyFun.call(this, modelName, rule)
      }
    }
  })
}
