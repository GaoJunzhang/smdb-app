<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <notice-icon class="action"/> -->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="large" :src="avatar"/>
          <span>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'me' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="1">
            <a href="javascript:;" @click="handleChangePassword">
              <a-icon type="lock" />
              <span>{{ $t('user.changePassword') }}</span>
            </a>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <lang-select />
    </div>
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import LangSelect from '@/components/tools/LangSelect'
import UserPassword from './UserPassword'

export default {
  name: 'UserMenu',
  components: {
    LangSelect,
    NoticeIcon,
    UserPassword
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])

  },
  data () {
    return {
      current: ''
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    handleChangePassword () {
      this.current = 'UserPassword'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    handleClose () {
      this.current = ''
    },
    handleOk () {
      this.current = ''

      this.Logout({}).then(() => {
        window.location.reload()
      }).catch(err => {
        this.$message.error({
          title: '错误',
          description: err.message
        })
      })
    }
  }
}
</script>
