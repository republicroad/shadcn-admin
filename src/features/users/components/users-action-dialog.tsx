'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ChevronsUpDown } from 'lucide-react'
import { type SysUser, userService, roleService, type SysRole } from '@/services'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const formSchema = z
  .object({
    userName: z.string().min(1, 'Username is required.'),
    nickName: z.string().min(1, 'Nick name is required.'),
    email: z.string().email().optional().or(z.literal('')),
    phonenumber: z.string().optional(),
    sex: z.string().optional(),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    status: z.string().optional(),
    deptId: z.number().optional(),
    remark: z.string().optional(),
    roleIds: z.array(z.number()).optional(),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 6
    },
    {
      message: 'Password must be at least 6 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )

type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: SysUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: UserActionDialogProps) {
  // console.log('Current user data:', currentRow)
  const isEdit = !!currentRow
  const { t } = useTranslation('users')
  const [roles, setRoles] = useState<SysRole[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  const statuses = [
    { value: '0', label: t('statusNormal') },
    { value: '1', label: t('statusDisabled') },
  ]

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      nickName: '',
      email: '',
      phonenumber: '',
      sex: '0',
      password: '',
      confirmPassword: '',
      status: '0',
      deptId: 0,
      remark: '',
      roleIds: [],
      isEdit: false,
    },
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true)
        const data = await roleService.getAllRoles()
        setRoles(data)
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      } finally {
        setLoadingRoles(false)
      }
    }

    if (open) {
      fetchRoles()
    }
  }, [open])

  useEffect(() => {
    console.log('Current user data in effect:', currentRow)
    if (currentRow) {
      const roleIds = currentRow.roles?.map((role) => role.roleId) || []
      form.reset({
        userName: currentRow.userName,
        nickName: currentRow.nickName,
        email: currentRow.email || '',
        phonenumber: currentRow.phonenumber || '',
        sex: currentRow.sex || '0',
        password: '',
        confirmPassword: '',
        status: currentRow.status || '0',
        deptId: currentRow.deptId || 0,
        remark: currentRow.remark || '',
        roleIds: roleIds,
        isEdit: true,
      })
    } else if (!currentRow) {
      form.reset({
        userName: '',
        nickName: '',
        email: '',
        phonenumber: '',
        sex: '0',
        password: '',
        confirmPassword: '',
        status: '0',
        deptId: 0,
        remark: '',
        roleIds: [],
        isEdit: false,
      })
    }
  }, [currentRow, form, loadingRoles])

  const onSubmit = async (data: UserForm) => {
    try {
      if (isEdit && currentRow) {
        await userService.updateUser(currentRow.userId, {
          nickName: data.nickName,
          email: data.email,
          phonenumber: data.phonenumber,
          sex: data.sex,
          status: data.status,
          deptId: data.deptId && data.deptId > 0 ? data.deptId : undefined,
          remark: data.remark,
          roleIds: data.roleIds,
        })
        toast.success(t('success.updated'))
      } else {
        await userService.createUser({
          userName: data.userName,
          nickName: data.nickName,
          email: data.email || '',
          phonenumber: data.phonenumber || '',
          sex: data.sex,
          password: data.password,
          status: data.status,
          deptId: data.deptId && data.deptId > 0 ? data.deptId : undefined,
          remark: data.remark,
          roleIds: data.roleIds,
        })
        toast.success(t('success.created'))
      }
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.log('Error caught:', error)
      console.log('Error response:', error.response)
      console.log('Error response data:', error.response?.data)

      // 处理用户名重复错误
      const errorMsg = error.response?.data?.msg || ''
      const errorCode = error.response?.data?.code

      console.log('Error message:', errorMsg)
      console.log('Error code:', errorCode)

      if (errorCode === 409 || errorMsg.includes('用户名已存在') || errorMsg.includes('already exists')) {
        toast.error(t('errors.userAlreadyExists'))
      } else if (isEdit) {
        toast.error(t('errors.updateFailed'))
      } else {
        toast.error(t('errors.createFailed'))
      }
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? t('editUser') : t('newUser')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('dialogDescription.edit') : t('dialogDescription.create')}
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='userName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('userName')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.userName')}
                        className='col-span-4'
                        disabled={isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nickName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('nickName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('placeholders.nickName')} className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('placeholders.email')} className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phonenumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('placeholders.phone')} className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('status')}</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={t('placeholders.selectStatus')}
                        className='col-span-4'
                        items={statuses}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='roleIds'
                render={({ field }) => {
                  const selectedRoles = roles.filter((role) =>
                    field.value?.includes(role.roleId)
                  )
                  return (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>{t('role')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className='col-span-4 justify-between font-normal h-auto min-h-10'
                            >
                              <div className='flex flex-wrap gap-1 flex-1'>
                                {selectedRoles.length > 0 ? (
                                  selectedRoles.map((role) => (
                                    <Badge key={role.roleId} variant='secondary'>
                                      {role.roleName}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className='text-muted-foreground'>
                                    {t('placeholders.selectRole')}
                                  </span>
                                )}
                              </div>
                              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[300px] p-0'>
                          <div className='max-h-[300px] overflow-y-auto p-4'>
                            {loadingRoles ? (
                              <div className='text-sm text-muted-foreground text-center py-4'>
                                Loading roles...
                              </div>
                            ) : roles.length === 0 ? (
                              <div className='text-sm text-muted-foreground text-center py-4'>
                                No roles available
                              </div>
                            ) : (
                              <div className='space-y-2'>
                                {roles.map((role) => (
                                  <div key={role.roleId} className='flex items-center space-x-2'>
                                    <Checkbox
                                      checked={field.value?.includes(role.roleId)}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || []
                                        if (checked) {
                                          field.onChange([...currentValue, role.roleId])
                                        } else {
                                          field.onChange(
                                            currentValue.filter((id) => id !== role.roleId)
                                          )
                                        }
                                      }}
                                    />
                                    <label className='text-sm font-normal cursor-pointer flex-1'>
                                      {role.roleName}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )
                }}
              />
              {!isEdit && (
                <>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>{t('password')}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t('placeholders.password')}
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>{t('confirmPassword')}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            disabled={!isPasswordTouched}
                            placeholder={t('placeholders.password')}
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            {t('buttons.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
