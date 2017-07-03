<template lang="pug">
  div
    mt-header(fixed title='送样')
      i.fa.fa-chevron-left.fa-fw(slot='left' @click='goBack')
    div
      mt-field(:value='name' label='姓名' placeholder='请输入您的姓名' style='margin-top:40px')
      mt-field(:value='count' type="number" label='样品数量' placeholder='数量')
      mt-cell.date-box(title='送样时间')
        span.datePicker.mint-field-core(@click='filedClick' v-if="changed") {{ ctime | formatDate }}
        span(v-else @click='filedClick') 请选择时间
    div.submit-buttons(style='padding-top:20px')
      div.action-button.left
        mt-button(type='primary' size='large' @click='postReservInfo') 确认
      div.action-button.right
        mt-button(type='primary' size='large' @click='goBack') 取消
    mt-date(v-model='ctime' :startDate='new Date()' ref='picker' type='datetime' @confirm="ConfirmTime")
</template>

<script>
  import { Header, DatetimePicker, Field, Cell, Button, Toast } from 'mint-ui'
  import { formatDate } from '../../../public/js/date'
  import io from 'socket.io-client'

  export default {
    name: 'equipment-sample',

    components: {
      'mt-header': Header,
      'mt-date': DatetimePicker,
      'mt-field': Field,
      'mt-cell': Cell,
      'mt-button': Button
    },

    data () {
      return {
        ctime: '',
        name: this.$store.state.user.user.name,
        count: '',
        changed: false
      }
    },
    beforeMount () {
      this.$store.dispatch('FETCH_COUNTINFO', this.$store.state.user.user.gapper_id)
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
        .on('yiqikong-sample-reback', data => {
          console.log('送样返回值', data)
          if (data.success === 1) {
            this.$store.dispatch('SAMPLE_SERVER', data.params.params).then(res => {
              console.log(res)
              Toast(res ? '送样成功' : '送样失败')
            })
          } else {
            console.log(data.error_msg)
            Toast(data.error_msg)
          }
          socketServer.disconnect()
        })
        socketServer.connect()
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd hh:mm')
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
      label
        margin-bottom 0px
    .action-button
      width 50%
      float left
      &.left
        border-right 1px solid #172a92
      &.right
        border-left 1px solid #b2beff
</style>
