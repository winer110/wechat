<template>
  <div class="eq-info-reserv-container">
    <mt-header fixed title="申请预约">
      <i class="fa fa-chevron-left fa-fw" slot="left" @click="goBack"></i>
    </mt-header>
    <G-calendar :dater='dater' @dateChange="dateChange" @daterChange='daterChange'></G-calendar>
    <div style="padding-top: 10px;">
      <mt-cell title="已有预约">
        <img slot="icon"  src="/public/img/mine/reserv.png" style="margin-right: 5px;" />
      </mt-cell>
    <template v-if="reserves.length > 0">
      <mt-cell title="仪器使用预约" v-show="reserves.length" v-for="reserve in reserves" :key="reserve.id">
        {{ reserve.start_time | formatDate}} ~
        {{ reserve.end_time | formatDate}}
      </mt-cell>
    </template>
      <template v-if="reserves.length == 0">
        <mt-cell v-show="loading == true">
          <mt-spinner :type="1" color="#5F71D3" slot="title"></mt-spinner>
        </mt-cell>
        <mt-cell v-show="loading == false" title="暂无人预约">
        </mt-cell>
      </template>
    </div>
    <div style="padding-top: 10px;" ref="input">
      <mt-field label="姓名" placeholder="请输入您的姓名" :value="name"></mt-field>
      <mt-cell title="起始时间" class="date-box">
        <span :class="{'gray': startPlaceholder}" class="mint-field-core datePicker" @click="startFiledClick">{{ startTime }}</span>
      </mt-cell>
      <mt-cell title="结束时间" class="date-box">
        <span :class="{'gray': endPlaceholder}" class="mint-field-core datePicker" @click="endFiledClick">{{ endTime }}</span>
      </mt-cell>
      <mt-field label="备注" placeholder="输入不超过500字" type="textarea" rows="4"></mt-field>
    </div>
    <div class="submit-buttons" style="padding-top:20px">
      <div class="action-button left">
        <mt-button type="primary" size="large" @click="postReservInfo">确认</mt-button>
      </div>
      <div class="action-button right">
        <mt-button type="primary" size="large" @click="goBack">取消</mt-button>
      </div>
    </div>
    <mt-datetime-picker
      ref="timePicker"
      type="time"
      @confirm="ConfirmTime">
    </mt-datetime-picker>
  </div>
</template>

<script>
import Calendar from '../../components/Calendar.vue'
import { Cell, Header, Button, Spinner, Field, DatetimePicker, MessageBox, Indicator } from 'mint-ui'
import { formatDate } from '../../../public/js/date'
import io from 'socket.io-client'

export default {
  name: 'equipment-reserv',

  components: {
    'mt-cell': Cell,
    'mt-spinner': Spinner,
    'mt-field': Field,
    'mt-header': Header,
    'mt-button': Button,
    'mt-datetime-picker': DatetimePicker,
    'G-calendar': Calendar,
    MessageBox,
    Indicator
  },

  data () {
    return {
      reserves: [],
      loading: true,
      currentChooseTime: 'start',
      startTime: '00:00',
      startPlaceholder: true,
      endTime: '23:59',
      endPlaceholder: true,
      name: this.$store.state.user.user.name,
      code: '',
      dater: new Date()
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
    this.$store.dispatch('FETCH_COUNTINFO', this.$store.state.user.user.gapper_id)
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    },

    startFiledClick () {
      this.currentChooseTime = 'start'
      this.$refs.timePicker.open()
    },

    endFiledClick () {
      this.currentChooseTime = 'end'
      this.$refs.timePicker.open()
    },

    dateChange (date) {
      this.getChooseDayReserves(date)
      this.dater = date
    },
    daterChange (date) {
      this.dater = date
    },
    ConfirmTime (val) {
      if (this.currentChooseTime === 'start') {
        this.startPlaceholder = false
        this.startTime = val
      } else {
        this.endPlaceholder = false
        this.endTime = val
      }
    },

    getChooseDayReserves (d) {
      this.loading = true
      let date = d ? new Date(d) : new Date()
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      this.$store.dispatch('FETCH_RESERVE', {
        uuid: this.$router.currentRoute.params.id,
        startTime: date.getTime() / 1000,
        endTime: date.getTime() / 1000 + 24 * 3600
      }).then(res => {
        this.loading = false
        this.reserves = []
        for (let i in res) {
          this.reserves.push(res[i])
        }
      })
    },
    // 点击确认发送预约信息
    postReservInfo () {
      // Indicator.open({
      //   text: '预约中',
      //   spinnerType: 'fading-circle'
      // })
      // let reservName = document.querySelector('input[type=text]').value
      // let reservRemark = document.querySelector('textarea').value
      // let message = `名字：${reservName}<br/>起始时间：${this.startTime}<br/>结束时间：${this.endTime}<br/>备注：${reservRemark}`
      // MessageBox.confirm(message).then(action => {
      //   console.log('hello')
      // })
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
          let start = new Date(vm.dater + ' ' + vm.startTime)
          let end = new Date(vm.dater + ' ' + vm.endTime)
          var form = {
            equipment: vm.$router.currentRoute.params.id,
            dtstart: formatDate(start, 'yyyy/MM/dd hh:mm'),
            dtend: formatDate(end, 'yyyy/MM/dd hh:mm'),
            extra: {},
            description: '',
            user: vm.$store.state.user.user.gapper_id,
            title: '仪器使用预约',
            source_name: equipment.source_name,
            user_info: {
              gapper_id: vm.$store.state.user.user.gapper_id,
              username: vm.$store.state.user.user.name,
              email: vm.$store.state.user.user.email
            },
            balance: vm.$store.state.billing.info.balance,
            tube: vm.$router.currentRoute.params.id,
            uuid: `wechatUUID_${vm.$router.currentRoute.params.id}`,
            socket: {
              url: equipment.socket_url,
              path: '/socket.io'
            }
          }
          socketServer.emit('yiqikong-reserv', {
            code: vm.code,
            form: JSON.stringify(form)
          })
        }, res => {
          console.log('decryptUserInfo-failed', res)
        })
      })
      .on('yiqikong-reserv-reback', msg => {
        console.log('预约返回值', msg)
        socketServer.disconnect()
      })
      socketServer.connect()
    }
  },

  filters: {
    formatDate (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'hh:mm')
    }
  },

  created () {
    this.getChooseDayReserves()
  }
}
</script>
<style lang="stylus">
.eq-info-reserv-container
  background-color #EEEEEE
  a.date-box
    text-decoration none
    .mint-cell-title
      width 105px
      flex none
  .datePicker
    width 160px
    color #393939
    &.gray
      color #A7A7A7
  .submit-buttons
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
