import utils from '../../utils'
const SET_MOBILE = 'SET_MOBILE'
const INITIALIZE = 'INITIALIZE'
const SET_USER_ID = 'SET_USER_ID'
const SET_NOTICE_JUMP = 'SET_NOTICE_JUMP'
const SET_DROP = 'SET_DROP'
const SET_MENU_OPEN = 'SET_MENU_OPEN'
const SET_MENU_SHOW = 'SET_MENU_SHOW'
const SET_POSTER_BG_IMG_URL = 'SET_POSTER_BG_IMG_URL'
const SET_PWD_MODIFY_REMIND = 'SET_PWD_MODIFY_REMIND'
const SET_MARK = 'SET_MARK'
const SET_COACH_NAME_DEFINE = 'SET_COACH_NAME_DEFINE'

const base = ''

const INIT_STATE = {
  ctx: base,
  tcode: null,
  base
}

const state = Object.assign({
  mobile: null,
  staffLogined: false,
  customerLogined: false,
  menuOpen: true,
  menuShow: true,
  initialized: false,
  merchantName: null,
  merchantLogo: null,
  merchantQrCode: null,
  merchantAddress: null,
  merchantMobile: null,
  merchantDesc: null,
  businessHour: null,
  mchSlogan: null,
  provinceCode: null,
  eparchyCode: null,
  cityCode: null,
  mchSaasServname: null,
  userId: null,
  tcode: '',
  staffPhone: null,
  staffName: null,
  theme: null,
  noticeJump: true,
  dropId: null,
  qrcode: null,
  button: null,
  menu: null,
  payTypes: null,
  homeName: null,
  posterBgImgUrl: null,
  initialPwdTag: false,
  pwdRemindTimes: 4,
  joinPrivilegeCenter: null,
  markId: '',
  mchSaasType: '',
  coachNameDefine: '教练',
  headimgUrl: '',
  queuingEnabled: false,
  signInSwitch: false
}, INIT_STATE)

const getters = {
  ...utils.generateGetters(['mobile', 'staffLogined', 'customerLogined', 'tcode', 'menuOpen', 'menuShow', 'initialized', 'payTypes',
    'merchantName', 'merchantLogo', 'userId', 'staffPhone', 'staffName', 'theme', 'noticeJump', 'dropId', 'qrcode', 'button', 'menu',
    'posterBgImgUrl', 'merchantAddress', 'merchantMobile', 'merchantDesc', 'businessHour', 'mchSlogan', 'provinceCode', 'eparchyCode',
    'homeName', 'markId', 'cityCode', 'initialPwdTag', 'pwdRemindTimes', 'joinPrivilegeCenter', 'mchSaasServname', 'mchSaasType',
    'merchantQrCode', 'coachNameDefine', 'headimgUrl', 'queuingEnabled', 'signInSwitch'
  ])
}

const actions = {
  initialize({commit}, payload) {
    commit(INITIALIZE, payload)
  },
  setUserId({commit}, userId) {
    commit(SET_USER_ID, userId)
  },
  setPwdModifyRemind({commit}, data) {
    commit(SET_PWD_MODIFY_REMIND, data)
  },
  setNoticeJump({commit}, noticeJump) {
    commit(SET_NOTICE_JUMP, noticeJump)
  },
  setDrop({commit}, data) {
    commit(SET_DROP, data)
  },
  setMenuOpen({commit}, data) {
    commit(SET_MENU_OPEN, data)
  },
  setMenuShow({commit}, data) {
    commit(SET_MENU_SHOW, data)
  },
  setPosterBgImgUrl({commit}, posterBgImgUrl) {
    commit(SET_POSTER_BG_IMG_URL, posterBgImgUrl)
  },
  setMark({commit}, data) {
    commit(SET_MARK, data)
  },
  setCoachNameDefine({commit}, data) {
    commit(SET_COACH_NAME_DEFINE, data)
  }
}

const mutations = {
  [SET_MOBILE](state, mobile) {
    state.mobile = mobile
  },
  [INITIALIZE](state, {
    tcode, merchantName, logo, staffLogined, customerLogined, userId, staffName, staffPhone, theme, floatMenu, qrcode, button, menu, address,
    merchantMobile, merchantDesc, businessHour, mchSlogan, provinceCode, eparchyCode, cityCode, homeName, payTypes, joinPrivilegeCenter,
    mchSaasServname, mchSaasType, merchantQrCode, coachNameDefine, headimgUrl, queuingEnabled, signInSwitch
  }) {
    state.tcode = tcode
    state.initialized = true
    state.staffLogined = staffLogined
    state.customerLogined = customerLogined
    state.merchantName = merchantName
    state.merchantQrCode = merchantQrCode
    state.merchantAddress = address
    state.merchantMobile = merchantMobile
    state.merchantDesc = merchantDesc
    state.businessHour = businessHour
    state.mchSlogan = mchSlogan
    state.provinceCode = provinceCode
    state.eparchyCode = eparchyCode
    state.cityCode = cityCode
    state.userId = userId
    state.merchantLogo = utils.imgPath(logo, utils.DEFAULT_LOGO)
    state.staffPhone = staffPhone
    state.staffName = staffName
    state.payTypes = payTypes
    state.theme = theme
    state.button = button
    state.menu = menu
    state.homeName = homeName
    state.joinPrivilegeCenter = joinPrivilegeCenter
    state.mchSaasServname = mchSaasServname
    state.mchSaasType = mchSaasType
    state.coachNameDefine = coachNameDefine
    state.headimgUrl = headimgUrl
    state.queuingEnabled = queuingEnabled
    state.signInSwitch = signInSwitch
  },
  [SET_USER_ID](state, userId) {
    state.userId = userId
  },
  [SET_NOTICE_JUMP](state, noticeJump) {
    state.noticeJump = noticeJump
  },
  [SET_DROP](state, dropId) {
    state.dropId = dropId
  },
  [SET_MENU_OPEN](state, menuOpen) {
    state.menuOpen = menuOpen
  },
  [SET_MENU_SHOW](state, menuShow) {
    state.menuShow = menuShow
  },
  [SET_PWD_MODIFY_REMIND](state, data) {
    state.pwdRemindTimes = data.pwdRemindTimes
    state.initialPwdTag = data.initialPwdTag
  },
  [SET_POSTER_BG_IMG_URL](state, posterBgImgUrl) {
    state.posterBgImgUrl = posterBgImgUrl
  },
  [SET_MARK](state, markId) {
    state.markId = markId
  },
  [SET_COACH_NAME_DEFINE](state, coachNameDefine) {
    state.coachNameDefine = coachNameDefine
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
