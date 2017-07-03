<template lang="pug">
  li.equipment-item(@click.stop='goToEqInfo(item.id)')
    div.media
      div.media-left
        img.img-rounded(:src='equipment.icon || icon' height='86px' width='86px')
      div.media-body
        div.title {{ name }}
          div.tags
            span.label.label-primary(v-show='equipment.can_reserv' style='margin-right:5px') 预约
            span.label.label-primary(v-show='equipment.can_sample') 送样
          p
            i.fa.fa-user.fa-fw/ {{ equipment.contact_name }}
          p
            i.fa.fa-map-marker.fa-fw/ {{ equipment.location }}
</template>

<script>
export default {
  props: ['item'],

  data () {
    return {
      default: {
        icon: '/public/img/equipment/default.png',
        can_reserv: false,
        can_sample: false,
        name: '',
        location: '',
        contact_name: ''
      }
    }
  },

  methods: {
    goToEqInfo () {
      this.$router.push({name: 'equipment-info', params: { id: this.equipment.uuid }})
    }
  },

  beforeMount () {
    this.$store.dispatch('FETCH_EQUIPMENT', this.item.id)
  },
  computed: {
    equipment: function () {
      return this.$store.state.equipment.equipment[this.id] || this.default
    },
    name: function () {
      return this.equipment.name || this.item.name
    },
    id: function () {
      return this.$store.state.equipment.uuidToID.hasOwnProperty(this.item.id) ? this.$store.state.equipment.uuidToID[this.item.id] : this.item.id
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
.equipment-item
  padding 10px 20px 0
  position relative
  line-height 20px
  list-style none
  .media
    border-bottom 1px solid #eee
    padding-bottom 10px
    color #999
    .media-body
      .title
        .tags
          float right
  &:active
    background-color #eee
    .media
      color #5f71d3
</style>
