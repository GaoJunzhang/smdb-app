<template>
  <div class="page-header-index-wide">
    <a-card
      :bordered="false"
      :bodyStyle="{ padding: '16px 0', height: '100%' }"
      :style="{ height: '100%' }"
    >
      <div class="account-settings-info-main" :class="device">
        <div class="account-settings-info-left">
          <a-menu
            :mode="device == 'mobile' ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: device == 'mobile' ? '560px' : 'auto'}"
            type="inner"
            :defaultSelectedKeys="defaultSelectedKeys"
            @select="onSelect"
          >
            <a-menu-item key="base">{{ $t('system.baseSetting') }}</a-menu-item>
            <a-menu-item key="aliyun">{{ $t('system.aliyunOssSetting') }}</a-menu-item>
            <a-menu-item key="weather">{{ $t('system.weatherSetting') }}</a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            <span>{{ pageTitle }}</span>
          </div>
          <component ref="model" :is="current"></component>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import AliyunOssSetting from './AliyunOssSetting'
import BaseSetting from './BaseSetting'
import WeatherSetting from './WeatherSetting'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  components: {
    AliyunOssSetting,
    BaseSetting,
    WeatherSetting
  },
  mixins: [mixinDevice],
  data () {
    return {
      // horizontal  inline
      mode: 'inline',

      openKeys: [],
      defaultSelectedKeys: ['base'],

      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },

      pageTitle: this.$t('system.baseSetting'),
      current: 'BaseSetting'
    }
  },
  created () {
  },
  methods: {
    onSelect (item) {
      switch (item.key) {
        case 'aliyun':
          this.pageTitle = this.$t('system.aliyunOssSetting')
          this.current = 'AliyunOssSetting'
          break
        case 'base':
          this.pageTitle = this.$t('system.baseSetting')
          this.current = 'BaseSetting'
          break
        case 'weather':
          this.pageTitle = this.$t('system.weatherSetting')
          this.current = 'WeatherSetting'
          break
      }
      // this.openKeys = openKeys
    }
  }
}
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>
