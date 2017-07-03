<template lang="pug">
  div
    mt-header(:scope="scope" @changeScope="changeScope" :keywords="keywords" @searchCommit="searchCommit")
    div.more-container
      mt-loadmore(:bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill="fill")
        ul.equipment-container(ref='ul')
          eq-item(v-for="item in displayItems" :key="item.id" :item="item")
    mt-footer(:value="activeTab" @switchTab="switchTab")
</template>

<script>
import MtHeader from '../components/Header.vue'
import Loadmore from '../components/loadmore.vue'
import MtFooter from '../components/Footer.vue'
import EqItem from '../components/equipment/Item.vue'
import { Toast } from 'mint-ui'

export default {
  name: 'home',

  components: {
    MtHeader,
    MtFooter,
    EqItem,
    'mt-loadmore': Loadmore
  },

  data () {
    return {
      activeTab: 'index',
      scope: 'all',
      fill: false,
      translate: 50,
      keywords: '',
      displayItems: [],
      allLoaded: false,
      start: 0,
      step: 15
    }
  },

  methods: {
    // Footer下方tab进行切换时进行的操作
    switchTab (tab) {
      this.$router.replace({
        path: '/wechat/' + tab
      })
    },
    // Header上site-Scope切换后出发的操作
    changeScope (val) {
      let me = this
      let toast = Toast({
        message: '请等待',
        iconClass: 'fa fa-spin fa-spinner fa-2x'
      })
      me.reset()
      me.scope = val
      me.loadBottom(() => {
        toast.close()
      })
    },
    // 模糊查询之后获取到相应的数据进行模糊匹配搜索
    searchCommit (val) {
      let me = this
      if (val === me.keywords) return
      let toast = Toast({
        message: '请等待',
        iconClass: 'fa fa-spin fa-spinner fa-2x'
      })
      me.reset()
      me.keywords = val
      me.loadBottom(() => {
        toast.close()
      })
    },

    reset () {
      this.displayItems = []
      this.start = 0
      this.keywords = ''
    },
    // 加载仪器数据
    loadBottom (fn = () => {}) {
      let vm = this
      Promise.resolve()
      .then(() => {
        return vm.$store.dispatch('EQ_TOKEN', vm.keywords)
      })
      .then(res => {
        return this.$store.dispatch('EQ_LIST', {
          token: res.token,
          start: vm.start,
          step: vm.step
        })
      })
      .then(res => {
        if (res) {
          for (let id in res) {
            vm.displayItems.push({ id, name: res[id] })
          }
          vm.start += vm.step
        } else {
          vm.allLoaded = true
        }
        vm.$refs.loadmore.onBottomLoaded()
        fn()
      }, res => {
        vm.$refs.loadmore.onBottomLoaded()
        fn()
      })
    }
  },
  created () {
    this.loadBottom()
  }
}
</script>

<style lang="stylus" scoped>
.header
  display block
  height 40px
  width 100%
  background #bcbcbc
.more-container
  padding-top 40px
  padding-bottom 56px
.equipment-container
  margin 0px
  padding 0px
</style>
