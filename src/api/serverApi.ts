
import api from '@/shared/apiClient'

export async function fetchCounterList() {
  const response = await api.get('/api/counter');
  return await response.data
}

export async function createCounter(
  user_id: string,
  counter_name: string,
  counter_type: string,
  counter_time: string
) {
  const response = await api.post('/api/counter', { user_id, counter_name, counter_type, counter_time})
  return await response.data
}

export async function deleteCounter(
  id: string | number,
  user_id: string,
) {
  const response = await api.delete(`/api/counter?id=${id}&user_id=${user_id}`)
  return await response.data
}


export async function fetchFormList() {
  const response = await api.get('/api/formlist');
  return await response.data
}

export async function createFormList(
  user_id: string,
  list_name: string,
) {
  const response = await api.post('/api/formlist', { user_id, list_name })
  return await response.data
}

export async function deleteFormList(
  list_id: string,
) {
  const response = await api.delete(`/api/formlist?list_id=${list_id}`)
  return await response.data
}

export async function uploadFormList(
    list_id: string,
    list_name: string,
    user_id: string,
    data: FormData
) {
  const response = await api.post(
    `/api/formlist/upload_list?user_id=${user_id}&list_id=${list_id}&list_name=${list_name}`,
    data,
    {
      headers: {'Content-Type': 'multipart/form-data',},
    }
  )
  return await response.data
}

export async function exportFormList(
    list_id: string,
    list_name: string,
    file_type: string
) {
  const response = await api.get(
    `/api/formlist/export_list?list_id=${list_id}&list_name=${list_name}&file_type=${file_type}`,
    {
      responseType: 'blob',
    }
  )
  return await response.data
}

export async function fetchFormListDetail(
    list_id: string,
) {
  const response = await api.get(`api/formlist/detail?list_id=${list_id}`)
  return await response.data
}

export async function fetchListData(
    list_id: string,
) {
  const response = await api.get(`api/formlist/listdata?list_id=${list_id}`)
  return await response.data
}

export async function createListData(
  list_id: string,
  list_name: string,
  user_id: string,
  value: string,
  tag: string,
  ttl?: number
) {
  const response = await api.post('/api/formlist/listdata', { list_id, list_name, user_id, value, tag, ttl })
  return await response.data
}

export async function deleteListData(
  data_id: number | string,
) {
  const response = await api.delete(`/api/formlist/listdata?data_id=${data_id}`)
  return await response.data
}
