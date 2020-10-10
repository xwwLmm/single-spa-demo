<template lang="pug">
  div(v-if="false", :class="$style.forbid") 暂无访问权限！
  div(v-else, :class="$style.container")
    div(:class="$style.background", :style="style")
      section(:class="$style.slogan")
        img(src="./slogan.png")
      section(:class="$style.centerArea")
        section(:class="$style.merchantInfo")
          div
            img.img-circle(:src="$util.imgPath(merchantLogo)")
          div {{merchantName}}
          div EasyID:&nbsp;&nbsp;{{tcode}}
        section(:class="$style.operateArea")
          div(:class="$style.title")
            div(:class="[loginMethod === 'pc' ? $style.selected : $style.unSelected]", @click="toggleMethod('pc')") 扫码登录
            div(:class="[loginMethod === 'mobile'?$style.selected : $style.unSelected]", @click="toggleMethod('mobile')") 账号登录
          template(v-if="loginMethod === 'pc'")
            template(v-if="loginResult !== 'logining'")
              section(:class="$style.qrCode")
                qrious(:value="qrcodeUrl", :size="180")
                template(v-if="timeOut")
                  div(:class="$style.mask", @click="refresh")
                  div(:class="$style.maskText", @click="refresh")
                    span.iconfont.icon-shuaxin
                    p 当前二维码已过期
              span(:class="$style.brief") 请使用已绑定的微信扫码登录
            template(v-else)
              section(:class="$style.confirmation")
                span.iconfont.icon-chenggong
                div 扫码成功，等待确认
                div 正在确认登录中，请勿刷新页面
          form(v-else, action="javascript:;", @submit.prevent="submit")
            section(:class="$style.mobile")
              span.iconfont.icon-mobile(:class="{'theme-color' : mobileFocus}")
              input(type="tel", placeholder="请输入员工手机号", v-model.trim="loginMobile", ref="mobile",
                @focus="reset('mobile')", @blur="touch('mobile')")
              span.iconfont.icon-shanchuhaoma(@click="loginMobile = ''", v-if="loginMobile")

            section(:class="$style.password")
              span.iconfont.icon-yanzhengma(:class="{'theme-color' : passwordFocus}")
              input(type="password", placeholder="请输入登录密码", v-model.trim="password", maxlength=20 ref="password",
                @focus="reset('password')", @blur="touch('password')")
              span.iconfont.icon-shanchuhaoma(@click="password = ''", v-if="password")

            section(:class="$style.captcha")
              span.iconfont.icon-shield(:class="{'theme-color' : captchaFocus}")
              input(type="tel", placeholder="请输入验证码", v-model="captcha",
                @focus="reset('captcha')", @blur="touch('captcha')", @keyup.enter="submit")
              span.theme-color(@click="getVerificationCode") {{limit ? limit + 's' : '获取验证码'}}
            span(:class="$style.errorTip", v-if="errorText") {{errorText}}
            span(v-else-if="$v.loginMobile.$error || $v.captcha.$error || $v.password.$error",
              :class="$style.errorTip") {{$v.loginMobile.$error ? '请输入正确的员工手机号码' : $v.password.$error ? '请输入正确的登录密码' : '请输入正确的验证码'}}
            .btn.btn-theme-primary(:class="$style.login", @click="submit") 登录

      div(:class="$style.footer")
        div
          img(src="./Raiyee.png")
        div 苏ICP14043234号
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import Qrious from 'vue-qrious'
  import JSEncrypt from 'jsencrypt/bin/jsencrypt'

  export default {
    name: 'login',
    data() {
      return {
        loginMethod: 'pc',
        loginResult: '',
        timeOut: false,
        limit: 0,
        mobileFocus: false,
        captchaFocus: false,
        passwordFocus: false,
        loginMobile: '',
        password: '',
        waitLoginState: '',
        tokenString: '',
        captcha: '',
        smsAlreadySend: false,
        errorText: '',
        authCode: '',
        publicKey: ''
      }
    },
    computed: {
      ...mapGetters(['mobile', 'merchantLogo', 'merchantName', 'mServerMobileOauthUrl', 'staffLogined',
        'winHeight', 'winWidth', 'rem', 'homeName', 'tcode']),
      qrcodeUrl() {
        return `${this.mServerMobileOauthUrl}/confirm-login/${this.tokenString}`
      },
      headerStyle() {
        return {width: '100%', minWidth: (1024 * this.rem) + 'px'}
      },
      style() {
        return {
          height: window.document.documentElement.clientHeight + 'px',
          width: '100%',
          minWidth: (1280) + 'px'
        }
      }
    },
    mounted() {
      this.getAuthCode()
    },
    async created() {
      if (this.staffLogined) return this.$router.push('/manage/staff-pc-console')
      this.getNewToken()
      this.loginMobile = this.mobile
      this.pollingLogin()
    },
    methods: {
      ...mapActions(['initialize', 'setPwdModifyRemind']),
      toggleMethod(method) {
        if (method === this.loginMethod) return
        this.loginMethod = method
        if (method === 'pc') {
          this.getNewToken()
          this.pollingLogin()
        } else {
          this.timeOut = false
          clearInterval(this.waitLoginState)
        }
      },
      async getNewToken() {
        this.tokenString = (await this.$http.get('/manage/StaffController/generateScanToken', undefined, {noInterceptor: true})).data
      },
      pollingLogin() {
        this.waitLoginState = setInterval(async () => {
          const {code, data} = (await this.$http.get(`/manage/StaffController/pollingLogin/${this.tokenString}`,
            undefined, {noInterceptor: true})).data
          if (+code === -1) this.loginResult = 'fail' // 登录失败
          if (+code === 1) this.loginResult = 'logining'
          if (+code === -2) { // 二维码过期
            clearInterval(this.waitLoginState)
            this.loginResult = ''
            this.timeOut = true
          }

          if (+code === 0) {
            clearInterval(this.waitLoginState)
            this.loginResult = ''
            this.setPwdModifyRemind(data)
            this.$http.post('/IndexController/index').then(({data}) => {
              this.changeData(data)
              this.$router.replace('/manage/staff-pc-console')
            })
          }
        }, 1000)
      },
      async refresh() {
        this.$http.post('/manage/StaffController/generateScanToken')
          .then(({data}) => {
            this.tokenString = data
            this.timeOut = false
            this.pollingLogin()
          })
      },
      reset(type) {
        this.errorText = ''
        if (type === 'mobile') {
          this.$v.loginMobile.$reset()
          this.mobileFocus = true
        }
        if (type === 'password') {
          this.$v.password.$reset()
          this.passwordFocus = true
        }
        if (type === 'captcha') {
          this.$v.captcha.$reset()
          this.captchaFocus = true
        }
      },
      touch(type) {
        if (type === 'mobile') {
          this.$v.loginMobile.$touch()
          this.mobileFocus = false
        }
        if (type === 'password') {
          this.$v.password.$touch()
          this.passwordFocus = false
        }
        if (type === 'captcha') {
          this.$v.captcha.$touch()
          this.captchaFocus = false
        }
      },
      getVerificationCode() {
        const {loginMobile} = this.$v
        loginMobile.$touch()

        if (this.limit || loginMobile.$error) return

        this.$http.post(`/manage/StaffController/sendCaptcha/${this.loginMobile}`)
          .then(({data: {code, message}}) => {
            if (+code === -1) return (this.errorText = message)

            this.limit = 60
            const intervalId = setInterval(() => {
              --this.limit || clearInterval(intervalId)
            }, 1000)
          })
          .catch(({status}) => {
            // if (status !== 402) return
          })
        this.smsAlreadySend = true
      },
      async getAuthCode() {
        const {authCode, publicKey} = (await this.$http.post('/manage/StaffController/getAuthCode')).data
        this.authCode = authCode
        this.publicKey = publicKey
      },
      submit() {
        const {loginMobile: mobile, password, captcha, $v: {loginMobile: vMobile, password: vPassword, captcha: vCode}} = this
        if (!mobile) return (this.errorText = '手机号不可为空')
        vMobile.$touch()
        vCode.$touch()
        vPassword.$touch()
        if (vMobile.$error || vCode.$error || vPassword.$error) return
        if (!this.smsAlreadySend) return (this.errorText = '您还没有发送验证码！')

        const authCode = this.authCode
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(this.publicKey)
        const pwd = encrypt.encrypt(password)
        this.$http.post('/manage/StaffController/staffLogin', {phoneNum: mobile, captcha, password: pwd, authCode})
          .then(({data: {code, message, data}}) => {
            if (+code !== 0) return (this.errorText = message)

            clearInterval(this.waitLoginState)
            this.setPwdModifyRemind(data)

            this.$http.post('/IndexController/index').then(({data}) => {
              this.changeData(data)
              this.$router.replace('/manage/staff-pc-console')
            })
          })
      },
      changeData(data) {
        this.initialize(data)
      }
    },
    validator: {
      loginMobile: {
        mobile: true
      },
      password: {
        minLength: 1
      },
      captcha: {
        number: true
      }
    },
    components: {
      Qrious
    }
  }
</script>
<style lang="stylus" module scoped>
  $wrong-color = #ee4d51
  $gray-color = #a4a4a4
  $icon-color = #c3c3c3
  $border-color = #e7e7e7

  .forbid
    text-align center
    height 400px
    line-height 400px

  .container
    position relative

  .slogan
    width 430px
    height 380px
    position absolute
    top 50%
    right 55%
    transform translate3d(0, -50%, 0)

    img
      width 100%
      height 100%

  .center-area
    width 340px
    height 400px
    position absolute
    top 50%
    left 52.5%
    text-align center
    transform translate3d(0, -50%, 0)
    box-shadow 0 15px 30px rgba(22, 75, 148, 0.23)

  .img
    float left

  .operate-area
    width 340px
    height 325px
    display inline-block
    background white
    text-align center

    form
      position relative
      padding 0 30px

  .title
    font-size 18px

    div
      cursor pointer
      display inline-block
      text-align center
      width 50%
      margin 20px 0 25px 0

      &:last-child
        border-left 1px solid #8bcce4

  .qr-code, .mask
    width 180px
    height 180px

  .qr-code
    position relative
    margin 0 auto
    margin-bottom 13px

  .brief
    display block
    font-size 16px
    color #626c72

  .mobile, .captcha, .password
    width 255px
    text-align left
    border-radius 5px
    padding-left 10px
    margin-bottom 10px
    margin-left 20px
    border 1px solid $border-color

    span
      line-height 38px

    input
      height 44px
      border 0
      outline none
      border-radius 5px

  .mobile, .password
    span
      display inline-block
      color $icon-color

      &:first-child
        width 8%

      &:last-child
        width 8%
        cursor pointer
        font-size 12px

    input
      display inline-block
      width 80%

  .captcha
    span
      display inline-block

      &:first-child
        width 8%
        color $icon-color

      &:last-child
        width 32%
        cursor pointer
        font-size 12px
        text-align center

    input
      display inline-block
      width 60%

  .mask, .mask-text
    position absolute
    top 0
    left 0
    text-align center

  .mask
    background-color $reverse-color
    opacity 0.9

  .mask-text
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)

    span
      font-size 45px
      color #0085d0
      margin-bottom 20px

    p
      font-size 12px
      width 130px
      margin 0

    div
      width 80px
      height 30px
      line-height 30px
      margin 0 auto
      scaleSize(10)
      border 1px solid $gray-color
      background-color $reverse-color

  .error-tip
    position absolute
    font-size 12px
    left 50px
    color $fail-color = #ee4a4e

  .login
    width 255px
    height 44px
    margin 25px 0 5px 20px
    border-radius 5px
    padding 9px
    font-size 18px

  .footer
    position absolute
    bottom 30px
    width 100%
    text-align center
    cursor default

    > :first-child
      img
        width 160px
        height 25px

    > :last-child
      color #7e8188
      font-size 16px

  .confirmation
    padding-top 30px
    padding-bottom 5px

    span
      font-size 45px
      color #88c053
      margin-bottom 10px

    div
      padding 5px 0

    > :last-child
      color $subtext-color

  .background
    background $reverse-color
    background-size 100% 100%

  .selected
    color #8abf2a

  .unSelected
    color #189aca

  .merchant-info
    position relative

    > :first-child
      position absolute
      width 90px
      top -45px
      left 50%
      margin-left -45px


      img
        height 90px
        width 90px

    > :nth-child(2)
      padding-top 45px
      color #303030
      font-size 24px
      font-weight bolder
      letter-spacing 2px

    > :last-child
      font-size 14px
      font-family STXihei, SimHei


</style>
