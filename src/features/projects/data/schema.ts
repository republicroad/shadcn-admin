import { z } from 'zod'

// const ProjectStatusSchema = z.union([
//   z.literal('active'),
//   z.literal('inactive'),
//   z.literal('invited'),
//   z.literal('suspended'),
// ])
// export type ProjectStatus = z.infer<typeof ProjectStatusSchema>

// const ProjectRoleSchema = z.union([
//   z.literal('superadmin'),
//   z.literal('admin'),
//   z.literal('cashier'),
//   z.literal('manager'),
// ])

const ProjectSchema = z.object({
  id: z.string(),
  proj_name: z.string(),
  proj_id: z.string(),
  rule_count: z.int(),
  create_time: z.coerce.date(),
  update_time: z.coerce.date(),
})
export type Project = z.infer<typeof ProjectSchema>

export const ProjectListSchema = z.array(ProjectSchema)
