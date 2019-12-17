import { axios } from '@/utils/request'

const settingApi = {
  getAliyunOssSetting: '/systemSetting/getAliyunOssSetting',
  setAliyunOssSetting: '/systemSetting/setAliyunOssSetting',
  getBaseSetting: '/systemSetting/getBaseSetting',
  setAdDurationSetting: '/systemSetting/setAdDurationSetting',
  setConnHeartbeatSetting: '/systemSetting/setConnHeartbeatSetting',
  setServerUrlSetting: '/systemSetting/setServerUrlSetting',
  getWeatherSetting: '/systemSetting/getWeatherSetting',
  setWeatherSetting: '/systemSetting/setWeatherSetting'
}

export default settingApi

export function getAliyunOssSetting (parameter) {
  return axios({
    url: settingApi.getAliyunOssSetting,
    method: 'get',
    params: parameter
  })
}

export function setAliyunOssSetting (parameter) {
  return axios({
    url: settingApi.setAliyunOssSetting,
    method: 'post',
    data: parameter
  })
}

export function getBaseSetting (parameter) {
  return axios({
    url: settingApi.getBaseSetting,
    method: 'get',
    params: parameter
  })
}

export function setAdDurationSetting (parameter) {
  return axios({
    url: settingApi.setAdDurationSetting,
    method: 'post',
    data: parameter
  })
}

export function setConnHeartbeatSetting (parameter) {
  return axios({
    url: settingApi.setConnHeartbeatSetting,
    method: 'post',
    data: parameter
  })
}

export function setServerUrlSetting (parameter) {
  return axios({
    url: settingApi.setServerUrlSetting,
    method: 'post',
    data: parameter
  })
}

export function getWeatherSetting (parameter) {
  return axios({
    url: settingApi.getWeatherSetting,
    method: 'get',
    params: parameter
  })
}

export function setWeatherSetting (parameter) {
  return axios({
    url: settingApi.setWeatherSetting,
    method: 'post',
    data: parameter
  })
}
