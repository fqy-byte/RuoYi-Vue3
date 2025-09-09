import request from '@/utils/request'

// 查询系统API配置列表
export function listApiconfig(query) {
  return request({
    url: '/fys/apiconfig/list',
    method: 'get',
    params: query
  })
}

// 查询系统API配置详细
export function getApiconfig(configId) {
  return request({
    url: '/fys/apiconfig/' + configId,
    method: 'get'
  })
}

// 新增系统API配置
export function addApiconfig(data) {
  return request({
    url: '/fys/apiconfig',
    method: 'post',
    data: data
  })
}



// 修改系统API配置
export function updateApiconfig(data) {
  return request({
    url: '/fys/apiconfig',
    method: 'put',
    data: data
  })
}

// 删除系统API配置
export function delApiconfig(configId) {
  return request({
    url: '/fys/apiconfig/' + configId,
    method: 'delete'
  })
}
