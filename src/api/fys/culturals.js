import request from '@/utils/request'

// 查询文物列表列表
export function listCulturals(query) {
  return request({
    url: '/fys/culturals/list',
    method: 'get',
    params: query
  })
}

// 查询文物列表详细
export function getCulturals(id) {
  return request({
    url: '/fys/culturals/' + id,
    method: 'get'
  })
}

// 新增文物列表
export function addCulturals(data) {
  return request({
    url: '/fys/culturals',
    method: 'post',
    data: data
  })
}

// 修改文物列表
export function updateCulturals(data) {
  return request({
    url: '/fys/culturals',
    method: 'put',
    data: data
  })
}

// 删除文物列表
export function delCulturals(id) {
  return request({
    url: '/fys/culturals/' + id,
    method: 'delete'
  })
}
