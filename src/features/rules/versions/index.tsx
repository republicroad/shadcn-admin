import { useEffect, useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PROJECT_USER_ID } from '@/features/projects/constants'
import {
  createRule,
  deleteRule,
  fetchProjs,
  fetchRules,
  updateRule,
  updateRuleStatus,
  type Proj,
} from '../api'
import {
  getPersistedRulesAuth,
  getRulesAuthUserId,
  getRulesAuthUserKey,
} from '../lib/auth'
import { RuleCreateDialog } from './components/rule-create-dialog'
import { RuleEditDialog } from './components/rule-edit-dialog'
import { RuleVersionsTable } from './components/rule-versions-table'
import { type RuleVersion } from './data/schema'

type RulesAuthUser = {
  user_id?: string
  userId?: string
  id?: string
  user_key?: string
  userKey?: string
}

const DEFAULT_RULE_USER_KEY = import.meta.env.VITE_RULE_USER_KEY || ''

function getFirstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim()) || ''
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

function getProjUserKey(proj?: Proj) {
  if (!proj) return ''

  const candidateKeys = ['user_key', 'userKey']

  for (const key of candidateKeys) {
    const value = proj[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function getScenarioStats(data: RuleVersion[]) {
  return {
    total: data.length,
    active: data.filter((item) => item.rule_status === 'active').length,
    watch: data.filter((item) => item.rule_status === 'watch').length,
    close: data.filter((item) => item.rule_status === 'close').length,
  }
}

export function RuleVersions() {
  const [data, setData] = useState<RuleVersion[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RuleVersion | null>(null)
  const [projs, setProjs] = useState<Proj[]>([])
  const [selectedScenario, setSelectedScenario] = useState<string | undefined>(
    undefined
  )
  const user = useAuthStore((s) => s.user) as RulesAuthUser | null
  const accessToken = useAuthStore((s) => s.accessToken)
  const persistedAuth = getPersistedRulesAuth()
  const persistedUser = persistedAuth.user as RulesAuthUser | null
  const authToken = getFirstNonEmpty(accessToken, persistedAuth.accessToken)
  const userId =
    getFirstNonEmpty(
      getRulesAuthUserId(user, authToken),
      getRulesAuthUserId(persistedUser, authToken)
    ) || PROJECT_USER_ID

  useEffect(() => {
    if (!userId) return

    fetchProjs(userId)
      .then((list) => {
        setProjs(list)
        setSelectedScenario((current) => current ?? list[0]?.proj_id)
      })
      .catch((error) => toast.error(getErrorMessage(error, '获取场景列表失败')))
  }, [userId])

  useEffect(() => {
    if (!userId || !selectedScenario) return

    fetchRules(userId, selectedScenario)
      .then(setData)
      .catch((error) => toast.error(getErrorMessage(error, '获取规则列表失败')))
  }, [userId, selectedScenario])

  const currentScenario = projs.find((s) => s.proj_id === selectedScenario)
  const userKey = getFirstNonEmpty(
    getRulesAuthUserKey(user, authToken),
    getRulesAuthUserKey(persistedUser, authToken),
    getProjUserKey(currentScenario),
    DEFAULT_RULE_USER_KEY
  )
  const scenarioStats = useMemo(() => getScenarioStats(data), [data])
  const handleEdit = (row: RuleVersion) => {
    setSelectedRule(row)
    setEditDialogOpen(true)
  }

  const handleEditConfirm = (
    ruleId: string,
    fields: { rule_name: string; rule_desc: string; rule_graph?: string }
  ) => {
    if (!selectedRule || !userId) return

    updateRule(userId, selectedRule.proj_id, ruleId, fields)
      .then(() => {
        setData((current) =>
          current.map((item) =>
            item.rule_id === ruleId ? { ...item, ...fields } : item
          )
        )
        toast.success('规则已更新')
        setEditDialogOpen(false)
        setSelectedRule(null)
      })
      .catch((error) => toast.error(getErrorMessage(error, '更新失败，请重试')))
  }

  const handleDelete = (row: RuleVersion) => {
    setSelectedRule(row)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = (row: RuleVersion, newStatus: string) => {
    if (!userId) return

    const previousData = data

    setData((current) =>
      current.map((item) =>
        item.rule_id === row.rule_id
          ? { ...item, rule_status: newStatus as RuleVersion['rule_status'] }
          : item
      )
    )

    updateRuleStatus(userId, row.proj_id, row.rule_id, newStatus)
      .then(() => {
        const label = { active: '开启', watch: '观察', close: '关闭' }[
          newStatus
        ]
        toast.success(`规则 ${row.rule_id} 状态已更新为: ${label}`)

        if (newStatus === 'active' && selectedScenario) {
          fetchRules(userId, selectedScenario)
            .then(setData)
            .catch(() => {})
        }
      })
      .catch(() => {
        setData(previousData)
        toast.error('状态更新失败，已回滚')
      })
  }

  const handleCreateConfirm = (fields: {
    rule_name: string
    rule_desc: string
    rule_graph: string
  }) => {
    if (!selectedScenario || !userId) return

    createRule(userId, selectedScenario, fields)
      .then(() => {
        toast.success('规则创建成功')
        setCreateDialogOpen(false)
        return fetchRules(userId, selectedScenario)
      })
      .then(setData)
      .catch((error) => toast.error(getErrorMessage(error, '创建失败，请重试')))
  }

  const confirmDelete = () => {
    if (!selectedRule || !userId) return

    deleteRule(userId, selectedRule.rule_id, selectedRule.proj_id)
      .then(() => {
        setData((current) =>
          current.filter((item) => item.rule_id !== selectedRule.rule_id)
        )
        toast.success(`已删除规则: ${selectedRule.rule_id}`)
      })
      .catch((error) =>
        toast.error(getErrorMessage(error, '删除失败，请先关闭规则后再删除'))
      )
      .finally(() => {
        setDeleteDialogOpen(false)
        setSelectedRule(null)
      })
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>规则版本</h2>
            <p className='text-muted-foreground'>
              管理和查看规则的版本信息，支持多场景配置
            </p>
          </div>
        </div>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
              <div className='flex items-center gap-2'>
                <FileText className='size-5 text-muted-foreground' />
                <span className='text-sm font-medium'>场景配置</span>
              </div>
            </div>
            <div className='mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6'>
              <div className='flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-6'>
                <div className='flex items-center gap-3'>
                  <Label
                    htmlFor='scenario-select'
                    className='text-sm whitespace-nowrap text-muted-foreground'
                  >
                    选择场景
                  </Label>
                  <Select
                    value={selectedScenario}
                    onValueChange={setSelectedScenario}
                  >
                    <SelectTrigger
                      id='scenario-select'
                      className='w-full min-w-48 lg:w-56'
                    >
                      <SelectValue placeholder='请选择场景' />
                    </SelectTrigger>
                    <SelectContent>
                      {projs.map((proj) => (
                        <SelectItem key={proj.proj_id} value={proj.proj_id}>
                          {proj.proj_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center gap-3'>
                  <Label
                    htmlFor='scenario-code'
                    className='text-sm whitespace-nowrap text-muted-foreground'
                  >
                    场景编号
                  </Label>
                  <Input
                    id='scenario-code'
                    value={currentScenario?.proj_id || ''}
                    readOnly
                    className='w-full min-w-64 bg-muted/50 font-mono text-sm'
                  />
                </div>
              </div>
              <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                <span className='rounded-full border bg-muted/40 px-3 py-1 font-mono'>
                  user_id: {userId || '-'}
                </span>
                <span className='rounded-full border bg-muted/40 px-3 py-1'>
                  总规则 {scenarioStats.total}
                </span>
                <span className='rounded-full border bg-muted/40 px-3 py-1'>
                  开启 {scenarioStats.active}
                </span>
                <span className='rounded-full border bg-muted/40 px-3 py-1'>
                  观察 {scenarioStats.watch}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-4'>
            <RuleVersionsTable
              data={data}
              userId={userId}
              userKey={userKey}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onCreateNew={() => setCreateDialogOpen(true)}
              projId={selectedScenario}
            />
          </CardContent>
        </Card>
      </Main>

      <RuleCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onConfirm={handleCreateConfirm}
      />

      <RuleEditDialog
        rule={selectedRule}
        open={editDialogOpen}
        userId={userId}
        projId={selectedRule?.proj_id ?? ''}
        onOpenChange={setEditDialogOpen}
        onConfirm={handleEditConfirm}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除规则{' '}
              <span className='font-semibold'>{selectedRule?.rule_id}</span>{' '}
              吗？ 此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
