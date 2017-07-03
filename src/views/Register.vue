<template lang="pug">
  div
    mt-header(fixed title='用户注册')
    cell(title='姓名' v-model='user.name' style='margin-top:40px' placeholder='请输入你的姓名' :disable='shown')
    cell(title='机构' v-model='user.institution' placeholder='请输入你所在的机构' :disable='shown')
    cell(title='邮箱' v-model='user.email' placeholder='请输入你的邮箱')
    cell(title='电话' v-model='user.phone' placeholder='请输入你的电话')
    cell(v-if='shown' title='密码' v-model='user.password' placeholder='请输入密码')
    cell(v-if='shown' title='密码确认' v-model='user.rePassword' placeholder='请输入确认密码')
    mt-button.submit-buttons(type='primary' @click='submit') 注册
</template>

<script>
  import { Header, Field, Cell, Button, Toast, Indicator } from 'mint-ui'
  import { formatDate } from '../../public/js/date'
  import io from 'socket.io-client'
  import cell from '../components/Cell.vue'

  export default {
    name: 'equipment-sample',

    components: {
      'mt-header': Header,
      'mt-field': Field,
      'mt-cell': Cell,
      'mt-button': Button,
      cell
    },

    data () {
      return {
        ctime: '',
        count: '',
        changed: false,
        user: {
          name: '',
          institution: '',
          email: '',
          phone: '',
          password: '',
          rePassword: ''
        },
        shown: true
      }
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      ConfirmTime: function (val) {
        this.ctime = val
        this.changed = true
      },
      filedClick: function () {
        this.$refs.picker.open()
      },
      postReservInfo: function () {
        console.log(formatDate(this.ctime, 'yyyy/MM/dd hh:mm'))
        let vm = this
        let id = this.$store.state.equipment.uuidToID[this.$router.currentRoute.params.id]
        let equipment = this.$store.state.equipment.equipment[id]

        let socketServer = io.connect('http://proxy.17kong.com/', {
          path: '/socket.io',
          authConnect: false,
          forceNew: true,
          timeout: 20000
        })
        let validationMessage = {
          id: this.$store.state.user.user.id,
          email: this.$store.state.user.user.email,
          source_name: equipment.source_name,
          socket: {}
        }
        socketServer
        .on('connect', msg => {
          socketServer
          .emit('auth', { form: JSON.stringify(validationMessage) })
        })
        .on('auth-reback', data => {
          if (data.authed !== true) return false
          vm.$http.post('/api/decryptUserInfo', {code: data.code}).then(res => {
            vm.code = res.data.code
            var formSample = {
              eid: equipment.id,
              samples: vm.count,
              description: '',
              submit_time: formatDate(this.ctime, 'yyyy/MM/dd hh:mm'),
              user: vm.$store.state.user.user.gapper_id,
              equipment: vm.$router.currentRoute.params.id,
              source_name: equipment.source_name,
              balance: vm.$store.state.billing.info.balance,
              user_info: {
                gapper_id: vm.$store.state.user.user.gapper_id,
                username: vm.$store.state.user.user.name,
                email: vm.$store.state.user.user.email
              },
              uuid: `wechatUUID_${vm.$router.currentRoute.params.id}`,
              socket: {
                url: equipment.socket_url,
                path: '/socket.io'
              }
            }
            socketServer.emit('yiqikong-sample', {
              code: vm.code,
              form: JSON.stringify(formSample)
            })
          }, res => {
            console.log('decryptUserInfo-failed', res)
          })
        })
        .on('yiqikong-sample-reback', msg => {
          console.log('送样返回值', msg)
          socketServer.disconnect()
        })
        socketServer.connect()
      },
      submit: function () {
        Indicator.open({
          text: '注册中',
          spinnerType: 'fading-circle'
        })
        let regEmail = /^[a-z0-9](\w|\.|-)*@([a-z0-9]+-?[a-z0-9]+\.){1,3}[a-z]{2,4}$/i
        let regPhone = /^1[3|4|5|7|8][0-9]{9}$/
        if (!this.user.name || !this.user.institution || !this.user.email || !this.user.phone || !this.user.password || !this.user.rePassword) {
          Toast('请填写全部项目')
          return false
        }
        if (this.user.email.match(regEmail) === null) {
          Toast('请正确填写邮箱')
          return false
        }
        if (this.user.phone.match(regPhone) === null) {
          Toast('请正确填写电话')
          return false
        }
        if (this.user.password !== this.user.rePassword) {
          Toast('两次输入密码有误请再次输入')
          return false
        }
        if (this.user.password.length <= 6) {
          Toast('密码太短，请重新填写')
          return false
        }
        let user = {
          name: this.user.name,
          institution: this.user.institution,
          phone: this.user.phone,
          email: this.user.email,
          password: this.user.password
        }
        let openid = this.$store.state.openid
        let unionid = this.$store.state.unionid
        let vm = this
        if (this.shown) {
          Promise.resolve()
          .then(() => {
            return vm.$store.dispatch('ADD_USER', user)
          })
          .then(res => {
            if (res) {
              return vm.$store.dispatch('LINK_IDENTITY', {
                gapperid: res,
                wechat: 'wechat',
                unionid
              })
            } else {
              throw new Error('邮箱或电话已经注册，请登录web版去绑定')
            }
          })
          .then(res => {
            if (res) {
              return vm.$store.dispatch('LINK_WECHAT', {
                email: vm.user.email,
                openid
              })
            } else {
              throw new Error('注册成功，绑定微信出现错误，请去web版绑定微信')
            }
          })
          .then(res => {
            if (!res) {
              throw new Error('注册成功，绑定微信出现错误，请去web版绑定微信')
            } else {
              this.$router.push({name: 'index'})
            }
            Indicator.close()
          })
          .catch(res => {
            Indicator.close()
            Toast(res.message)
          })
        } else {
          Promise.resolve()
          .then(() => {
            // return vm.$store.dispatch('ADD_GAPPER', user)
            return '1111'
          })
          .then(res => {
            if (res) {
              return vm.$store.dispatch('LINK_WECHAT', {
                email: vm.user.email,
                openid
              })
            } else {
              throw new Error('注册成功，绑定微信出现错误，请去web版绑定微信')
            }
          })
          .then(res => {
            if (!res) {
              throw new Error('注册成功，绑定微信出现错误，请去web版绑定微信')
            } else {
              this.$router.push({name: 'index'})
            }
            Indicator.close()
          })
          .catch(res => {
            Indicator.close()
            Toast(res.message)
          })
        }
      }
    },
    mounted () {
      if (this.$store.state.user) {
        this.user.name = this.$store.state.user.user.name
        this.user.email = this.$store.state.user.user.email
        this.user.password = '*******'
        this.user.rePassword = '*******'
        this.shown = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .datePicker
    color #393939
  .mint-cell-title
    flex inherit
    width 105px
  .submit-buttons
    position fixed
    bottom 0
    width 100%
  .mint-button--primary
    background-color #5f71d3
    border-radius 0px
</style>
