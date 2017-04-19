<template>
  <div class="eq-info-reserv-container">
    <mt-header fixed title="申请预约">
      <i class="fa fa-chevron-left fa-fw" slot="left" @click="goBack"></i>
    </mt-header>
    <G-calendar @dateChange="dateChange"></G-calendar>
    <div style="padding-top: 10px;">
      <mt-cell title="已有预约">
        <img slot="icon"  src="/public/img/mine/reserv.png" style="margin-right: 5px;" />
      </mt-cell>
      <template v-if="reserves.length > 0">
        <mt-cell title="我的送样"></mt-cell>
      </template>
      <template v-if="reserves.length == 0">
        <mt-cell v-show="loading == true">
          <mt-spinner :type="1" color="#5F71D3" slot="title"></mt-spinner>
        </mt-cell>
        <mt-cell v-show="loading == false" title="暂无人预约">
          <ul v-show="reserves.length" v-for="reserve in reserves">
          <li>{{ reserve.start_time }}</li>
          </ul>
        </mt-cell>
      </template>
    </div>
    <div style="padding-top: 10px;">
      <mt-field label="姓名" placeholder="请输入您的姓名"></mt-field>
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
import { Cell, Header, Button, Spinner, Field, DatetimePicker } from 'mint-ui'
export default {
  name: 'equipment-reserv',

  components: {
    'mt-cell': Cell,
    'mt-spinner': Spinner,
    'mt-field': Field,
    'mt-header': Header,
    'mt-button': Button,
    'mt-datetime-picker': DatetimePicker,
    'G-calendar': Calendar
  },

  data () {
    return {
      reserves: [],
      loading: true,
      currentChooseTime: 'start',
      startTime: '00:00',
      startPlaceholder: true,
      endTime: '23:59',
      endPlaceholder: true
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
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
      let date = new Date(d)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      console.log('getTime', date.getTime())

      this.$store.dispatch('FECTH_RESERVES', {
        uuid: this.$router.currentRoute.params.id,
        startTime: date.getTime() / 1000,
        endTime: date.getTime() / 1000 + 24 * 3600
      }).then(res => {
        console.log(res)
      })
      // this.$http.post('/api/searchReserves', {
      //   uuid: this.$router.currentRoute.params.id,
      //   startTime: date.getTime() / 1000,
      //   endTime: date.getTime() / 1000 + 24 * 3600
      // }).then(res => {
      //   console.log(res)
      //   this.loading = false
      // }, res => {
      //   this.loading = false
      // })
    },
    // 点击确认发送预约信息
    postReservInfo () {
      console.log('post')
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
