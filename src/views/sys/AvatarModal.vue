<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" style="height: 350px; text-align: center;">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
        <a-upload
          :fileList="fileList"
          :remove="handleRemove"
          :beforeUpload="beforeUpload"
          @change="handelChange"
          :accept="accept"
          :customRequest="function(){}">
          <a-button> <a-icon type="upload" /> 重新{{ $t('common.upload') }} </a-button>
        </a-upload>
      </a-col>
    </a-row>

    <template slot="footer">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import { fileByBase64, dataURLtoFile } from '@/utils/util'
import axios from 'axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  props: {
    imgFormat: {
      type: Array,
      default: function () {
        return ['image/jpeg']
      }
    },
    imgSize: {
      type: Number,
      default: 2
    }
  },
  data () {
    const that = this
    return {
      accept: '.jpg',
      fileList: [],
      visible: false,
      confirmLoading: false,
      headers: {},
      options: {
        img: that.avatar(),
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  methods: {
    ...mapGetters(['avatar']),
    edit () {
      this.visible = true
      /* 获取原始头像 */
    },
    close () {
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    okHandel () {
      const that = this

      this.$refs.cropper.getCropData((data) => {
        var file = dataURLtoFile(data, 'home_log.png')
        const formData = new FormData()
        formData.append('file', file)
        axios({
          url: '/zboot/oss/uploadCropperAvatar',
          method: 'post',
          data: formData,
          headers: that.headers
        }).then(res => {
          console.log('返回接口')
          console.log('返回接口')
          console.log('返回接口')
          console.log(res)
          console.log('headers')
          console.log(that.headers)
          if (res.data.success === true) {
            that.$store.commit('SET_AVATAR', res.data.result)
            that.$emit('ok', res.data.result)
            that.$message.info('修改成功')
            that.confirmLoading = false
            that.cancelHandel()
          }
        })
      })
    },

    realTime (data) {
      this.previews = data
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      const { imgFormat, imgSize } = this
      const isFormat = imgFormat.includes(file.type)
      if (!isFormat) {
        this.$message.error('图片格式不支持！')
      }
      const isLt2M = file.size / 1024 / 1024 <= imgSize
      if (!isLt2M) {
        this.$message.error('图片大小限制在' + imgSize + 'MB内!')
      }
      return isFormat && isLt2M
    },
    handelChange (info) {
      const { options } = this
      fileByBase64(info.file.originFileObj, (imageUrl) => {
        const target = Object.assign({}, options, {
          img: imageUrl
        })
        this.options = Object.assign({}, options, target)
      })
    }
  },
  created () {
    this.headers = {
      'Content-Type': 'multipart/form-data',
      'accessToken': Vue.ls.get(ACCESS_TOKEN)
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
