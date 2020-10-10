const DEFAULT_PORTRAIT = require('../assets/shangchao.png')
const imgPath = (path, defaultImg = DEFAULT_PORTRAIT) =>
    path ? /^(https?:\/|data:image)\//ig.test(path) ? path : 'https://resfco.raiyee.cn/fco-images/prod' + path : defaultImg

const generateGetters = keys => {
  const getters = {}
  keys.forEach(key => (getters[key] = state => state[key]))
  return getters
}

export const trueType = value => [].slice.call({}.toString.call(value), 8, -1).join('')

export const trueTypeFunc = type => value => type === trueType(value);

export const getDPR = (scale = 1) => window.devicePixelRatio || scale

export const MOBILE_REGEX = /^1(2345678910)|([34578]\d{9})$/

export const isNumber = (params) =>  'number' === trueType(params)

export const toNum = (numText, trans = true) => {
  if (!numText) return trans ? 0 : numText

  numText = numText.toString().trim()
  const isNegative = numText.indexOf('-') === 0

  numText = numText.replace(/[^\d.]/g, '')
  const pointIndex = numText.indexOf('.')
  numText = numText.replace(/\./g, '')

  if (pointIndex !== -1 && pointIndex !== numText.length) {
    const arr = numText.split('')
    arr.splice(pointIndex, 0, '.')
    numText = arr.join('')
  }

  numText = numText && isNegative ? `-${numText}` : numText

  return trans ? +numText : numText
}

export default {
  imgPath,
  generateGetters,
  isArray: (params) =>  'array' === trueType(params),
  isFunction: (params) =>  'function' === trueType(params),
  isNumber,
  toNum,
  error: (...params) => console.error(...params),
  log: (...params) => console.log(...params),
  warn: (...params) => console.log(...params),
  getDPR,
  MOBILE_REGEX
}