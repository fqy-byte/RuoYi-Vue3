import request from '@/utils/request'

// 查询文物类别列表
export function listTypes(query) {
  return request({
    url: '/fys/types/list',
    method: 'get',
    params: query
  })
}

// 查询文物类别详细
export function getTypes(id) {
  return request({
    url: '/fys/types/' + id,
    method: 'get'
  })
}

// 新增文物类别
export function addTypes(data) {
  return request({
    url: '/fys/types',
    method: 'post',
    data: data
  })
}

// 修改文物类别
export function updateTypes(data) {
  return request({
    url: '/fys/types',
    method: 'put',
    data: data
  })
}

// 删除文物类别
export function delTypes(id) {
  return request({
    url: '/fys/types/' + id,
    method: 'delete'
  })
}
