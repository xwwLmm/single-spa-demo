/**
 * 是否是整数
 * @param param 参数
 * @param maxLen 最大长度
 * @returns {boolean} 是否合法
 */
export const integer = (param, [maxValue]) => {
  const isInteger = /^\+?(0|[1-9]\d*)$/.test(param)
  if (isInteger && maxValue) return parseInt(param) <= maxValue
  return isInteger
}

/**
 * 是否是金额
 * @param param 参数
 * @param maxValue 金额最大值，默认100000
 * @returns {boolean} 是否合法
 */
export const money = (param, [maxValue = 100000]) => {
  // 校验是否是数字
  if (!number(param)) return false

  // 校验小数位数最大长度两位
  const [, decimal] = param.split('.')
  if (decimal) return decimal.length <= 2

  // 校验是否超过最大值
  return parseFloat(param) <= maxValue
}

/**
 * 是否是数字
 * @param param 参数
 * @returns {boolean} 是否合法
 */
export const number = (param) => {
  return !isNaN(parseFloat(param)) && isFinite(param)
}
