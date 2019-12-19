<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="标题"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入标题' }]}
          ]"
          name="name"
          placeholder="给目标起个名字" />
      </a-form-item>
      <a-form-item>
        <quill-editor
          style="height: 700px;"
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)">
        </quill-editor>
      </a-form-item>
      <a-form-item
        label="起止日期"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-range-picker
          name="buildTime"
          style="width: 100%"
          v-decorator="[
            'buildTime',
            {rules: [{ required: true, message: '请选择起止日期' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="目标描述"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="请输入你阶段性工作目标"
          v-decorator="[
            'description',
            {rules: [{ required: true, message: '请输入目标描述' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="衡量标准"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="请输入衡量标准"
          v-decorator="[
            'type',
            {rules: [{ required: true, message: '请输入衡量标准' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="客户"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          placeholder="请描述你服务的客户，内部客户直接 @姓名／工号"
          v-decorator="[
            'customer',
            {rules: [{ required: true, message: '请描述你服务的客户' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="邀评人"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input placeholder="请直接 @姓名／工号，最多可邀请 5 人" />
      </a-form-item>
      <a-form-item
        label="权重"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number :min="0" :max="100" />
        <span> %</span>
      </a-form-item>
      <a-form-item
        label="目标公开"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
        help="客户、邀评人默认被分享"
      >
        <a-radio-group v-model="value">
          <a-radio :value="1">公开</a-radio>
          <a-radio :value="2">部分公开</a-radio>
          <a-radio :value="3">不公开</a-radio>
        </a-radio-group>
        <a-form-item>
          <a-select mode="multiple" v-if="value === 2">
            <a-select-option value="4">同事一</a-select-option>
            <a-select-option value="5">同事二</a-select-option>
            <a-select-option value="6">同事三</a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
        <a-button style="margin-left: 8px">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { addArticle } from '@/api/blog'
import { uploadFile } from '@/api/oss'
import { Quill, quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import imageResize from 'quill-image-resize-module'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

Quill.register('modules/ImageExtend', ImageExtend)
Quill.register('modules/imageResize', imageResize)
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], // 引用，代码块

  [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
  [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
  [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
  [{ 'direction': 'rtl' }], // 文本方向

  [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题

  [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
  [{ 'font': [] }], // 字体
  [{ 'align': [] }], // 对齐方式

  ['clean'], // 清除字体样式
  ['image', 'video'] // 上传图片、上传视频
]
export default {
  name: 'BaseForm',
  components: { quillEditor },
  data () {
    return {
      uploadList: [],
      content: ``,
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 9,
            action: uploadFile,
            headers: (xhr) => {
              xhr.setRequestHeader('accessToken', Vue.ls.get(ACCESS_TOKEN))
            },
            response: (res) => {
              console.log('回传的参数', res)
              this.updateList(res.result)
              return res.result
            }
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (value) {
                if (value) {
                  // document.querySelector('.ivu-upload .ivu-btn').click()
                  console.log('=========value========')
                  console.log(value)
                  QuillWatch.emit(this.quill.id)
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          },
          imageResize: {}
        },
        theme: 'snow'
      },
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      value: 1,

      // form
      form: this.$form.createForm(this)

    }
  },
  methods: {

    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
          const article = {
            title: this.articleTitle,
            content: this.content,
            category: this.category,
            wedge: this.wedge,
            imgDesc: this.imgDesc,
            imgs: this.uploadList
            // type:1,
          }
          addArticle(article).then(res => {
            if (res.success === true) { this.$message.info('保存成功') }
          })
        }
      })
    },
    onEditorBlur () {
    }, // 失去焦点事件
    onEditorFocus () {
    }, // 获得焦点事件
    onEditorChange (e) {
    }, // 内容改变事件
    updateList (url) {
      this.uploadList.push(url)
    }
  }
}
</script>
