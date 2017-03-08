<template>
  <div>
    <Tabbar fixed v-model="activeTab" @input="switchTab">
      <Tab-Item id="index">
        <i class="fa fa-home fa-2x" slot="icon"></i>
        大厅
      </Tab-Item>
      <Tab-Item id="follow">
        <i v-if="activeTab == 'follow'" class="fa fa-star fa-2x" slot="icon"></i>
        <i v-else class="fa fa-star-o fa-2x" slot="icon"></i>
        关注
      </Tab-Item>
      <Tab-Item id="mine">
        <i v-if="activeTab == 'mine'" class="fa fa-user fa-2x" slot="icon"></i>
        <i v-else class="fa fa-user-o fa-2x" slot="icon"></i>
        我的
      </Tab-Item>
    </Tabbar>
  </div>
</template>

<script>
import { Tabbar, TabItem } from 'mint-ui'
export default {
  name: 'mt-footer',

  components: {
    Tabbar,
    TabItem
  },

  props: [ 'value' ],

  data () {
    return {
      activeTab: this.value
    }
  },

  methods: {
    switchTab (tab) {
      this.$emit('switchTab', tab)
    }
  }
}
</script>

<style lang="stylus">
.mint-tabbar
  .mint-tab-item
    text-decoration none
    color #999
    &.is-selected
      color #5f71d3
      background-color transparent
    .mint-tab-item-icon
      width 36px
      height 30px
      margin 0 auto
</style>
