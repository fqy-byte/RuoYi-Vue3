import request from '@/utils/request'

// 查询佛岩寺数据列表
export function listLevels(query) {
  return request({
    url: '/fys/levels/list',
    method: 'get',
    params: query
  })
}

// 查询佛岩寺数据详细
export function getLevels(id) {
  return request({
    url: '/fys/levels/' + id,
    method: 'get'
  })
}

// 新增佛岩寺数据
export function addLevels(data) {
  return request({
    url: '/fys/levels',
    method: 'post',
    data: data
  })
}

// 修改佛岩寺数据
export function updateLevels(data) {
  return request({
    url: '/fys/levels',
    method: 'put',
    data: data
  })
}

// 删除佛岩寺数据
export function delLevels(id) {
  return request({
    url: '/fys/levels/' + id,
    method: 'delete'
  })
}
