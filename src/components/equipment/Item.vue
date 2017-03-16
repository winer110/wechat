<template>
  <li class="equipment-item" @click.stop="goToEqInfo(item.uuid)">
    <div class="media">
      <div class="media-left">
        <img :src="theItem.icon ? item.icon : src" height="86px" width="86px" class="img-rounded">
      </div>
      <div class="media-body">
        <div class="title">
          {{ item.name }}
          <div class="tags">
            <span v-show="theItem.can_reserv" class="label label-primary">预约</span>&#160;
            <span v-show="theItem.can_sample" class="label label-primary">送样</span>
          </div>
        </div>
        </p>
        <p>
          <i class="fa fa-user fa-fw"></i>
          {{  theItem.contact_name }}
        </p>
        <p>
          <i class="fa fa-map-marker fa-fw"></i>
          {{ theItem.location }}
        </p>
      </div>
    </div>
  </li>
</template>

<script>
function fetchEquipment (vm) {
  return vm.$store.dispatch('FETCH_EQUIPMENT', vm.item.id)
}

export default {
  props: ['item'],

  data () {
    return {
      src: '/public/img/equipment/default.png'
    }
  },

  methods: {
    goToEqInfo (id = 0) {
      this.$router.push({name: 'equipment-info', params: { id: id }})
    }
  },

  computed: {
    theItem: function () {
      return this.$store.state.equipments[this.item.id]
    }
  },

  preFetch: fetchEquipment,
  beforeMount () {
    fetchEquipment(this)
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
