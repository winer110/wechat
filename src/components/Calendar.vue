<template>
  <div class="eq-info-reserv">
    <div id="calendar">
    <!-- 年份 月份 -->
      <div class="choose">
        <div class="container">
          <div class="row years">
            <div class="col-xs-6 left">
              <div class="col-xs-3 arrow" @click="preYear"><i class="fa fa-fw fa-angle-left"></i></div>
              <div class="col-xs-6 text">
                <span class="choose-year">{{ currentYear }}</span>
              </div>
              <div class="col-xs-3 arrow" @click="nextYear"><i class="fa fa-fw fa-angle-right"></i></div>
            </div>
            <div class="col-xs-6 right">
              <div class="col-xs-3 arrow" @click="preMonth"><i class="fa fa-fw fa-angle-left"></i></div>
              <div class="col-xs-6 text">
                <span class="choose-month">{{ currentMonth }}月</span>
              </div>
              <div class="col-xs-3 arrow" @click="nextMonth"><i class="fa fa-fw fa-angle-right"></i></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li style="color:red">六</li>
        <li style="color:red">日</li>
      </ul>
<!-- 日期 -->
      <ul class="days">
        <li @click="pick(day)" v-for="day in days">
          <!--本月-->
          <span v-if="day.getMonth() + 1 != currentMonth" class="other-month">{{ day.getDate() > 9 ? day.getDate() : `0${day.getDate()}` }}</span>
          <span v-else>
          <!--今天-->
            <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active">{{ day.getDate() > 9 ? day.getDate() : `0${day.getDate()}` }}</span>
            <span v-else>{{ day.getDate() > 9 ? day.getDate() : `0${day.getDate()}` }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',

  components: {
  },

  data () {
    return {
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: []
    }
  },
  props: ['dater'],
  // 服务端渲染时候该方法不加载
  beforeMount () {
  },

  methods: {
    initData (current) {
      let date = current ? new Date(current) : new Date()
      this.currentDay = date.getDate()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.currentWeek = date.getDay()
      this.currentWeek = date.getDay() === 0 ? 7 : date.getDay()
      this.days.length = 0
      let format = this.formatDate(date.getFullYear(), date.getMonth(), date.getDate())
      // 今天是周日，放在第一行第7个位置，前面6个
      for (let i = this.currentWeek - 1; i >= 0; i--) {
        let d = new Date(format)
        d.setDate(d.getDate() - i)
        this.days.push(d)
      }
      for (let i = 1; i <= 35 - this.currentWeek; i++) {
        let d = new Date(format)
        d.setDate(d.getDate() + i)
        this.days.push(d)
      }
      this.$emit('daterChange', this.formatDate(date.getFullYear(), date.getMonth(), date.getDate()))
    },

    formatDate (year, month, day) {
      let y = year
      let m = month + 1
      let d = day
      if (m > 12) {
        m = 1
        y = y + 1
      } else if (m <= 0) {
        m = 12
        y = y - 1
      }
      return `${y}-${m}-${d}`
    },

    preYear () {
      let d = this.dater
      this.initData(this.formatDate(d.getFullYear() - 1, d.getMonth(), d.getDate()))
    },

    nextYear () {
      let d = this.dater
      this.initData(this.formatDate(d.getFullYear() + 1, d.getMonth(), d.getDate()))
    },

    preMonth () {
      let d = this.dater
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() - 1, d.getDate()))
    },

    nextMonth () {
      let d = this.dater
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate()))
    },

    pick (date) {
      this.$emit('dateChange', this.formatDate(date.getFullYear(), date.getMonth(), date.getDate()))
    }
  },

  created () {
    this.initData(null)
  }
}
</script>
<style lang="stylus">
  .eq-info-reserv
    box-sizing border-box
    background #FFFFFF
    ul
      list-style-type none
    #calendar
      width 100%
      margin-top 40px
      box-shadow 0 1px 1px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.12)
      .choose
        width 100%
        border-bottom 2px solid #EEE
        ul
          margin 0
          padding 0
          display flex
          justify-content space-between
          li
            color #CCC
            font-size 20px
            text-transform uppercase
            letter-spacing 3px
        .years
          padding 10px 0
          font-size 1.8rem
          color #666
          .arrow
            padding 0 10px
            color #c7cbd8
          .text
            text-align center
          .left
            border-right 2px solid #EEE
      .weekdays
        margin 0
        padding 6px 0
        display flex
        flex-wrap wrap
        color #CCC
        justify-content space-around
        li
          display inline-block
          width 13.6%
          text-align center
      .days
        padding-bottom 6px
        padding-left 0px
        margin 0
        display flex
        flex-wrap wrap
        justify-content space-around
        li
          list-style-type none
          display inline-block
          width 14.2%
          text-align center
          padding 8px 0px
          font-size 1.26rem
          color #666666
          .active
            padding 6px 8px
            border-radius 50%
            background #e1e1e1
            color #FFF
          .other-month
            color #c7cbd8
          &:hover
            span > span, .other-month
              background #5f71d3
              padding 6px 8px
              border-radius 50%
              color #FFF
</style>
