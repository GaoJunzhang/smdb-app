<template>
  <a-row>
    <a-col>
      <a-card :title="title">
        <a href="#" slot="extra" @click="handleOpen">新窗口</a>
        <a-row>
          <div style="position:relative;">
            <a-spin :spinning="loading" size="large">
              <iframe
                id="iframe"
                :src="go"
                frameborder="0"
                width="100%"
                :height="height"
                scrolling="auto"
              ></iframe>
            </a-spin>
          </div>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data () {
    return {
      title: '文档',
      height: '525',
      loading: false,
      go: '',
      url: '',
      html: '',
      wrapperCol: {
        span: 24
      }
    }
  },
  watch: {
    $route (to, from) {
      this.initUrl()
    }
  },
  methods: {
    initUrl () {
      const url = this.$route.meta.url
      this.title = this.$route.meta.title
      if (url !== null && url !== undefined) {
        this.url = url
        this.go = url
        this.loading = true
        const that = this
        const iframe = document.getElementById('iframe')
        if (iframe.attachEvent) {
          iframe.attachEvent('onload', function () {
            that.loading = false
          })
        } else {
          iframe.onload = function () {
            that.loading = false
          }
        }
      }
    },
    handleOpen () {
      window.open(this.url)
    }
  },
  mounted () {
    const height = document.documentElement.clientHeight
    this.height = Number(height - 217) + 'px'
    this.initUrl()
  }
}
</script>

<style scoped>

</style>
