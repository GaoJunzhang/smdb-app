<template>
  <a-spin :spinning="confirmLoading" tip="Loading...">
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value">:</span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback(item)">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </a-spin>
</template>

<script>
import { getBaseSetting } from '@/api/setting'
import AdDurationSetting from './win/AdDurationSetting'
import ConnHeartbeatSetting from './win/ConnHeartbeatSetting'
import ServerUrlSetting from './win/ServerUrlSetting'

export default {
  components: {
    AdDurationSetting,
    ConnHeartbeatSetting,
    ServerUrlSetting
  },
  created () {
    this.loadSetting()
  },
  data () {
    return {
      current: '',
      confirmLoading: false,
      data: [
        {
          key: 'serverUrl',
          title: this.$t('system.serverUrl'),
          description: this.$t('system.serverUrlDescription'),
          value: '',
          actions: {
            title: this.$t('common.edit'),
            callback: item => { this.editSetting('serverUrl', item.value) }
          }
        },
        {
          key: 'adDuration',
          title: this.$t('system.adDuration'),
          description: this.$t('system.adDurationDescription'),
          value: '',
          actions: {
            title: this.$t('common.edit'),
            callback: item => { this.editSetting('adDuration', item.value) }
          }
        },
        {
          key: 'connHeartbeat',
          title: this.$t('system.connHeartbeat'),
          description: this.$t('system.connHeartbeatDescription'),
          value: '',
          actions: {
            title: this.$t('common.edit'),
            callback: item => { this.editSetting('connHeartbeat', item.value) }
          }
        }
      ]
    }
  },
  methods: {
    loadSetting () {
      this.confirmLoading = true
      getBaseSetting().then(res => {
        if (res.code === 200) {
          const settings = res.result
          Object.keys(settings).forEach(key => {
            var obj = this.data.find(data => { return data.key === key })
            if (obj) {
              obj.value = settings[key]
            }
          })
        } else {
          this.$notification['error']({
            message: this.$t('common.error'),
            description: res.message || this.$t('common.tryLater'),
            duration: 4
          })
        }
        this.confirmLoading = false
      }, () => {
        this.confirmLoading = false
      })
    },
    handleOk () {
      this.current = ''
      this.loadSetting()
    },
    handleClose () {
      this.current = ''
    },
    editSetting (key, value) {
      switch (key) {
        case 'adDuration':
          this.current = 'AdDurationSetting'
          this.$nextTick(() => {
            this.$refs.model.show(value)
          })
          break
        case 'connHeartbeat':
          this.current = 'ConnHeartbeatSetting'
          this.$nextTick(() => {
            this.$refs.model.show(value)
          })
          break
        case 'serverUrl':
          this.current = 'ServerUrlSetting'
          this.$nextTick(() => {
            this.$refs.model.show(value)
          })
          break
      }
    }
  }
}
</script>

<style scoped>
</style>
