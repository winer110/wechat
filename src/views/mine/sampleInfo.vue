<template lang="pug">
  section
    mt-header(fixed title='送样详情')
      i.fa.fa-chevron-left.fa-fw(slot='left' @click='goBack')
    mt-cell(title='仪器名称' :value='equipment.name' style='margin-top:40px')
    mt-cell(title='状态' :value='sample.state')
    mt-cell(title='仪器地址' :value='equipment.location')
    mt-cell(title='联系人' :value='equipment.contact_name')
    mt-cell(title='联系方式' :value='equipment.contact_phone')
    mt-cell(title='送样时间' :value='sample.submit_time')
    mt-cell(title='测试起始时间' :value='sample.start_time')
    mt-cell(title='测样结束时间' :value='sample.end_time')
    mt-cell(title='取样时间' :value='sample.pickup_time')
    mt-cell(title='描述' :value='sample.description')
    mt-button.button(size='large' type='primary') 再次送样
</template>

<script>
import { Cell, Header, Button, Loadmore } from 'mint-ui'
export default {
  components: {
    'mt-header': Header,
    'mt-cell': Cell,
    'mt-loadmore': Loadmore,
    'mt-button': Button
  },

  data () {
    return {
      user: this.$store.state.user.user,
      sampleID: this.$route.params.id
    }
  },

  computed: {
    sample: function () {
      return this.$store.state.sample.record[this.sampleID]
    },
    id: function () {
      return this.$store.state.equipment.uuidToID.hasOwnProperty(this.sample.equipment) ? this.$store.state.equipment.uuidToID[this.sample.equipment] : this.sample.equipment
    },
    equipment: function () {
      return this.$store.state.equipment.equipment[this.id]
    }
  },

  methods: {
    goBack: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .button
    border-radius 0
    position fixed
    bottom 0
    background-color #5f71d3
</style>
