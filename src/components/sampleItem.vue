<template lang="pug">
  div.cell(@click='getInfo')
    span.title {{ equipment.name }}
    span.detail 送样状态：{{ state }}
    span.detail 样品数量 {{ count }}
    span.detail 送样创建时间：{{ ctime }}
</template>

<script>
  export default {
    data () {
      return {
        default: {
          name: ''
        }
      }
    },
    props: ['sampleId', 'uuid', 'state', 'count', 'ctime'],
    computed: {
      id: function () {
        return this.$store.state.equipment.uuidToID.hasOwnProperty(this.uuid) ? this.$store.state.equipment.uuidToID[this.uuid] : this.uuid
      },
      equipment: function () {
        return this.$store.state.equipment.equipment[this.id] || this.default
      }
    },
    beforeMount () {
      this.$store.dispatch('FETCH_EQUIPMENT', this.uuid)
    },
    methods: {
      getInfo: function () {
        this.$router.push({name: 'ReservInfo', params: { id: this.sampleId }})
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cell
    display block
    height 100px
    border 1px solid #d9d9d9
    border-bottom none
    padding 5px 10px
    .title
      display block
      font-weight bold
      font-size 18px
    .detail
      display block
</style>
