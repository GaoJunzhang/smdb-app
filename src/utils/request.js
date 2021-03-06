import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const base = '/zboot'
// 创建 axios 实例
const service = axios.create({
  baseURL: base, // api base_url
  timeout: 60000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401) {
      // notification.error({
      //   message: '登录超时',
      //   description: '请重新登录'
      // })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 10)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['accessToken'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const data = response.data
  switch (data.code) {
    case 401:
      notification.error({
        message: '登录失效',
        description: '请重新登录'
      })
      store.dispatch('Logout').then(() => {
        window.location.reload()
      })
      break
    case 403:
      break
    default:
      return data
  }
  return data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}

export const getRequest = (url, params) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  console.log('请求头', base + url)
  return service({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': token
    }
  })
}

export const postRequest = (url, params) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': token
    }
  })
}

export const putRequest = (url, params) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  return service({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': token
    }
  })
}

export const deleteRequest = (url, params) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  return service({
    method: 'delete',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': token
    }
  })
}
export const uploadFileRequest = (url, params) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  return service({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': token
    }
  })
}
