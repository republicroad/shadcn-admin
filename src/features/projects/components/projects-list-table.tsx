import * as React from 'react'
import { AlertTriangle, Check, Copy, Eye, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Project } from '../data/schema'

type ProjectsListTableProps = {
  projects: Project[]
  copiedProjectId: string | null
  deletingProjectId?: string | null
  isError?: boolean
  isLoading?: boolean
  onCopyProjectId: (projectId: string) => void
  onDeleteProject: (projectId: string) => Promise<void> | void
}

export function ProjectsListTable({
  projects,
  copiedProjectId,
  deletingProjectId,
  isError,
  isLoading,
  onCopyProjectId,
  onDeleteProject,
}: ProjectsListTableProps) {
  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow className='group/row'>
            <TableHead className='bg-background font-medium group-hover/row:bg-muted'>
              场景名称
            </TableHead>
            <TableHead className='bg-background font-medium group-hover/row:bg-muted'>
              场景编号
            </TableHead>
            <TableHead className='bg-background font-medium group-hover/row:bg-muted'>
              场景规则数量
            </TableHead>
            <TableHead className='bg-background font-medium group-hover/row:bg-muted'>
              修改时间
            </TableHead>
            <TableHead className='bg-background font-medium group-hover/row:bg-muted'>
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableMessage message='正在加载场景列表...' />
          ) : isError ? (
            <TableMessage message='场景列表加载失败，请稍后重试。' />
          ) : projects.length === 0 ? (
            <TableMessage message='暂无匹配的场景。' />
          ) : (
            projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                copiedProjectId={copiedProjectId}
                isDeleting={deletingProjectId === project.projectId}
                onCopyProjectId={onCopyProjectId}
                onDeleteProject={onDeleteProject}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function ProjectRow({
  project,
  copiedProjectId,
  isDeleting,
  onCopyProjectId,
  onDeleteProject,
}: {
  project: Project
  copiedProjectId: string | null
  isDeleting?: boolean
  onCopyProjectId: (projectId: string) => void
  onDeleteProject: (projectId: string) => Promise<void> | void
}) {
  const isCopied = copiedProjectId === project.projectId

  return (
    <TableRow className='group/row'>
      <TableCell className='bg-background font-medium group-hover/row:bg-muted'>
        {project.name}
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground'>{project.projectId}</span>
          <Button
            variant='ghost'
            size='sm'
            className={cn(
              'h-6 w-6 p-0 transition-colors',
              isCopied ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
            )}
            onClick={() => onCopyProjectId(project.projectId)}
            aria-label='复制场景编号'
          >
            {isCopied ? (
              <Check className='h-4 w-4' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
          </Button>
          {isCopied && (
            <span className='animate-in text-xs font-medium text-green-600 duration-200 fade-in'>
              已复制
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant='secondary'
          className='bg-blue-100 text-blue-700 hover:bg-blue-200'
        >
          {project.ruleCount}
        </Badge>
      </TableCell>
      <TableCell className='text-muted-foreground'>
        {project.updateTime}
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <ProjectDeleteConfirmButton
            project={project}
            isDeleting={isDeleting}
            onDeleteProject={onDeleteProject}
          />
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 hover:text-blue-600'
          >
            <Eye className='mr-1 h-4 w-4' />
            数据探索
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function ProjectDeleteConfirmButton({
  project,
  isDeleting,
  onDeleteProject,
}: {
  project: Project
  isDeleting?: boolean
  onDeleteProject: (projectId: string) => Promise<void> | void
}) {
  const [open, setOpen] = React.useState(false)
  const canDelete = project.ruleCount === 0

  const handleConfirmDelete = async () => {
    await onDeleteProject(project.projectId)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (!canDelete) {
          setOpen(false)
          return
        }
        setOpen(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          disabled={isDeleting}
          className={cn(
            'text-gray-400',
            canDelete ? 'hover:text-red-600' : 'hover:text-gray-400'
          )}
        >
          <Trash2 className='mr-1 h-4 w-4' />
          删除
        </Button>
      </PopoverTrigger>
      <PopoverContent side='top' align='center' className='w-64 p-3'>
        <div className='space-y-3'>
          <p className='flex items-center gap-2 text-base font-bold'>
            <AlertTriangle className='h-4 w-4 text-destructive' />
            删除场景
          </p>
          <p className='text-sm font-medium'>是否确认删除当前场景?</p>
          {/* <p className='text-xs text-muted-foreground'>{project.name}</p> */}
          <p className='text-xs font-bold text-red-600 md:text-sm'>
            {project.name}
          </p>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              variant='destructive'
              size='sm'
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              {isDeleting ? '删除中...' : '确定'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TableMessage({ message }: { message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
        {message}
      </TableCell>
    </TableRow>
  )
}
