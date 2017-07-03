<template lang="pug">
  div.cell(@click='getInfo')
    span.title {{ equipment.name }}
    span.detail 使用者姓名 {{ user.name }}
    span.detail 课题组
    span.detail 使用时间 {{ start_time | formatDate }} - {{ end_time | formatDate }}
    span.detail 使用收费 {{ count }}
</template>

<script>
  import { formatDate } from '../../public/js/date'
  export default {
    data () {
      return {
        default: {
          name: ''
        },
        user: this.$store.state.user.user
      }
    },
    props: ['sampleId', 'uuid', 'count', 'start_time', 'end_time'],
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
    filters: {
      formatDate (time) {
        let date = new Date(time * 1000)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  .cell
    display block
    height 110px
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
