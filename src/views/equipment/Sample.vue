<template lang="pug">
  div
    mt-header(fixed title='送样')
      i.fa.fa-chevron-left.fa-fw(slot='left' @click='goBack')
    div
      mt-field(:value='name' label='姓名' placeholder='请输入您的姓名')
      mt-field(:value='count' label='姓名' placeholder='请输入您的姓名')
      mt-cell.date-box(title='送样时间')
    mt-date(v-model='ctime' ref='picker' type='datetime' month-format='{value}月' date-format='{value}日' @confirm="ConfirmTime")
</template>

<script>
  import { Header, DatetimePicker, Field, Cell } from 'mint-ui'

  export default {
    name: 'equipment-sample',

    components: {
      'mt-header': Header,
      'mt-date': DatetimePicker,
      'mt-field': Field,
      'mt-cell': Cell
    },

    data () {
      return {
        ctime: '',
        name: '',
        count: ''
      }
    },

    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      ConfirmTime (val) {
        this.ctime = val
      }
    },
    mounted () {
      this.$refs.picker.open()
    }
  }
</script>

<style lang="stylus">

</style>
