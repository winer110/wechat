<template lang="pug">
  section
    mt-header(fixed title='我的预约')
      i.fa.fa-chevron-left.fa-fw(slot='left' @click='goBack')
    div.more-container
      mt-loadmore(:bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="fill")
        ul.reserv-container
          mt-item(v-for="item in items" :key="item.id" :equipment="item.equipment" :ctime='item.start_time' :etime='item.end_time')
</template>

<script>
import MtFooter from '../../components/Footer.vue'
import Loadmore from '../../components/loadmore.vue'
import Item from '../../components/reservItem.vue'
import { Cell, Header } from 'mint-ui'
export default {
  name: 'mine',

  components: {
    MtFooter,
    'mt-header': Header,
    'mt-cell': Cell,
    'mt-item': Item,
    'mt-loadmore': Loadmore
  },

  data () {
    return {
      activeTab: 'mine',
      src: '/public/img/mine/me.png',
      user: this.$store.state.user.user,
      count: 0,
      items: []
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
  },

  methods: {
    goBack: function () {
      this.$router.go(-1)
    }
  },

  mounted () {
    Promise.resolve()
    .then(() => {
      return this.$store.dispatch('RESERVE_TOKEN', this.user.gapper_id)
    })
    .then(res => {
      return this.$store.dispatch('RESERVE_LIST', {
        token: res.token,
        count: this.count,
        step: 10
      })
    })
    .then(res => {
      for (let i in res) {
        this.items.push(res[i])
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
  .more-container
    padding-top 40px
  .fill
    display block
    height 30px
    width 100%
    padding 0 10px
    border-top 1px solid #d9d9d9
    border-bottom 1px solid #d9d9d9
    background #d9d9d9
    box-sizing border-box
  .mint-cell-wrapper
    background-origin padding-box
  .reserv-container
    padding-left 0
</style>
