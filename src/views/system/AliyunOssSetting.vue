<template>
  <div>
    <a-spin :spinning="confirmLoading" tip="Loading...">
      <a-row :gutter="16">
        <a-col :md="24" :lg="16">
          <a-form layout="vertical" :form="form">
            <div v-show="isOss">
              <a-form-item label="Access Key">
                <a-input
                  :placeholder="$t('system.accessKeyPlayceholder')"
                  v-decorator="['key', {rules: [{required: true, message: this.$t('system.accessKeyPlayceholder')}]}]"
                />
              </a-form-item>
              <a-form-item label="Access Secret">
                <a-input
                  :placeholder="$t('system.accessSecretPlayceholder')"
                  v-decorator="['secret', {rules: [{required: true, message: this.$t('system.accessSecretPlayceholder')}]}]"
                />
              </a-form-item>
              <a-form-item label="Endpoint">
                <a-input
                  :placeholder="$t('system.endpointPlayceholder')"
                  v-decorator="['endpoint', {rules: [{required: true, message: this.$t('system.endpointPlayceholder')}]}]"
                />
              </a-form-item>
              <a-form-item label="Bucket">
                <a-input
                  :placeholder="$t('system.bucketPlayceholder')"
                  v-decorator="['bucket', {rules: [{required: true, message: this.$t('system.bucketPlayceholder')}]}]"
                />
              </a-form-item>
              <a-form-item label="Access Url">
                <a-input
                  :placeholder="$t('system.accessUrlPlceholder')"
                  v-decorator="['url', {rules: [{required: true, message: this.$t('system.accessUrlPlceholder')}]}]"
                />
              </a-form-item>
              <a-form-item label="File">
                <a-input
                  :placeholder="$t('system.filePceholder')"
                  v-decorator="['file', {rules: [{required: true, message: this.$t('system.filePceholder')}]}]"
                />
              </a-form-item>
            </div>
            <div class="result" v-show="!isOss">
              <div>
                <a-icon :class="{ 'icon': true}" type="meh"/>
              </div>
              <div class="title">
                <slot name="title">
                  阿里OSS已经关闭
                </slot>
              </div>
              <div class="description">
                <slot name="description">
                  开启后将使用阿里oss和本地同步存储
                </slot>
              </div>
              <div class="action">
                <a-button icon="login" style="margin-left: 10px" type="primary" @click="startOss">开启</a-button>
              </div>
            </div>
            <a-form-item>
              <a-button v-show="isOss" icon="save" type="primary" @click="handleSubmit">{{ $t('common.save') }}</a-button>
              <a-popconfirm v-show="isOss" title="关闭后将使用本地存储媒体资源，确定关闭oss？" @confirm="closeOss" :okText="$t('common.ok')" :cancelText="$t('common.cancel')">
                <a-button icon="logout" style="margin-left: 10px" type="danger">停用</a-button>
              </a-popconfirm>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { getAliyunOssSetting, setAliyunOssSetting } from '@/api/setting'

export default {
  created () {
    this.loadSetting()
  },
  data () {
    return {
      isOss: true,
      confirmLoading: true,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    loadSetting () {
      this.confirmLoading = true
      getAliyunOssSetting().then(res => {
        if (res.code === 200) {
          if (res.result !== '{}' && res.result !== '') {
            const ossParam = JSON.parse(res.result)
            this.form.setFieldsValue(ossParam)
          } else {
            this.isOss = false
          }
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.message || '请求出现错误，请稍后再试',
            duration: 4
          })
        }

        this.confirmLoading = false
      }, () => {
        this.confirmLoading = false
      })
    },
    startOss () {
      this.isOss = true
    },
    closeOss () {
      this.isOss = false
      setAliyunOssSetting({
        setting: '{}'
      }).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: this.$t('common.success'),
            description: this.$t('common.success'),
            duration: 4
          })
        }
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          setAliyunOssSetting({
            setting: JSON.stringify(params)
          }).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: this.$t('common.success'),
                description: this.$t('common.save') + this.$t('common.success'),
                duration: 4
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
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .result {
    text-align: center;
    width: 72%;
    margin: 0 auto;
    padding: 24px 0 8px;

    .icon {
      font-size: 72px;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .success {
      color: #52c41a;
    }
    .error {
      color: red;
    }
    .title {
      font-size: 24px;
      color: rgba(0, 0, 0, .85);
      font-weight: 500;
      line-height: 32px;
      margin-bottom: 16px;
    }
    .description {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 24px;
    }
    .extra {
      background: #fafafa;
      padding: 24px 40px;
      border-radius: 2px;
      text-align: left;
    }
    .action {
      margin-top: 32px;
    }
  }
</style>
