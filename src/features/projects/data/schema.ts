import { z } from 'zod'

export const projectSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  projectId: z.string(),
  ruleCount: z.number(),
  updateTime: z.string(),
})

export type Project = z.infer<typeof projectSchema>
export type Task = Project & {
  title: string
  status: string
  label: string
  priority: string
}
