import utils from '../../utils'

import * as validators from './validators'

const applyRule = function (model, rule) {
  let modelVal
  const validation = {}
  for (let [ruleKey, ruleVal] of Object.entries(rule)) {
    modelVal = this[model]

    if (utils.isFunction(ruleVal)) {
      validation[ruleKey] = ruleVal.call(this, modelVal)
      continue
    }

    const validator = validators[ruleKey]

    if (!utils.isFunction(validator)) {
      utils.warn(`there is no validator named ${ruleKey}, it will be ignored!`)
      continue
    }

    ruleVal = utils.isArray(ruleVal) ? ruleVal : [ruleVal]
    validation[ruleKey] = validator(...ruleVal).call(this, modelVal, model)
  }

  const vModel = this.$v[model]

  Object.assign(vModel, validation)

  vModel.$invalid = Object.values(validation).some(v => !v)
  vModel.$error = vModel.$dirty && vModel.$invalid
}

let installed = false

export default (Vue, options = {}) => {
  if (installed) return utils.error('do not try to install plugin v-validator twice!')

  installed = true

  utils.log('plugin v-validator is installed!')

  Object.assign(validators, options.validators)

  const defineReactive = Vue.util.defineReactive

  Vue.mixin({
    beforeCreate() {
      let validator = this.$options.validator
      if (!validator) return

      if (utils.isFunction(validator)) validator = validator.call(this)

      validator.rules || (validator = {rules: validator})

      const rules = validator.rules
      const auto = validator.auto

      const $vError = () => (this.$v.$error = !!Object.keys(rules).find(model => this.$v[model].$error))

      defineReactive(this, '$v', {
        $touch: () => Object.keys(rules).forEach(model => this.$v[model].$touch()),
        $reset: () => Object.keys(rules).forEach(model => this.$v[model].$reset()),
        $error: false
      })

      for (const [model, rule] of Object.entries(rules)) {
        defineReactive(this.$v, model, {
          $dirty: auto,
          $error: false,
          $invalid: false
        })

        const vModel = this.$v[model]

        Object.assign(vModel, {
          $touch: () => {
            vModel.$dirty = true
            applyRule.call(this, model, rule)
            $vError()
          },
          $reset: () => {
            vModel.$dirty = false
            applyRule.call(this, model, rule)
            $vError()
          }
        })

        Vue.nextTick(() => {
          this.$watch(model, () => {
            auto && (vModel.$dirty = true)
            applyRule.call(this, model, rule)
          })

          vModel[auto ? '$touch' : '$reset']()
        })
      }
    }
  })
}
