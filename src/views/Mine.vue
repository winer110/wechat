<template>
  <div class="mine-container">
    <mt-header fixed title="个人中心"></mt-header>
    <div style="padding-top: 40px;">
      <mt-cell :title="currentUser.name" is-link to="/wechat/mine/info">
        <img slot="icon"  :src="currentUser.icon ? currentUser.icon : src" height="64px" style="margin: 20px 0px;"/>
      </mt-cell>
    </div>
    <div style="padding-top: 20px;">
      <mt-cell title="我的预约" is-link to="/wechat/mine/reserv" >
        <img slot="icon"  src="/public/img/mine/reserv.png" style="margin-right: 5px;" />
      </mt-cell>
      <mt-cell title="我的送样" is-link to="/wechat/mine/sample" >
        <img slot="icon"  src="/public/img/mine/sample.png" style="margin-right: 5px;" />
      </mt-cell>
      <mt-cell title="我的使用" is-link to="/wechat/mine/use" >
        <img slot="icon"  src="/public/img/mine/use.png" />
      </mt-cell>
    </div>
    <div style="padding-top: 20px;">
      <mt-cell title="我的账户">
        <img slot="icon"  src="/public/img/mine/card.png" />
      </mt-cell>
    </div>
    <div style="padding-top: 20px;">
      <mt-cell title="设置" is-link>
        <img slot="icon"  src="/public/img/mine/setting.png" />
      </mt-cell>
    </div>
    <mt-footer v-bind:value="activeTab" @switchTab="switchTab"></mt-footer>
  </div>
</template>

<script>
import MtFooter from '../components/Footer.vue'
import { Cell, Header } from 'mint-ui'
export default {
  name: 'mine',

  components: {
    MtFooter,
    'mt-header': Header,
    'mt-cell': Cell
  },

  data () {
    return {
      activeTab: 'mine',
      src: '/public/img/mine/me.png',
      currentUser: this.$store.state.currentUser
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
  },

  methods: {
    switchTab (tab) {
      this.$router.replace({
        path: '/wechat/' + tab
      })
    }
  },

  created () {
  }
}
</script>

<style lang="stylus">
.mine-container
  background-color #EEE
  a, a:hover
    text-decoration none
</style>
