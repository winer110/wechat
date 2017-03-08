<template>
  <div>
    <mt-header :scope="scope" @changeScope="changeScope" :keywords="keywords" @searchCommit="searchCommit"></mt-header>
    <div class="more-container">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
        <ul class="equipment-container">
          <eq-item v-for="item in displayItems" :key="item.id" :item="item"></eq-item>
        </ul>
      </mt-loadmore>
    </div>
    <mt-footer :value="activeTab" @switchTab="switchTab"></mt-footer>
  </div>
</template>

<script>
import MtHeader from '../components/Header.vue'
import MtFooter from '../components/Footer.vue'
import EqItem from '../components/equipment/Item.vue'
import { Loadmore, Toast } from 'mint-ui'
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
      keywords: '',
      displayItems: [],
      allLoaded: false,
      start: 0,
      step: 15
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
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
      let me = this
      me.$http.post('/api/searchEquipments', {
        scope: me.scope,
        keywords: me.keywords,
        start: me.start,
        step: me.step
      }).then(res => {
        if (res.body.length > 0) {
          for (let i in res.body) {
            let item = res.body[i]
            if (item.id && item.name) me.displayItems.push(item)
          }
          me.start = me.start + me.step
        } else {
          me.allLoaded = true
        }
        me.$refs.loadmore.onBottomLoaded()
        fn()
      }, res => {
        me.$refs.loadmore.onBottomLoaded()
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
.more-container
  position absolute
  padding 40px 0 56px
.equipment-container
  margin 0px
  padding 0px
</style>