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
import { statuses, dataScopes } from '../data/data'
import { useRolesDialog } from './roles-provider'
import { roleService } from '@/services'
import { toast } from 'sonner'

const formSchema = z.object({
  roleName: z.string().min(1, 'Role name is required.'),
  roleKey: z.string().min(1, 'Role key is required.'),
  roleSort: z.number().min(0),
  dataScope: z.string().optional(),
  status: z.string().optional(),
  remark: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function RolesActionDialog({ onSuccess }: { onSuccess?: () => void }) {
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
    } else {
      form.reset({ roleName: '', roleKey: '', roleSort: 0, dataScope: '1', status: '0', remark: '' })
    }
  }, [currentRow, form])

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit && currentRow) {
        await roleService.updateRole(currentRow.roleId, data)
        toast.success('Role updated successfully')
      } else {
        await roleService.createRole(data)
        toast.success('Role created successfully')
      }
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Operation failed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the role information.' : 'Add a new role to the system.'}
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
                    <FormLabel className='col-span-2 text-end'>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Administrator' className='col-span-4' {...field} />
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
                    <FormLabel className='col-span-2 text-end'>Role Key</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., admin' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='roleSort'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Sort</FormLabel>
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
              <FormField
                control={form.control}
                name='dataScope'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Data Scope</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select data scope'
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
                    <FormLabel className='col-span-2 text-end'>Status</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select status'
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
                    <FormLabel className='col-span-2 text-end'>Remark</FormLabel>
                    <FormControl>
                      <Input placeholder='Optional remark' className='col-span-4' {...field} />
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
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
