import { axios } from '@/utils/request'
const ossApi = {
  uploadFile: '/zboot/oss/uploadFile',
  uploadAvatar: '/zboot/oss/uploadAvatar',
  deleteOss: '/zboot/oss/delete'
}

export default ossApi

export function deleteOss (parameter) {
  return axios({
    url: ossApi.deleteOss,
    method: `delete`,
    params: parameter
  })
}
export const uploadFile = ossApi.uploadFile
export const uploadAvatar = ossApi.uploadAvatar
