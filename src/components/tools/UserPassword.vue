<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('user.oldPassword')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :placeholder="$t('user.oldPasswordPlacehold')"
            type="password"
            autocomplete="false"
            v-decorator="['oldPassword', {rules: [{required: true, message: this.$t('user.oldPasswordPlacehold')}]}]"
          />
        </a-form-item>
        <a-form-item :label="$t('user.newPassword')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :placeholder="$t('user.newPasswordPlacehold')"
            type="password"
            autocomplete="false"
            v-decorator="['newPassword', {rules: [{required: true, pattern: '^.*(?=.{8,})(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$', message: this.$t('user.passwordError')}, {validator: this.checkNewPassword}]}]"
          />
        </a-form-item>
        <a-form-item
          :label="$t('user.repeatNewPassword')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :placeholder="$t('user.newPasswordPlacehold')"
            type="password"
            autocomplete="false"
            v-decorator="['newPassword2', {rules: [{required: true, message: this.$t('user.repeatPasswordError')}, {validator: this.checkPassword}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import md5 from 'md5'
import { changePassword } from '@/api/user'

export default {
  data () {
    return {
      maskClosable: false,
      title: this.$t('user.changePassword'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {

  },
  methods: {
    show () {
      this.visible = true
    },
    checkNewPassword (rule, value, cb) {
      const errors = [this.$t('user.passwordMatchError')]
      if (value === this.form.getFieldValue('oldPassword')) {
        return cb(errors)
      }
      cb()
    },
    checkPassword (rule, value, cb) {
      const errors = [this.$t('user.passwordNotMatch')]
      if (value === this.form.getFieldValue('newPassword')) {
        return cb()
      }
      cb(errors)
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = {
            oldPassword: md5(values.oldPassword),
            newPassword: md5(values.newPassword)
          }
          changePassword(params).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$notification['success']({
                message: this.$t('common.success'),
                description: this.$t('user.relogin'),
                duration: 4
              })
              this.$emit('ok', values)
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
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>
