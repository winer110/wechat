<template>
  <div class="eq-info-root">
    <mt-header fixed title="仪器详情">
      <i class="fa fa-chevron-left fa-fw" slot="left" @click="goBack"></i>
    </mt-header>
    <div class="eq-info-container">
      <div class="media">
        <div class="media-left">
            <img :src="equipment.icon ? equipment.icon : src" height="64px" width="64px" class="img-rounded">
        </div>
        <div class="media-body">
          <div class="title">
            {{ equipment.name }}
            <div class="status" v-show="status === false">
              <mt-spinner :type="1"  color="#5f71d3"></mt-spinner>
            </div>
            <div class="status" v-show="status == 1">
              <mt-badge size="small" color="#CCCCCC">未使用</mt-badge>
            </div>
            <div class="status" v-show="status == 2">
              <mt-badge type="success" size="small">使用中</mt-badge>
            </div>
            <div class="status" v-show="status == 3">
              <mt-badge type="error" size="small">获取状态失败</mt-badge>
            </div>
          </div>
          <div class="content" @click='follow'>
            <div v-show="isfollow > 0">
              <mt-badge size="small" color="#5f71d3">已关注</mt-badge>
            </div>
            <div v-show="isfollow <= 0">
              <mt-badge size="small" color="#CCCCCC">未关注</mt-badge>
            </div>
          </div>
        </div>
      </div>
      <div>
        <mt-cell title="所属院校" :value="equipment.institute.join('')" ></mt-cell>
        <mt-cell title="仪器地址" :value="equipment.location" ></mt-cell>
      </div>
      <div style="padding-top: 20px;">
        <mt-cell title="仪器编号" :value="equipment.ref_no" ></mt-cell>
        <mt-cell title="生产厂家" :value="equipment.manu_name" ></mt-cell>
        <mt-cell title="联系人" :value="equipment.contact_name" ></mt-cell>
        <mt-cell title="联系方式" :value="equipment.contact_phone" ></mt-cell>
      </div>
      <div style="padding-top: 20px;">
        <div class='cell-wrapper'>
          <span class="cell-title">主要技术规格和指标</span>
          <span class="cell-container">{{ equipment.tech_specs }}</span>
          <span class="cell-title">主要功能特色</span>
          <span class="cell-container">{{ equipment.features }}</span>
          <span class="cell-title">主要附件配置</span>
          <span class="cell-container">{{ equipment.accessories }}</span>
        </div>
      </div>
      <div class="action_buttons" style="padding-top:40px">
        <div style="float:left;border-right:1px solid #172a92;" :class="{ 'only' : !equipment.can_reserv && !equipment.can_sample, 'dep' : equipment.can_reserv || equipment.can_sample}">
          <mt-button :disabled="checkAction == 0" type="primary" size="large" @click='closeEquipment'>
            <mt-spinner :type="1" color="#FFF" v-show="checkButtonText == false"></mt-spinner>
            <i class="fa fa-fw fa-2x fa-toggle-on" v-show="checkButtonText == 'on'"></i>
            <i class="fa fa-fw fa-2x fa-toggle-off" v-show="checkButtonText == 'off'"></i>
          </mt-button>
        </div>
        <div class="action_button" v-if="equipment.can_sample" :class="{ 'normal' : equipment.can_reserv, 'spec' : !equipment.can_reserv}">
          <mt-button type="primary" size="large" @click="sampleClick">送样</mt-button>
        </div>
        <div class="action_button" v-if="equipment.can_reserv" :class="{ 'normal' : equipment.can_sample, 'spec' : !equipment.can_sample}">
          <mt-button type="primary" size="large" @click="reservClick">预约</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Header, Button, Spinner, Badge } from 'mint-ui'
import io from 'socket.io-client'

export default {
  name: 'equipment-info',

  components: {
    'mt-header': Header,
    'mt-cell': Cell,
    'mt-button': Button,
    'mt-spinner': Spinner,
    'mt-badge': Badge
  },

  data () {
    return {
      src: '/public/img/equipment/default.png',
      isfollow: 0,
      equipment: {
        institute: [],
        can_sample: true,
        can_reserv: true
      },
      socket: '',
      proxyUrl: 'http://proxy.17kong.com/',
      status: false,
      checkButtonText: false,
      checkAction: 0,
      code: ''
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
    this.$store.dispatch('FETCH_USER')
  },
  methods: {
  // 返回上一级
    goBack () {
      this.$router.go(-1)
    },
  // 获得用户状态
    getUseStatus () {
      let me = this
      let validationMessage = {
        id: me.$store.state.user.user.id,
        email: me.$store.state.user.user.email
      }
      let handlerListen = msg => {
        // 不走代理服务
        me.socket
          .on('auth-reback', data => {
            if (data.authed !== true) return false
            me.$http.post('/api/decryptUserInfo', {code: data.code}).then(res => {
              if (res.data.success) {
                me.code = res.data.code
                let statusParams = {
                  equipment: me.equipment.uuid,
                  source_name: me.equipment.source_name,
                  uuid: `wechatUUID_${me.equipment.uuid}`
                }
                me.socket.emit('yiqikong-get-status', {
                  code: me.code,
                  form: JSON.stringify(statusParams)
                })
              }
            }, res => {
              console.log('decryptUserInfo-failed', res)
            })
          })
          .on('yiqikong-check-permission-reback', data => {
            // console.log('check-permission', data)
            if (data.success) {
              me.checkButtonText = data.params.permission === 'switchOff' ? 'on' : 'off'
              me.checkAction = data.params.result === true ? 1 : 0
            }
          })
          .on('yiqikong-get-status-reback', data => {
            if (data.success) {
              me.status = data.params.using === true ? 2 : 1
            } else {
              me.status = 3
            }
            let checkParams = {
              user: me.$store.state.user.user.gapper_id,
              equipment: me.equipment.uuid,
              source_name: me.equipment.source_name,
              user_info: {
                gapper_id: me.$store.state.user.user.gapper_id,
                username: me.$store.state.user.user.name,
                email: me.$store.state.user.user.email
              },
              uuid: `wechatUUID_${me.equipment.uuid}`
            }

            me.socket.emit('yiqikong-check-permission', {
              code: me.code,
              form: JSON.stringify(checkParams)
            })
          })
          .emit('auth', { form: JSON.stringify(validationMessage) })
      }
      me.socket.connect()
        .on('connect', handlerListen)
        .on('connect_error', msg => {
          // 需要走代理服务
          console.log(msg)
          console.log('wxyconnect failed!')
          me.socket.disconnect()
          me.socket = io.connect(me.proxyUrl, {
            path: '/socket.io',
            autoConnect: false,
            forceNew: true,
            timeout: 10000
          })
          validationMessage.source_name = me.equipment.source_name
          validationMessage.socket = {}
          me.socket.connect().on('connect', handlerListen)
          .on('connect_error', msg => {
            console.log('connect failed')
          })
        })
    },
  // 用户是否关注设备
    getFollowStatus () {
      var vm = this
      this.$store.dispatch('FETCH_STATUS', {
        uid: vm.$store.state.currentUser.gapper_id,
        uuid: vm.equipment.uuid
      }).then(res => {
        vm.isfollow = res.id
      }, res => {
        vm.equipment.follow = 0
      })
    },
    // 跳转到预约界面
    reservClick () {
      this.$router.push({name: 'equipment-reserv', params: { id: this.equipment.uuid }})
    },
    sampleClick () {
      this.$router.push({name: 'equipment-sample', params: { id: this.equipment.uuid }})
    },
    getInfo: function () {
      let id = this.$store.state.equipment.uuidToID[this.$router.currentRoute.params.id]
      this.equipment = this.$store.state.equipment.equipment[id]
      this.judgeFocus()
      this.socket = io.connect('http://equip.xjtu.edu.cn/', {
        path: '/socket.io',
        autoConnect: false,
        forceNew: true,
        timeout: 10000
      })
      this.getUseStatus()
    },
    closeEquipment: function () {
      let vm = this
      let id = this.$store.state.equipment.uuidToID[this.$router.currentRoute.params.id]
      let equipment = this.$store.state.equipment.equipment[id]
      let socketServer = io.connect('http://proxy.17kong.com/', {
        path: '/socket.io',
        authConnect: false,
        forceNew: true,
        timeout: 20000
      })
      let validationMessage = {
        id: this.$store.state.user.user.id,
        email: this.$store.state.user.user.email,
        source_name: equipment.source_name,
        socket: {}
      }
      socketServer
      .on('connect', msg => {
        socketServer
        .emit('auth', { form: JSON.stringify(validationMessage) })
      })
      .on('auth-reback', data => {
        if (data.authed !== true) return false
        vm.$http.post('/api/decryptUserInfo', {code: data.code}).then(res => {
          vm.code = res.data.code

          var form = {
            uuid: `wechatUUID_${vm.$router.currentRoute.params.id}`,
            user: vm.$store.state.user.user.gapper_id,
            equipment: vm.$router.currentRoute.params.id,
            source_name: equipment.source_name,
            user_info: {
              gapper_id: vm.$store.state.user.user.gapper_id,
              username: vm.$store.state.user.user.name,
              email: vm.$store.state.user.user.email
            },
            action: 'switchOff'
          }
          socketServer.emit('yiqikong-switch', {
            code: vm.code,
            form: JSON.stringify(form)
          })
        }, res => {
          console.log('decryptUserInfo-failed', res)
        })
      })
      .on('yiqikong-switch-reback', msg => {
        console.log('关机返回值', msg)
        socketServer.disconnect()
      })
      socketServer.connect()
    },
    follow: function () {
      this.$store.dispatch('CHANGE_FOLLOWS', {
        isfollow: this.isfollow,
        gapperid: this.$store.state.user.user.gapper_id,
        sourceName: 'equipment',
        uuid: this.equipment.uuid
      }).then(res => {
        console.log('follow', res)
        if (res === true) {
          this.isfollow = 0
        } else {
          this.isfollow = res
        }
      })
    },
    judgeFocus: function () {
      this.$store.dispatch('JUDGE_FOCUS', {
        gapperid: this.$store.state.user.user.gapper_id,
        sourceName: 'equipment',
        uuid: this.equipment.uuid
      }).then(res => {
        this.isfollow = res
      })
    }
  },

  created () {
    if (this.check) {
      this.getInfo()
    }
    // if(this.equipment)
    // let vm = this
    // this.$store.dispatch('FETCH_EQUIPMENT', vm.$router.currentRoute.params.id)
    // .then(equipment => {
    //   // vm.socket = io.connect(vm.equipment.socket_url, {
    //   //   path: '/scoket.io',
    //   //   autoConnect: false,
    //   //   forceNew: true,
    //   //   timeout: 10000
    //   // })
    //   // vm.getUseStatus()
    //   // vm.getFollowStatus()
    // }, res => {
    //   vm.equipment = {}
    // })
  },
  computed: {
    check: function () {
      return this.$store.state.equipment.uuidToID.hasOwnProperty(this.$router.currentRoute.params.id)
    }
  },
  watch: {
    check: function () {
      this.getInfo()
    }
  },
  destroyed () {
    this.socket.disconnect()
  }
}
</script>

<style lang="stylus" scoped>
.eq-info-container
  background-color #EEE
  margin-top 40px
  .media
    padding 10px
    background-color #FFF
    .media-body
      .title
        font-size 18px
      .status
        float right
  .mint-cell-text
    white-space nowrap
  .action_buttons
    .mint-button--primary
      background-color #5f71d3
      border-radius 0px
      label
        margin-bottom 0px
    .action_button
      float left
      border-left 1px solid #b2beff
    .dep
      width 20%
    .normal
      width 40%
    .spec
      width 80%
    .only
      width 100%
  .cell-wrapper
    border 1px solid #d9d9d9
    background #fff
    .cell-title
      display inline-block
      padding-top 20px
      padding-left 10px
      width 100%
      color #c3d9e1
    .cell-container
      display inline-block
      font-size 14px
      margin 10px
  .mint-cell-value
    span
      margin-left 10px
</style>
