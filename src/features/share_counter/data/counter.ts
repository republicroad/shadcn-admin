export const counter_list = [
    {
        "id": 46,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "record共享计数器",
        "counter_type": "rate",
        "counter_time": "1d",
        "counter_func": "counter_rate_1d",
        "create_time": "2025-06-16T14:17:39.057449+08:00",
        "update_time": "2025-06-16T14:17:39.057449+08:00"
    },
    {
        "id": 42,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "测试",
        "counter_type": "rate",
        "counter_time": "10s",
        "counter_func": "counter_rate_10s",
        "create_time": "2025-05-23T15:38:11.901386+08:00",
        "update_time": "2025-05-23T15:38:11.901386+08:00"
    },
    {
        "id": 34,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "核电站1h",
        "counter_type": "rate",
        "counter_time": "1h",
        "counter_func": "counter_rate_1h",
        "create_time": "2025-03-28T11:19:59.110137+08:00",
        "update_time": "2025-03-28T11:19:59.110137+08:00"
    },
    {
        "id": 27,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "test",
        "counter_type": "rate",
        "counter_time": "5m",
        "counter_func": "counter_rate_5m",
        "create_time": "2025-03-21T11:37:59.385744+08:00",
        "update_time": "2025-03-21T11:37:59.385744+08:00"
    },
    {
        "id": 23,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "ihg登陆1h计数器",
        "counter_type": "group_distinct",
        "counter_time": "1h",
        "counter_func": "counter_group_distinct_1h",
        "create_time": "2025-03-10T11:12:27.082323+08:00",
        "update_time": "2025-03-10T11:12:27.082323+08:00"
    },
    {
        "id": 16,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "航空查询计数器5m",
        "counter_type": "rate",
        "counter_time": "5m",
        "counter_func": "counter_rate_5m",
        "create_time": "2025-03-05T17:12:27.537300+08:00",
        "update_time": "2025-03-05T17:12:27.537300+08:00"
    },
    {
        "id": 15,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "航空下定计数器5m",
        "counter_type": "rate",
        "counter_time": "5m",
        "counter_func": "counter_rate_5m",
        "create_time": "2025-03-05T17:12:10.121755+08:00",
        "update_time": "2025-03-05T17:12:10.121755+08:00"
    },
    {
        "id": 9,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "示例共享计数器",
        "counter_type": "rate",
        "counter_time": "1m",
        "counter_func": "counter_rate_1m",
        "create_time": "2025-03-04T10:04:22.123302+08:00",
        "update_time": "2025-03-04T10:04:22.123302+08:00"
    },
    {
        "id": 2,
        "user_id": "fb417c920bb142eabd6016a3520663b3",
        "counter_name": "示例共享分组去重计数器1m",
        "counter_type": "group_distinct",
        "counter_time": "1m",
        "counter_func": "counter_group_distinct_1m",
        "create_time": "2025-03-03T16:44:58.960663+08:00",
        "update_time": "2025-03-03T16:44:58.960663+08:00"
    }
]


import { faker } from '@faker-js/faker'

faker.seed(67890)


export const counters =  Array.from({ length: 100 }, () =>{
  const randomLetters = faker.string.alpha({ length: 3 }); 
  const randomNumber = faker.number.int({ min: 100, max: 999 });
  const countertName = `counter-test-${randomLetters}-${randomNumber}`;
  return {
    user_id: faker.string.uuid(),
    counter_name: countertName,
    counter_type: faker.helpers.arrayElement([
      'group_distinct',
      'rate'
    ]),
    counter_time: faker.helpers.arrayElement([
      '10s',
      '1m',
      '5m',
      '1h',
      '1d',
      '7d'
    ])
  }
})