import { faker } from '@faker-js/faker'

faker.seed(2345)

export const list_data = Array.from({ length: 100 }, () => {

  return {
    user_name: faker.internet.email(),
    list_id: `list_${faker.string.alphanumeric(16)}`,
    list_name: `TEST-List-${faker.number.int({ min: 1000, max: 9999 })}`,
    create_time: '2026-02-06T13:06:11+08:00',
  }
})
