import { z } from 'zod'

export const menuSchema = z.object({
  menuId: z.number(),
  menuName: z.string(),
  parentId: z.number().optional(),
  orderNum: z.number().optional(),
  path: z.string().optional(),
  component: z.string().optional(),
  query: z.string().optional(),
  routeName: z.string().optional(),
  isFrame: z.number().optional(),
  isCache: z.number().optional(),
  menuType: z.string(),
  visible: z.string().optional(),
  status: z.string().optional(),
  perms: z.string().optional(),
  icon: z.string().optional(),
  createBy: z.string().optional(),
  createTime: z.string().optional(),
  updateBy: z.string().optional(),
  updateTime: z.string().optional(),
  remark: z.string().optional(),
  children: z.array(z.any()).optional(),
})

export type Menu = z.infer<typeof menuSchema>
