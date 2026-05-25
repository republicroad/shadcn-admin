import { z } from 'zod'

export const detailListSchema = z.object({
  id: z.int32(),
  user_id: z.string(),
  list_name: z.string(),
  list_id: z.string(),
  value: z.string(),
  tag: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  create_time: z.string(),
  update_time: z.string(),
  ttl:z.int32()
})

export type detailList = z.infer<typeof detailListSchema>

