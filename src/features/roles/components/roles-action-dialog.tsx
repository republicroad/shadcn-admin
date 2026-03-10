'use client'

import { useEffect } from 'react'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { useDataScopesData, useStatusesData } from '../data/data'
import { useRolesDialog } from './roles-provider'
import { roleService } from '@/services'
import { useTranslation } from 'react-i18next'

const formSchema = z.object({
  roleName: z.string().min(1, 'Role name is required.').max(30, 'Role name must be less than 30 characters.'),
  roleKey: z.string().min(1, 'Role key is required.').max(100, 'Role key must be less than 100 characters.').regex(/^[a-zA-Z0-9_:]+$/, 'Role key can only contain letters, numbers, underscores and colons.'),
  roleSort: z.number().min(0),
  dataScope: z.string().optional(),
  status: z.string().optional(),
  remark: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function RolesActionDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation('roles')
  const statuses = useStatusesData()
  const dataScopes = useDataScopesData()
  const { open, setOpen, currentRow } = useRolesDialog()
  const isEdit = !!currentRow

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: '',
      roleKey: '',
      roleSort: 0,
      dataScope: '1',
      status: '0',
      remark: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        roleName: currentRow.roleName,
        roleKey: currentRow.roleKey,
        roleSort: currentRow.roleSort,
        dataScope: currentRow.dataScope || '1',
        status: currentRow.status || '0',
        remark: currentRow.remark || '',
      })
    } else if (open) {
      form.reset({ roleName: '', roleKey: '', roleSort: 0, dataScope: '1', status: '0', remark: '' })
    }
  }, [currentRow, form, open])

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit && currentRow) {
        await roleService.updateRole(currentRow.roleId, data)
      } else {
        const { roleSort, ...createData } = data
        await roleService.createRole(createData)
      }
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data?.msg || 'Operation failed'

      if (errorMsg.includes('角色名') || errorMsg.includes('role name')) {
        form.setError('roleName', {
          type: 'manual',
          message: errorMsg
        })
      } else if (errorMsg.includes('权限字符') || errorMsg.includes('role key')) {
        form.setError('roleKey', {
          type: 'manual',
          message: errorMsg
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? t('editRole') : t('createNewRole')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('updateRoleInfo') : t('addNewRole')}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form id='role-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='roleName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('roleName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('roleNamePlaceholder')} className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='roleKey'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('roleKey')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('roleKeyPlaceholder')} className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {isEdit && (
                <FormField
                  control={form.control}
                  name='roleSort'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>{t('sort')}</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='0'
                          className='col-span-4'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='dataScope'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('dataScope')}</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={t('selectDataScope')}
                        className='col-span-4'
                        items={dataScopes}
                      />
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
                        placeholder={t('selectStatus')}
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
                name='remark'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t('remark')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('remarkPlaceholder')} className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='role-form'>
            {isEdit ? t('update') : t('create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
