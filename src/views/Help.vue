<template>
  <div>
    <mt-header fixed :title="title"></mt-header>
    <div id="container" style="padding-top: 40px;">
      <p v-for="item in items">
        <img :src="item" width="100%" />
      </p>
    </div>
  </div>
</template>

<script>
import { Header } from 'mint-ui'
export default {
  name: 'help',
  components: {
    'mt-header': Header
  },
  data: () => {
    return {
      title: '绑定帮助',
      items: [
        '/public/img/help/1.jpg',
        '/public/img/help/2.jpg',
        '/public/img/help/3.jpg'
      ]
    }
  },
  beforeMount () {
  },
  methods: {
  }
}
</script>
