import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('initializing'),
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'), // 和系统相关的配置
  z.literal('admin'),      // 重置业务数据
  z.literal('manager'),    // 经理/主管
  z.literal('operator'),   // 操作员
  z.literal('auditor'),    // 审计员
])

const _userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof _userSchema>
export type userRole = z.infer<typeof userRoleSchema>

export const userListSchema = z.array(_userSchema)
