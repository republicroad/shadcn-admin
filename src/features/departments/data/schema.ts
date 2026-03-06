import { z } from 'zod'

export const deptSchema = z.object({
  deptId: z.number(),
  parentId: z.number().optional(),
  ancestors: z.string().optional(),
  deptName: z.string(),
  orderNum: z.number().optional(),
  leader: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
  delFlag: z.string().optional(),
  createBy: z.string().optional(),
  createTime: z.string().optional(),
  updateBy: z.string().optional(),
  updateTime: z.string().optional(),
  children: z.array(z.any()).optional(),
})

export type Dept = z.infer<typeof deptSchema>
