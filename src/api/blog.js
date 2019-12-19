import { getRequest, postRequest, putRequest, deleteRequest } from '@/utils/request'

/**
 * article
 */
export const addArticle = (params) => {
  return putRequest('/blog/es/article/add', params)
}
export const deleteArticle = (id) => {
  return deleteRequest(`/blog/es/article/delete/${id}`)
}
export const flushallArticle = () => {
  return deleteRequest(`/blog/es/article/flushall`)
}
export const articlesLikeTitle = (params) => {
  return getRequest('/blog/article/articlesByTitle', params)
}
export const articleByUid = (uid) => {
  return getRequest(`/blog/article/articleByUid/${uid}`)
}
export const articleById = (id) => {
  return getRequest(`/blog/article/articleById/${id}`)
}
export const updateArticle = (params) => {
  return postRequest('/blog/article/update', params)
}
