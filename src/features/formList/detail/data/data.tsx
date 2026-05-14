import { faker } from '@faker-js/faker'

faker.seed(2345)

export const detail_data = Array.from({ length: 90 }, () => {

  return {
    user_id: 'fb417c920bb142eabd6016a3520663b3',
    list_id: `list_3a229e3398824476`,
    list_name: '账户黑名单',
    value: faker.internet.email(),
    tag: '',
    start_time:'',
    end_time: '',
    create_time: '2026-02-06T13:06:11+08:00',
    update_time: '2026-02-06T13:06:11+08:00',
    ttl:''
  } 
})
