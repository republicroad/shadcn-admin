
import api from '@/shared/apiClient'
import { file } from 'bun';


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
  id: any,
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
    data: any
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