<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item>
        <a-input
          v-decorator="[
            'title',
            {rules: [{ required: true, message: '请输入标题' }]}
          ]"
          name="name"
          placeholder="请输入标题" />
      </a-form-item>
      <a-form-item>
        <a-textarea
          rows="4"
          placeholder="请输入图片描述"
          v-decorator="[
            'imgDesc',
            {rules: [{ required: true, message: '请输入图片描述' }]}
          ]" />
      </a-form-item>
      <a-form-item>
        <a-input
          placeholder="请描述文章楔子"
          v-decorator="[
            'wedge',
            {rules: [{ required: true, message: '请描述文章序' }]}
          ]" />
      </a-form-item>
      <a-form-item>
        <a-select
          placeholder="请选择"
          v-decorator="[
            'category',
            {rules: [{ required: true, message: '请选择' }],initialValue:'1'}
          ]" >
          <a-select-option value="1">春</a-select-option>
          <a-select-option value="2">夏</a-select-option>
          <a-select-option value="3">秋</a-select-option>
          <a-select-option value="4">冬</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
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
      <a-form-item>
        <a-button htmlType="submit" type="primary">提交</a-button>
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
    </a-form>
  </a-card>
</template>

<script>
import { addArticle } from '@/api/blog'
import { uploadFile } from '@/api/oss'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import * as Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import imageResize from 'quill-image-resize-module'
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
  components: { quillEditor },
  data () {
    return {
      editor: null,
      uploadList: [],
      content: ``,
      editorOption: {
        placeholder: '请输入内容',
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
              this.updateList(res.result)
              return res.result
            }
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (value) {
                if (value) {
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
      value: 1,
      // form
      form: this.$form.createForm(this)

    }
  },
  computed: {
  },
  methods: {

    // handler
    init () {
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const article = values
          article.content = this.content
          article.imgs = this.uploadList
          if (article.title !== '9') {
            return
          }
          addArticle(article).then(res => {
            if (res.success === true) { this.$message.info('保存成功') }
          })
        }
      })
    },
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur (editor) {
    }, // 失去焦点事件
    onEditorFocus (editor) {
    }, // 获得焦点事件
    onEditorChange (editor) {
    }, // 内容改变事件
    updateList (url) {
      this.uploadList.push(url)
    }
  },
  beforeDestroy () {
    this.editor = null
    delete this.editor
  },
  mounted () {
    setTimeout(() => {
      this.$refs.myQuillEditor.quill.enable(true)
      this.$refs.myQuillEditor.quill.blur()
    }, 200)
    // this.editor = this.$refs.myQuillEditor.quill
  }
}
</script>
