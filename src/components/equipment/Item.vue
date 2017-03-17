<template>
  <li class="equipment-item" @click.stop="goToEqInfo(item.id)">
    <div class="media">
      <div class="media-left">
        <img :src="equipment.icon" height="86px" width="86px" class="img-rounded">
      </div>
      <div class="media-body">
        <div class="title">
          {{ item.name }}
          <div class="tags">
            <span v-show="equipment.can_reserv" class="label label-primary">预约</span>&#160;
            <span v-show="equipment.can_sample" class="label label-primary">送样</span>
          </div>
        </div>
        </p>
        <p>
          <i class="fa fa-user fa-fw"></i>
          {{  equipment.contact_name }}
        </p>
        <p>
          <i class="fa fa-map-marker fa-fw"></i>
          {{ equipment.location }}
        </p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ['item'],

  data () {
    return {
      equipment: {
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
    goToEqInfo (id = 0) {
      this.$router.push({name: 'equipment-info', params: { id: id }})
    }
  },

  mounted () {
    let vm = this
    this.$store.dispatch('FETCH_EQUIPMENT', this.item.id).then(res => {
      Object.assign(vm.equipment, vm.$store.state.equipments[this.item.id])
      if (!vm.equipment.icon) {
        vm.equipment.icon = '/public/img/equipment/default.png'
      }
    })
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
