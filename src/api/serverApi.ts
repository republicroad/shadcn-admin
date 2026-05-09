import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/';

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


httpClient.defaults.headers.common['Content-Type'] = 'application/json';

export async function fetchCounterList() {
  const response = await httpClient.get('/api/counter');
  return await response.data
}


export async function createCounter(
  user_id: string,
  counter_name: string,
  counter_type: string,
  counter_time: string
) {
  const response = await httpClient.post('/api/counter', { user_id, counter_name, counter_type, counter_time})
  return await response.data
}


export async function deleteCounter(
  id: any,
  user_id: string,
) {
  const response = await httpClient.delete(`/api/counter?id=${id}&user_id=${user_id}`)
  return await response.data
}