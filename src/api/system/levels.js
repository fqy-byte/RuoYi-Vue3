import request from '@/utils/request'

// 查询relicLevels列表
export function listLevels(query) {
  return request({
    url: '/system/levels/list',
    method: 'get',
    params: query
  })
}

// 查询relicLevels详细
export function getLevels(id) {
  return request({
    url: '/system/levels/' + id,
    method: 'get'
  })
}

// 新增relicLevels
export function addLevels(data) {
  return request({
    url: '/system/levels',
    method: 'post',
    data: data
  })
}

// 修改relicLevels
export function updateLevels(data) {
  return request({
    url: '/system/levels',
    method: 'put',
    data: data
  })
}

// 删除relicLevels
export function delLevels(id) {
  return request({
    url: '/system/levels/' + id,
    method: 'delete'
  })
}
