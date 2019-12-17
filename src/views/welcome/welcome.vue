<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span></div>
    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.project')" :content="allDevices + ''" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.teamRank')" :content="allResource" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.views')" :content="allUserCount" :center="false" />
        </a-col>
      </a-row>
    </div>
    <div class="page-header-index-wide">
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="当月设备增量" :total="currentMonthDevice | NumberFormat">
            <a-tooltip title="年度设备" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <user-area :data="deviceMonthData"/>
            </div>
            <template slot="footer">本年度设备量<span> {{ yearDevices | NumberFormat }}</span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="当月资源增量" :total="currentMonthResource | NumberFormat">
            <a-tooltip title="年度资源" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <user-area :data="monthResourceData"/>
            </div>
            <template slot="footer">本年度资源数<span> {{ yearResource | NumberFormat }}</span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="当月用户增量" :total="currentMonthUser | NumberFormat">
            <a-tooltip title="年度用户" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <user-area :data="monthData"/>
            </div>
            <template slot="footer">本年度用户量<span> {{ yearUserCount | NumberFormat }}</span></template>
          </chart-card>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-row :gutter="24">
        <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <div class="salesCard">
            <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
              <a-tab-pane loading="true" tab="下载" key="1">
                <a-row>
                  <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                    <bar :data="barData" title="下载趋势" />
                  </a-col>
                  <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                    <rank-list title="资源下载排行" :list="rankList"/>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane loading="true" tab="评论" key="2">
                <a-row>
                  <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                    <bar :data="rbarData" title="评论趋势" />
                  </a-col>
                  <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                    <rank-list title="资源评论排行" :list="rrankList"/>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane loading="true" tab="关注" key="3">
                <a-row>
                  <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                    <bar :data="fbarData" title="关注趋势" />
                  </a-col>
                  <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                    <rank-list title="资源关注排行" :list="frankList"/>
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-row>
    </div>
    <div>
      <a-card title="在线设备">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" ref="sform">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="设备名称">
                  <a-input v-model="queryParam.deviceName" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="设备编号">
                  <a-input v-model="queryParam.deviceMac" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" icon="search" @click="searchForm">{{ $t('common.search') }}</a-button>
                  <a-button style="margin-left: 8px" @click="() => queryParam = {}">{{ $t('common.reset') }}</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <s-table
          ref="table"
          size="default"
          row-key="id"
          :columns="columns"
          :data="loadData"
        ></s-table>
      </a-card>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'

import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { ChartCard, RankList, Bar, STable } from '@/components'
import UserArea from './UserArea'
import { mixinDevice } from '@/utils/mixin'
import { mounthUsers, sumUser } from '@/api/user'
import { getMonthDevice, sumDevices, sumResource, getMonthResource, top10, getMonthDownload } from '@/api/resource'
import { deviceStatusData } from '@/api/device'
import { rateTop10, getRateMonthDownload } from '@/api/rate'
import { followTop10, getFollowMonthDownload } from '@/api/follow'
export default {
  name: 'Welcome',
  components: {
    PageView,
    HeadInfo,
    ChartCard,
    RankList,
    Bar,
    UserArea,
    STable
  },
  data () {
    return {
      queryParam: {
        deviceName: '',
        deviceMac: '',
        pageNumber: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          align: 'center'
        },
        {
          title: '设备编号',
          dataIndex: 'deviceMac',
          align: 'center'
        },
        {
          title: '最近在线时间',
          dataIndex: 'createTime',
          align: 'center'
        }
      ],
      loadData: parameter => {
        return deviceStatusData(Object.assign(parameter, this.queryParam)).then(res => {
          console.log('狀態', res.result)
          res.result.data.forEach(function (v, k) {
            v.key = v.id
          })
          this.$refs.table.clearSelected()
          return res.result
        })
      },
      rankList: [],
      frankList: [],
      rrankList: [],
      urankList: [],
      barData: [],
      fbarData: [],
      rbarData: [],
      allResource: '',
      currentMonthResource: '',
      yearResource: '',
      monthResourceData: [],
      currentMonthDevice: '',
      yearDevices: '',
      allDevices: '',
      deviceMonthData: [],
      yearUserCount: '',
      allUserCount: '',
      monthData: [],
      currentMonthUser: 0,
      mixins: [mixinDevice],
      timeFix: timeFix(),
      avatar: '',
      user: {},

      loading: true
      // data
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    this.initMounthUser()
    this.getsumUser()
    this.getMonthDevice()
    this.getSumDevices()
    this.getMonthResource()
    this.getMonthDownload()
    this.getSumResource()
    this.getTop10Dr()
    this.followTop10()
    this.getFollowMonthDownload()
    this.rateTop10()
    this.getRateMonthDownload()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  mounted () {
  },
  methods: {
    searchForm () {
      this.$refs.table.refresh(true)
    },
    initMounthUser () {
      const that = this
      var date = new Date()
      var count = 0
      mounthUsers().then(res => {
        res.result.forEach((v, k) => {
          that.monthData.push({
            x: (k + 1) + '月',
            y: v
          })
          if (date.getMonth() === k) {
            that.currentMonthUser = v
          }
          count += v
        })
        that.yearUserCount = count + ''
      })
    },
    getsumUser () {
      sumUser().then(res => {
        this.allUserCount = res.result + ''
      })
    },
    getSumDevices () {
      sumDevices().then(res => {
        if (res.success === true) {
          this.allDevices = res.result
        }
      })
    },
    getSumResource () {
      sumResource().then(res => {
        if (res.success === true) {
          this.allResource = res.result + ''
        }
      })
    },
    getTop10Dr () {
      top10().then(res => {
        if (res.success === true) {
          console.log('top10=', res.result)
          this.rankList = res.result
        }
      })
    },
    getMonthDownload () {
      const that = this
      getMonthDownload().then(res => {
        if (res.success === true) {
          const arr = Object.values(res.result)
          arr.forEach((v, k) => {
            that.barData.push({
              x: (k + 1) + '月',
              y: v
            })
          })
        }
      })
    },
    followTop10 () {
      followTop10().then(res => {
        if (res.success === true) {
          console.log('top10=', res.result)
          this.frankList = res.result
        }
      })
    },
    getFollowMonthDownload () {
      const that = this
      getFollowMonthDownload().then(res => {
        if (res.success === true) {
          const arr = Object.values(res.result)
          arr.forEach((v, k) => {
            that.fbarData.push({
              x: (k + 1) + '月',
              y: v
            })
          })
        }
      })
    },
    rateTop10 () {
      rateTop10().then(res => {
        if (res.success === true) {
          console.log('top10=', res.result)
          this.rrankList = res.result
        }
      })
    },
    getRateMonthDownload () {
      const that = this
      getRateMonthDownload().then(res => {
        if (res.success === true) {
          const arr = Object.values(res.result)
          arr.forEach((v, k) => {
            that.rbarData.push({
              x: (k + 1) + '月',
              y: v
            })
          })
        }
      })
    },
    getMonthResource () {
      const that = this
      var date = new Date()
      var count = 0
      getMonthResource().then(res => {
        if (res.success === true) {
          const arr = Object.values(res.result)
          arr.forEach((v, k) => {
            that.monthResourceData.push({
              x: (k + 1) + '月',
              y: v
            })
            if (date.getMonth() === k) {
              that.currentMonthResource = v
            }
            count += v
          })
          that.yearResource = count + ''
        }
      })
    },
    getMonthDevice () {
      const that = this
      var date = new Date()
      var count = 0
      getMonthDevice().then(res => {
        if (res.success === true) {
          const arr = Object.values(res.result)
          arr.forEach((v, k) => {
            that.deviceMonthData.push({
              x: (k + 1) + '月',
              y: v
            })
            if (date.getMonth() === k) {
              that.currentMonthDevice = v
            }
            count += v
          })
          that.yearDevices = count + ''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
