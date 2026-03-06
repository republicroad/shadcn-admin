import { z } from 'zod'

export const postSchema = z.object({
  postId: z.number(),
  postCode: z.string(),
  postName: z.string(),
  postSort: z.number(),
  status: z.string().optional(),
  createBy: z.string().optional(),
  createTime: z.string().optional(),
  updateBy: z.string().optional(),
  updateTime: z.string().optional(),
  remark: z.string().optional(),
})

export type Post = z.infer<typeof postSchema>
