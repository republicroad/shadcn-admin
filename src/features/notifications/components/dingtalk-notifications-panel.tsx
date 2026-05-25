import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import {
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { isDingtalkRow } from '../data/row-guards'
import { type DingtalkQueryResponse } from '../data/schema'
import { DingtalkConfigDialog } from './dingtalk-config-dialog'
import { DingtalkDeleteDialog } from './dingtalk-delete-dialog'
import { useNotifications } from './notifications-provider'

const emptyFilters = {
  user_id: '',
  dingtalk_name: '',
  dingtalk_url: '',
  tag: '',
}

const pageSizeOptions = ['10', '20', '50', '100']

function formatDate(date: Date) {
  return date.toLocaleString('zh-CN', { hour12: false })
}

function maskSensitive(value: string) {
  if (!value) return ''
  if (value.length <= 4) return `${value.slice(0, 1)}***`
  if (value.length <= 8) return `${value.slice(0, 2)}***${value.slice(-1)}`
  return `${value.slice(0, 6)}****${value.slice(-4)}`
}

type SensitiveValueCellProps = {
  value: string
  isVisible: boolean
  onToggle: () => void
  onCopy: () => void
}

function SensitiveValueCell({
  value,
  isVisible,
  onToggle,
  onCopy,
}: SensitiveValueCellProps) {
  return (
    <div className='flex min-w-0 items-center justify-between gap-2'>
      <div
        className='min-w-0 flex-1 self-center font-mono text-xs leading-5 break-all text-foreground'
        title={value}
      >
        {isVisible ? value : maskSensitive(value)}
      </div>
      <div className='flex shrink-0 flex-col items-center gap-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='size-7 text-muted-foreground hover:text-foreground'
              onClick={onToggle}
              aria-label={isVisible ? '隐藏内容' : '显示内容'}
            >
              {isVisible ? (
                <EyeOff className='size-3.5' />
              ) : (
                <Eye className='size-3.5' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>
            {isVisible ? '隐藏' : '显示'}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='size-7 text-muted-foreground hover:text-foreground'
              onClick={onCopy}
              aria-label='复制内容'
            >
              <Copy className='size-3.5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>复制</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export function DingtalkNotificationsPanel() {
  const { open, setOpen, currentRow, setCurrentRow } = useNotifications()
  const [draftFilters, setDraftFilters] = useState(emptyFilters)
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [jumpPage, setJumpPage] = useState('1')
  const [visibleWebhookIds, setVisibleWebhookIds] = useState<number[]>([])
  const [visibleKeyIds, setVisibleKeyIds] = useState<number[]>([])

  const queryParams = {
    user_id: filters.user_id.trim(),
    dingtalk_name: filters.dingtalk_name.trim(),
    dingtalk_url: filters.dingtalk_url.trim(),
    tag: filters.tag.trim(),
    current: page,
    page_size: pageSize,
  }

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['/api/notifications/notify_dingtalk_info', queryParams],
    queryFn: async () => {
      const response = await api.get<DingtalkQueryResponse>(
        '/api/notifications/notify_dingtalk_info',
        {
          params: queryParams,
        }
      )
      return response.data
    },
  })

  const dingtalks = data?.data.metadata ?? []
  const pagination = data?.data.pagination
  const totalRecords = pagination?.total ?? dingtalks.length
  const effectivePageSize = pagination?.pageSize ?? pageSize
  const totalPages = Math.max(1, Math.ceil(totalRecords / effectivePageSize))
  const currentPage = pagination?.current ?? page
  const scopedUserId = filters.user_id.trim()
  const currentDingtalkRow = isDingtalkRow(currentRow) ? currentRow : null
  const isAddOpen = open?.channel === 'dingtalk' && open.type === 'add'
  const isEditOpen = open?.channel === 'dingtalk' && open.type === 'edit'
  const isDeleteOpen = open?.channel === 'dingtalk' && open.type === 'delete'

  const closeDialogs = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const goToPage = (nextPage: number) => {
    const normalizedPage = Math.min(Math.max(nextPage, 1), totalPages)
    setPage(normalizedPage)
    setJumpPage(String(normalizedPage))
  }

  const handleSearch = () => {
    setFilters(draftFilters)
    setPage(1)
    setJumpPage('1')
  }

  const handleReset = () => {
    setDraftFilters(emptyFilters)
    setFilters(emptyFilters)
    setPage(1)
    setJumpPage('1')
  }

  const toggleWebhookVisible = (id: number) => {
    setVisibleWebhookIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleKeyVisible = (id: number) => {
    setVisibleKeyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label}已复制`)
    } catch {
      toast.error(`${label}复制失败`)
    }
  }

  if (isError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle />
        <AlertTitle>钉钉配置加载失败</AlertTitle>
        <AlertDescription>
          请稍后重试，或检查通知服务接口是否可用。
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='space-y-4'>
          <div className='rounded-xl border bg-muted/20 p-4 sm:p-5'>
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>用户id</label>
                <Input
                  value={draftFilters.user_id}
                  placeholder='按用户 user_id 精准匹配搜索'
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      user_id: event.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>钉钉名称</label>
                <Input
                  value={draftFilters.dingtalk_name}
                  placeholder='按名称模糊匹配搜索'
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      dingtalk_name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>钉钉链接</label>
                <Input
                  value={draftFilters.dingtalk_url}
                  placeholder='按钉钉链接模糊匹配搜索'
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      dingtalk_url: event.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>备注</label>
                <Input
                  value={draftFilters.tag}
                  placeholder='按备注模糊匹配搜索'
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      tag: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-3 border-t pt-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <Button onClick={handleSearch}>
                  <Search className='size-4' />
                  搜索
                </Button>
                <Button variant='outline' onClick={handleReset}>
                  <RotateCcw className='size-4' />
                  重置
                </Button>
              </div>

              <div className='flex min-h-9 items-center gap-2 text-sm text-muted-foreground lg:justify-end'>
                {scopedUserId ? (
                  <Badge variant='outline'>当前 user_id：{scopedUserId}</Badge>
                ) : null}
                {isFetching && !isLoading ? (
                  <span>正在按条件查询...</span>
                ) : null}
              </div>
            </div>

            <div className='flex justify-start lg:justify-end'>
              <Button
                onClick={() => {
                  setCurrentRow(null)
                  setOpen({ channel: 'dingtalk', type: 'add' })
                }}
              >
                <Plus className='size-4' />
                新增钉钉配置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='gap-2'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div className='text-sm text-muted-foreground'>
              共 {totalRecords} 条记录，当前第 {currentPage} / {totalPages} 页
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isLoading ? (
            <p className='text-sm text-muted-foreground'>正在加载钉钉配置...</p>
          ) : (
            <div className='space-y-4'>
              <div className='rounded-md border'>
                <ScrollArea
                  orientation='horizontal'
                  className='w-full whitespace-nowrap'
                >
                  <table className='min-w-[1980px] caption-bottom text-sm'>
                    <thead className='bg-muted/10 [&_tr]:border-b'>
                      <tr>
                        <th className='h-10 w-[360px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          用户id
                        </th>
                        <th className='h-10 w-[180px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          钉钉名称
                        </th>
                        <th className='h-10 w-[320px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          备注
                        </th>
                        <th className='h-10 w-[420px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          钉钉 Webhook
                        </th>
                        <th className='h-10 w-[340px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          密钥
                        </th>
                        <th className='h-10 w-[260px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          创建时间
                        </th>
                        <th className='h-10 w-[260px] px-3 text-left align-middle font-medium whitespace-nowrap text-foreground'>
                          更新时间
                        </th>
                        <th className='sticky right-0 z-20 h-10 w-[190px] border-l bg-background px-3 text-right align-middle font-medium whitespace-nowrap text-foreground shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.35)]'>
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className='[&_tr:last-child]:border-0'>
                      {dingtalks.length > 0 ? (
                        dingtalks.map((item) => (
                          <tr
                            key={item.id}
                            className='group/row border-b transition-colors hover:bg-muted/50'
                          >
                            <td className='p-3 align-middle font-mono text-xs whitespace-nowrap text-muted-foreground'>
                              <span
                                className='block overflow-hidden text-ellipsis'
                                title={item.user_id}
                              >
                                {item.user_id}
                              </span>
                            </td>
                            <td className='p-3 align-middle break-all whitespace-normal'>
                              {item.dingtalk_name}
                            </td>
                            <td className='p-3 align-middle break-all whitespace-normal'>
                              {item.tag}
                            </td>
                            <td className='p-3 align-middle whitespace-normal'>
                              <SensitiveValueCell
                                value={item.dingtalk_url}
                                isVisible={visibleWebhookIds.includes(item.id)}
                                onToggle={() => toggleWebhookVisible(item.id)}
                                onCopy={() =>
                                  handleCopy(item.dingtalk_url, 'Webhook')
                                }
                              />
                            </td>
                            <td className='p-3 align-middle whitespace-normal'>
                              <SensitiveValueCell
                                value={item.key}
                                isVisible={visibleKeyIds.includes(item.id)}
                                onToggle={() => toggleKeyVisible(item.id)}
                                onCopy={() => handleCopy(item.key, '密钥')}
                              />
                            </td>
                            <td className='p-3 align-middle font-mono text-xs whitespace-nowrap text-muted-foreground'>
                              <span className='inline-block min-w-[220px]'>
                                {formatDate(item.create_time)}
                              </span>
                            </td>
                            <td className='p-3 align-middle font-mono text-xs whitespace-nowrap text-muted-foreground'>
                              <span className='inline-block min-w-[220px]'>
                                {formatDate(item.update_time)}
                              </span>
                            </td>
                            <td className='sticky right-0 z-10 border-l bg-background p-3 text-right align-middle shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.35)] group-hover/row:bg-muted/50'>
                              <div className='flex justify-end gap-2'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => {
                                    setCurrentRow(item)
                                    setOpen({
                                      channel: 'dingtalk',
                                      type: 'edit',
                                    })
                                  }}
                                >
                                  <Pencil className='size-4' />
                                  编辑
                                </Button>
                                <Button
                                  size='sm'
                                  variant='destructive'
                                  onClick={() => {
                                    setCurrentRow(item)
                                    setOpen({
                                      channel: 'dingtalk',
                                      type: 'delete',
                                    })
                                  }}
                                >
                                  <Trash2 className='size-4' />
                                  删除
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className='border-b'>
                          <td
                            colSpan={8}
                            className='h-24 p-2 text-center align-middle'
                          >
                            当前筛选条件下暂无数据。
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>

              <div className='flex flex-col gap-4 rounded-lg border bg-muted/10 p-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'></div>

                <div className='flex flex-wrap items-center gap-2'>
                  <span className='mr-1 text-sm text-muted-foreground'>
                    第 {currentPage} / {totalPages} 页
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setPage(1)
                      setJumpPage('1')
                    }}
                  >
                    <SelectTrigger className='w-28'>
                      <SelectValue placeholder='每页条数' />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          每页 {option} 条
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    上一页
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    下一页
                  </Button>
                  <Input
                    type='number'
                    min='1'
                    max={String(totalPages)}
                    value={jumpPage}
                    className='w-20'
                    onChange={(event) => setJumpPage(event.target.value)}
                  />
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => goToPage(Number(jumpPage) || 1)}
                  >
                    跳转
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DingtalkConfigDialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDialogs()
          }
        }}
        currentRow={isEditOpen ? currentDingtalkRow : null}
        targetUserId={isAddOpen ? scopedUserId : currentDingtalkRow?.user_id}
      />

      <DingtalkDeleteDialog
        open={isDeleteOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDialogs()
          }
        }}
        currentRow={isDeleteOpen ? currentDingtalkRow : null}
      />
    </div>
  )
}
