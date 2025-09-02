import { faker } from '@faker-js/faker'

export const projects_data = Array.from({ length: 25 }, () => {
    const id = faker.string.uuid()
    const proj_name = faker.person.fullName()
    const proj_id = faker.string.uuid()
    const rule_count = faker.number.int()
    // const rule_count = parseInt(faker.number.romanNumeral({"min":18,"max":100}))
    // const rule_count = parseInt("11")
    const create_time = faker.date.past()
    const update_time = faker.date.recent()
    return {
        id,proj_name, proj_id, rule_count, create_time, update_time
    }
})