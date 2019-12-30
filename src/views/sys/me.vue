<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical">
          <a-form-item
            label="用户名称"
          >
            <a-input placeholder="用户名称" :value="nickname()"/>
          </a-form-item>
          <a-form-item
            label="角色"
          >
            <a-input placeholder="角色" :value="userInfo().role.name" disabled/>
          </a-form-item>
          <a-form-item
            label="个性化"
          >
            <a-card>
              <a href="#" slot="extra" @click="$refs.setting.showDrawer()">更多</a>
              <a-list itemLayout="horizontal">
                <a-list-item>
                  <a-list-item-meta>
                    <a slot="title">风格配色</a>
                    <span slot="description">
                      整体风格配色设置
                    </span>
                  </a-list-item-meta>
                  <div slot="actions">
                    <a-switch
                      checkedChildren="暗色"
                      unCheckedChildren="白色"
                      @change="handelThenChange"
                      :defaultChecked="navTheme === 'dark' && true || false" />
                  </div>
                </a-list-item>
                <a-list-item>
                  <a-list-item-meta>
                    <a slot="title">主题色</a>
                    <span slot="description">
                      页面风格配色：
                      <a-popover title="主体色" trigger="click" v-model="colorVisible" style="width: 100px">
                        <div style="height: 20px" slot="content">
                          <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
                            <template slot="title">
                              {{ item.key }}
                            </template>
                            <a-tag :color="item.color" @click="changeColor(item.color)">
                              <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
                            </a-tag>
                          </a-tooltip>
                        </div>
                        <a v-html="colorFilter(primaryColor)"></a>
                      </a-popover>
                    </span>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </a-form-item>
          <!--<a-form-item>-->
          <!--<a-button type="primary">提交</a-button>-->
          <!--<a-button style="margin-left: 8px">保存</a-button>-->
          <!--</a-form-item>-->
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit()" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>
    <avatar-modal ref="modal" @ok="handelAvatarOk"/>
  </div>
</template>

<script>
import { colorList } from '@/components/SettingDrawer/settingConfig'
import AvatarModal from './AvatarModal'
import { mapGetters } from 'vuex'
import { mixin } from '@/utils/mixin'
import { getThemeColor, changeAntdTheme } from '@/components/Dynamictheme/util'
import { changeTheme } from '@/api/user'
export default {
  components: {
    AvatarModal
  },
  mixins: [mixin],
  data () {
    return {
      colorList,
      colorVisible: false,
      preview: {},
      option: {
        img: this.avatar(),
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
      }
    }
  },
  methods: {
    ...mapGetters(['avatar', 'nickname', 'userInfo']),
    handelAvatarOk (v) {
      this.option.img = v
    },
    handelThenChange (checked) {
      let navTheme = 'light'
      if (checked) {
        navTheme = 'dark'
      }
      changeTheme({ navTheme: navTheme }).then(res => {
        if (res.success === true) {
          this.$store.dispatch('ToggleTheme', navTheme)
          this.$message.info('修改成功')
        } else {
          this.$message.error('请稍后再试')
        }
      })
    },
    colorFilter (color) {
      const c = colorList.filter(o => o.color === color)[0]
      return c && c.key
    },
    changeColor (color) {
      if (this.primaryColor !== color) {
        this.$store.dispatch('ToggleColor', color)
        changeTheme({ theme: color }).then(res => {
          if (res.success) {
            changeAntdTheme(getThemeColor(color))
            this.$message.info('修改成功')
          }
        })
      }
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
</style>
