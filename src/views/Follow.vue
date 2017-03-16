<template>
  <div>
    <mt-header fixed title="我的关注"></mt-header>
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
import MtFooter from '../components/Footer.vue'
import EqItem from '../components/equipment/Item.vue'
import { Loadmore, Header, Toast } from 'mint-ui'

export default {
  name: 'follow',

  components: {
    MtFooter,
    EqItem,
    'mt-loadmore': Loadmore,
    'mt-header': Header
  },

  data () {
    return {
      activeTab: 'follow',
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
    // 加载仪器数据
    loadBottom (fn = () => {}) {
      let me = this
      me.$http.post('/api/searchFollows', {
        start: me.start,
        step: me.step,
        id: me.$store.state.currentUser.gapper_id
      }).then(res => {
        if (res.data.length === 0) {
          me.allLoaded = true
        } else if (res.data.length < 15) {
          me.allLoaded = true
          for (let i in res.data) {
            let item = res.data[i]
            if (item.id && item.name) me.displayItems.push(item)
          }
          me.start = me.start + me.step
        } else {
          for (let i in res.data) {
            let item = res.data[i]
            if (item.id && item.name) me.displayItems.push(item)
          }
          me.start = me.start + me.step
        }
        me.$refs.loadmore.onBottomLoaded()
        fn()
      })
    },

    handleBottomChange (status) {
      console.log(status)
    }
  },

  created () {
    let toast = Toast({
      message: '请等待',
      iconClass: 'fa fa-spin fa-spinner fa-2x'
    })
    this.loadBottom(() => {
      toast.close()
    })
  }
}
</script>

<style lang="stylus">
.more-container
  position absolute
  padding 40px 0 56px
.equipment-container
  margin 0px
  padding 0px
</style>
