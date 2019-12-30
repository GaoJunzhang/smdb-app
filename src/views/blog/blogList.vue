<template>
  <div>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :form="form" layout="inline">
        <standard-form-row title="所属类目" block style="padding-bottom: 11px;">
          <a-form-item>
            <tag-select>
              <tag-select-option value="Category1">类目一</tag-select-option>
              <tag-select-option value="Category2">类目二</tag-select-option>
              <tag-select-option value="Category3">类目三</tag-select-option>
              <tag-select-option value="Category4">类目四</tag-select-option>
              <tag-select-option value="Category5">类目五</tag-select-option>
              <tag-select-option value="Category6">类目六</tag-select-option>
              <tag-select-option value="Category7">类目七</tag-select-option>
              <tag-select-option value="Category8">类目八</tag-select-option>
              <tag-select-option value="Category9">类目九</tag-select-option>
              <tag-select-option value="Category10">类目十</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row grid>
          <a-row>
            <a-col :md="24">
              <a-form-item :wrapper-col="{ span: 24 }">
                <a-select
                  style="max-width: 268px; width: 100%;"
                  mode="multiple"
                  placeholder="选择 onwer"
                  @change="handleChange"
                >
                  <a-select-option v-for="item in owners" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
                <a class="list-articles-trigger" @click="setOwner">只看自己的</a>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>

        <standard-form-row title="其它选项" grid last>
          <a-row :gutter="16">
            <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
              <a-form-item label="活跃用户" :wrapper-col="{ xs: 24, sm: 24, md: 12 }">
                <a-select placeholder="不限" style="max-width: 200px; width: 100%;">
                  <a-select-option value="李三">李三</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
              <a-form-item label="好评度" :wrapper-col="{ xs: 24, sm: 24, md: 12 }">
                <a-select placeholder="不限" style="max-width: 200px; width: 100%;">
                  <a-select-option value="优秀">优秀</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>

    <a-card style="margin-top: 24px;" :bordered="false">
      <a-list
        size="large"
        rowKey="id"
        :loading="loading"
        itemLayout="vertical"
        :dataSource="data"
      >
        <a-list-item :key="item.id" slot="renderItem" slot-scope="item">
          <template slot="actions">
            <icon-text type="star-o" text="10" />
            <icon-text type="like-o" text="20" />
            <icon-text type="message" text="message" />
          </template>
          <a-list-item-meta>
            <a slot="title" href="https://vue.ant.design/">{{ item.title }}</a>
            <template slot="description">
              <span>
                <a-button type="danger" icon="delete" @click="handleDelChange(item.id)"/>
              </span>
            </template>
          </a-list-item-meta>
          <article-list-content :description="item.imgDesc" owner="owner" avatar="http://img3.imgtn.bdimg.com/it/u=1806047429,2669047046&fm=26&gp=0.jpg" href="item.href" :updateAt="item.createTime" />
        </a-list-item>
        <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
          <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
        </div>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { TagSelect, StandardFormRow, ArticleListContent } from '@/components'
import IconText from './IconText'
import { getAllByPage, deleteArticle } from '@/api/blog'
const TagSelectOption = TagSelect.Option
const owners = [
  {
    id: 'wzj',
    name: '我自己'
  },
  {
    id: 'wjh',
    name: '吴家豪'
  },
  {
    id: 'zxx',
    name: '周星星'
  },
  {
    id: 'zly',
    name: '赵丽颖'
  },
  {
    id: 'ym',
    name: '姚明'
  }
]

export default {
  components: {
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    ArticleListContent,
    IconText
  },
  data () {
    return {
      owners,
      loading: true,
      loadingMore: false,
      data: [],
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleDelChange (id) {
      console.log('shanchu', id)
      deleteArticle(id).then(res => {
        if (res.success) {
          this.$message.info('删除成功')
          this.getList()
        }
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      // this.$http.get('/list/article').then(res => {
      //   console.log('res', res)
      //   this.data = res.result
      //   this.loading = false
      // })
      getAllByPage().then(res => {
        console.log('查询出的文章', res)
        this.data = res.result.content
        this.loading = false
      })
    },
    loadMore () {
      this.loadingMore = true
      // this.$http.get('/list/article').then(res => {
      //   this.data = this.data.concat(res.result)
      // }).finally(() => {
      //   this.loadingMore = false
      // })
    },
    setOwner () {
      // const { form: { setFieldsValue } } = this
      // setFieldsValue({
      //   owner: ['wzj']
      // })
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-pro-components-tag-select {
    /deep/ .ant-pro-tag-select .ant-tag {
      margin-right: 24px;
      padding: 0 8px;
      font-size: 14px;
    }
  }

  .list-articles-trigger {
    margin-left: 12px;
  }
</style>
