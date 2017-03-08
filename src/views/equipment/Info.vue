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
          <div class="content">
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
        <mt-cell title="主要技术规格和指标" :value="equipment.tech_specs" ></mt-cell>
        <mt-cell title="主要功能特色" :value="equipment.features" ></mt-cell>
        <mt-cell title="主要附件配置" :value="equipment.accessories" ></mt-cell>
      </div>
      <div class="action_buttons" style="padding-top:40px">
        <div style="float:left;border-right:1px solid #172a92;" :class="{ 'only' : !equipment.can_reserv && !equipment.can_sample, 'dep' : equipment.can_reserv || equipment.can_sample}">
          <mt-button :disabled="checkAction == 0" type="primary" size="large">
            <mt-spinner :type="1" color="#FFF" v-show="checkButtonText == false"></mt-spinner>
            <i class="fa fa-fw fa-2x fa-toggle-on" v-show="checkButtonText == 'on'"></i>
            <i class="fa fa-fw fa-2x fa-toggle-off" v-show="checkButtonText == 'off'"></i>
          </mt-button>
        </div>
        <div class="action_button" v-if="equipment.can_sample" :class="{ 'normal' : equipment.can_reserv, 'spec' : !equipment.can_reserv}">
          <mt-button type="primary" size="large">送样</mt-button>
        </div>
        <div class="action_button" v-if="equipment.can_reserv" :class="{ 'normal' : equipment.can_sample, 'spec' : !equipment.can_sample}">
          <mt-button type="primary" size="large" @click="reservClick">预约</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Header, Toast, Button, Spinner, Badge } from 'mint-ui'
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
      checkAction: 0
    }
  },
  // 服务端渲染时候该方法不加载
  beforeMount () {
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    },

    getUseStatus () {
      let me = this
      let validationMessage = {
        id: me.$store.state.currentUser.id,
        email: me.$store.state.currentUser.email,
        source_name: me.equipment.source_name,
        socket: {}
      }
      let handlerListen = msg => {
        me.socket
          .on('auth-reback', data => {
            if (data.authed !== true) return false
            me.$http.post('/api/decryptUserInfo', {code: data.code}).then(res => {
              if (res.body.success) {
                let code = res.body.code
                let statusParams = {
                  equipment: me.equipment.uuid,
                  source_name: me.equipment.source_name,
                  uuid: `wechatUUID_{{me.equipment.uuid}}`
                }
                let checkParams = {
                  user: me.$store.state.currentUser.gapper_id,
                  equipment: me.equipment.uuid,
                  source_name: me.equipment.source_name,
                  user_info: {
                    gapper_id: me.$store.state.currentUser.gapper_id,
                    username: me.$store.state.currentUser.name,
                    email: me.$store.state.currentUser.email
                  },
                  uuid: `wechatUUID_{{me.equipment.uuid}}`
                }
                me.socket.emit('yiqikong-get-status', {
                  code: code,
                  form: JSON.stringify(statusParams)
                })
                me.socket.emit('yiqikong-check-permission', {
                  code: code,
                  form: JSON.stringify(checkParams)
                })
              }
            }, res => {
              console.log('decryptUserInfo-failed', res)
            })
          })
          .on('yiqikong-check-permission-reback', data => {
            console.log('yiqikong-check-permission-reback', data)
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
          })
          .emit('auth', { form: JSON.stringify(validationMessage) })
      }
      me.socket.connect()
        .on('connect', handlerListen)
        .on('connect_error', msg => {
          console.log('connect failed!')
          me.socket.disconnect()
          me.socket = io.connect(me.proxyUrl, {
            path: '/socket.io',
            autoConnect: false,
            forceNew: true,
            timeout: 10000
          })
          me.socket.connect().on('connect', handlerListen)
          .on('connect_error', msg => {
            console.log('connect failed')
          })
        })
    },

    getFollowStatus () {
      var me = this
      me.$http.post('/api/getEquipmentFollowStatus', {
        uid: me.$store.state.currentUser.gapper_id,
        uuid: me.equipment.uuid
      }).then(res => {
        me.isfollow = res.body.id
      }, res => {
        me.equipment.follow = 0
      })
    },

    reservClick () {
      this.$router.push({name: 'equipment-reserv', params: { id: this.equipment.uuid }})
    }
  },

  created () {
    let toast = Toast({
      message: '请等待',
      iconClass: 'fa fa-spin fa-spinner fa-2x'
    })
    let me = this
    me.$http.post('/api/getEquipment', {
      id: me.$router.currentRoute.params.id
    }).then(res => {
      me.equipment = res.body
      toast.close()
      me.socket = io.connect(me.equipment.socket_url, {
        path: '/socket.io',
        autoConnect: false,
        forceNew: true,
        timeout: 10000
      })
      me.getUseStatus()
      me.getFollowStatus()
    }, res => {
      me.equipment = {}
      toast.close()
    })
  }
}
</script>

<style lang="stylus">
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

</style>
