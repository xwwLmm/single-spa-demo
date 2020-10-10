import {MOBILE_REGEX, isNumber, toNum} from '../../utils'

export const length = len => function (val, model) {
  maxLength(len).call(this, val, model)
  val = this[model]
  return !!val && val.toString().length === len
}

export const minLength = min => val => !!val && val.length >= min

export const maxLength = max => function (val, model) {
  if (val == null) return false
  val = val.toString()
  if (val.length > max) this[model] = this[model].toString().substr(0, max)
  return true
}

export const mobile = flag => function (val, model) {
  maxLength(11).call(this, val, model)
  return !!flag === MOBILE_REGEX.test(this[model])
}

export const integer = (len, transform = true, max = true) => function (val, model) {
  const flag = !!len
  let valid = true
  if (isNumber(len)) valid = (max ? maxLength : length)(len).call(this, val, model)
  val = toNum(this[model] + '', false).replace(/\.\d*/, '')
  val = val === '' ? '' : transform ? ~~val : val
  return valid && flag === /-?\d+/.test(this[model] = val)
}

export const min = num => val => val >= num

export const max = num => val => val <= num

export const maxValue = max => function (val, model) {
  if (val == null) return false
  val = toNum(val)
  if (val > max) this[model] = max
  return true
}

export const minValue = min => function (val, model) {
  if (val == null) return false
  val = toNum(val)
  if (val < min) this[model] = min
  return true
}

export const money = (integerLen, decimalLen) => function (val, model) {
  if (val == null) return false
  if (val === '0' || val === '') return false
  if (decimalLen) {
    val = val.toString().trim().replace(/[^\d.]/g, '')
    let pointIndex = val.indexOf('.')

    if (pointIndex !== -1 && pointIndex !== val.length) {
      const integerPart = +(val.toString().substring(0, pointIndex))
      const decimalPart = val.toString().substring(pointIndex)
      val = `${integerPart}.${decimalPart}`
      pointIndex = val.indexOf('.')
      val = val.replace(/\./g, '')
      const arr = val.split('')
      arr.splice(pointIndex, 0, '.')
      val = arr.join('')
      decimalLen && (val = val.toString().substr(0, pointIndex + decimalLen + 1))
      if (integerLen && pointIndex > integerLen) {
        val = `${val.toString().substr(0, integerLen)}${val.substr(pointIndex)}`
      }
      this[model] = val
    } else {
      integerLen && (val = +(val.toString().substr(0, integerLen)))
      this[model] = val
    }
  } else {
    this[model] = +(val.toString().trim().replace(/[^\d]/g, '').substr(0, integerLen))
  }
}
