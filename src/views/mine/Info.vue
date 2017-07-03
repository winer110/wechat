<template lang="pug">
  section
    mt-header(fixed title='我的信息')
      i.fa.fa-chevron-left.fa-fw(slot='left' @click='goBack')
    mt-cell(title='头像' style='margin-top:40px')
      img(solt='icon' :src='user.icon ? user.icon : src' height='64px')
    div.fill
    mt-cell(title='姓名' :value='user.name')
    mt-cell(title='邮箱' :value='user.email')
    mt-cell(title='电话' :value='user.phone')
</template>

<script>
import MtFooter from '../../components/Footer.vue'
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
      user: this.$store.state.user.user
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
    },
    goBack: function () {
      this.$router.go(-1)
    }
  },

  created () {
  }
}
</script>

<style lang="stylus">
// .mine-container
//   background-color #EEE
//   a, a:hover
//     text-decoration none
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
</style>
