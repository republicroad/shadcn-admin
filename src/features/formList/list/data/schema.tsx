import { z } from 'zod'

export const listSchema = z.object({
  list_name: z.string(),
  list_id: z.string(),
  user_name: z.string(),
  create_time: z.string(),
})

export type _List = z.infer<typeof listSchema>