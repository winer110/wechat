<template lang="pug">
  section
    mt-header(fixed title='使用记录')
      i.fa.fa-chevron-left.fa-fw(slot='left' @click='goBack')
    div.more-container
      mt-loadmore(:bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore")
        ul.reserv-container
          mt-item(v-for="item in items" :key="item.id" :uuid="item.equipment" :start_time='item.start_time' :end_time='item.end_time' :count='item.samples' :sampleId='item.id')
</template>

<script>
import MtFooter from '../../components/Footer.vue'
import Loadmore from '../../components/loadmore.vue'
import Item from '../../components/recordItem.vue'
import { Cell, Header, Toast } from 'mint-ui'
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
      items: [],
      start: 0,
      step: 10,
      allLoaded: false,
      token: ''
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
  },

  methods: {
    goBack: function () {
      this.$router.go(-1)
    },
    loadBottom (fn = () => {}) {
      let vm = this
      Promise.resolve()
      .then(() => {
        if (!vm.token) {
          return vm.$store.dispatch('RECORD_TOKEN', this.user.gapper_id)
        } else {
          return vm
        }
      })
      .then(res => {
        vm.token = res.token
        return vm.$store.dispatch('RECORD_LIST', {
          token: res.token,
          count: vm.start,
          step: vm.step
        })
      })
      .then(res => {
        console.log(res)
        if (res) {
          for (let i in res) {
            this.items.push(res[i])
          }
          vm.start += vm.step
        } else {
          Toast({
            message: '送样记录已经全部显示',
            position: 'bottom',
            duration: 3000
          })
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
  computed: {
    items: function () {
      return this.$store.state.sample.record
    }
  },
  mounted () {
    this.loadBottom()
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
