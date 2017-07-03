<template lang="pug">
  div.cell
    span.title {{ equipment }}
    span.time 起始时间：{{ ctime | formatDate }}
    span.time 结束时间：{{ etime | formatDate }}
</template>

<script>
  import { formatDate } from '../../public/js/date'

  export default {
    props: ['equipment', 'ctime', 'etime'],
    filters: {
      formatDate (time) {
        let date = new Date(time * 1000)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cell
    display block
    height 80px
    border 1px solid #d9d9d9
    border-bottom none
    padding 5px 10px
    .title
      display block
      font-weight bold
      font-size 18px
    .time
      display block
</style>
