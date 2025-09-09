import request from '@/utils/request'

// 查询设备概览列表
export function listOverview(query) {
  return request({
    url: '/fys/overview/list',
    method: 'get',
    params: query
  })
}

// 查询设备概览详细
export function getOverview(id) {
  return request({
    url: '/fys/overview/' + id,
    method: 'get'
  })
}

// 新增设备概览
export function addOverview(data) {
  return request({
    url: '/fys/overview',
    method: 'post',
    data: data
  })
}

// 修改设备概览
export function updateOverview(data) {
  return request({
    url: '/fys/overview',
    method: 'put',
    data: data
  })
}

// 删除设备概览
export function delOverview(id) {
  return request({
    url: '/fys/overview/' + id,
    method: 'delete'
  })
}
