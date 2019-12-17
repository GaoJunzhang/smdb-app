<template>
  <div>
    <a-spin :spinning="confirmLoading" tip="Loading...">
      <a-row :gutter="16">
        <a-col :md="24" :lg="16">
          <a-form layout="vertical" :form="form">
            <a-form-item label="ApiKey">
              <a-input
                :placeholder="$t('system.apiKeyPlayceholder')"
                v-decorator="['key', {rules: [{required: true, message: this.$t('system.apiKeyPlayceholder')}]}]"
              />
            </a-form-item>
            <a-form-item label="ApiSign">
              <a-input
                :placeholder="$t('system.apiSignPlayceholder')"
                v-decorator="['sign', {rules: [{required: true, message: this.$t('system.apiSignPlayceholder')}]}]"
              />
            </a-form-item>
            <a-form-item :label="$t('system.weatherTime')">
              <a-time-picker
                format="HH:mm"
                :placeholder="$t('system.weatherTimePlaceholder')"
                v-decorator="['time', {rules: [{required: false}]}]"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="handleSubmit">{{ $t('common.save') }}</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { getWeatherSetting, setWeatherSetting } from '@/api/setting'
import moment from 'moment'

export default {
  created () {
    this.loadSetting()
  },
  data () {
    return {
      confirmLoading: true,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    moment,
    loadSetting () {
      this.confirmLoading = true
      getWeatherSetting().then(res => {
        if (res.code === 200) {
          const weatherParam = JSON.parse(res.result)
          if (weatherParam.time) {
            weatherParam.time = moment(weatherParam.time, 'HH:mm')
          } else {
            weatherParam.time = null
          }
          this.form.setFieldsValue(weatherParam)
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
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = {
            key: values.key,
            sign: values.sign
          }
          if (values.time) {
            params.time = values.time.format('HH:mm')
          } else {
            params.time = ''
          }
          setWeatherSetting({
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
                description: res.errMsg || this.$t('common.tryLater'),
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
</style>
