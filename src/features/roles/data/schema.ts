import { z } from 'zod'

export const roleSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
  roleKey: z.string(),
  roleSort: z.number(),
  dataScope: z.string().optional(),
  status: z.string().optional(),
  delFlag: z.string().optional(),
  createBy: z.string().optional(),
  createTime: z.string().optional(),
  updateBy: z.string().optional(),
  updateTime: z.string().optional(),
  remark: z.string().optional(),
  menuIds: z.array(z.number()).optional(),
  deptIds: z.array(z.number()).optional(),
})

export type Role = z.infer<typeof roleSchema>
