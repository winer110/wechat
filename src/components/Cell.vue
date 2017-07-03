<template lang="pug">
  div.cell
    div.title
      span {{ title }}
    div.value
      span(v-if='disable') {{ value }}
      input(v-else :value='value' @input='updateValue($event.target.value)' :placeholder='placeholder' type='text')
</template>

<script>
  export default {
    props: ['title', 'value', 'placeholder', 'disable'],
    methods: {
      updateValue: function (value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cell
    display flex
    border 1px solid #d9d9d9
    height 40px
    background #fff
    border-top none
    .title
      display flex
      flex 1
      line-height 38px
      span
        padding-left 10px
    .value
      display flex
      flex 2
      input
        width 100%
        outline 0
      span
        line-height 39px
        padding-left 4px
</style>
