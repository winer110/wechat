<template>
  <header class="mint-header is-fixed">
    <div class="scope-container">
        <select class="select" v-model="siteScope">
          <option value="local">本站仪器</option>
          <option value="all">全部仪器</option>
        </select>
    </div>
    <div class="search-container">
      <input placeholder="请输入您需要搜索的内容" type="search" class="mint-field-core" style="" v-model="searchKeywords"/>
      <button class="search" @click="searchCommit">
        <i class="fa fa-search fa-fw"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'mt-header',

  props: [
    'scope',
    'keywords'
  ],

  data () {
    return {
      siteScope: this.scope,
      searchKeywords: this.keywords
    }
  },

  methods: {
    searchCommit () {
      this.$emit('searchCommit', this.searchKeywords)
    }
  },

  watch: {
    siteScope (val) {
      this.$emit('changeScope', val)
    },

    keywords (val) {
      this.searchKeywords = val
    }
  }
}
</script>
<style lang="stylus">
.mint-header
  background-color #5f71d3
  h1
    margin-top 10px
.scope-container
  float left
  width 30%
  height 100%
  .select
    height 100%
    background transparent
    color #FFFFFF
    border 0px
    font-size 18px
    line-height 40px
    -moz-appearance none
    -webkit-appearance none
    appearance none
.search-container
  width 70%
  color #5f71d3
  input
    height 32px
    border-radius 10px
    padding-left 10px
  .search
    height 32px
    position absolute
    right 10px
    background transparent
    border 0px
</style>