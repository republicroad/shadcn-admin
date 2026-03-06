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
import { statuses } from '../data/data'
import { useDeptsDialog } from './depts-provider'
import { deptService } from '@/services'
import { toast } from 'sonner'

const formSchema = z.object({
  deptName: z.string().min(1, 'Department name is required.'),
  parentId: z.number().optional(),
  orderNum: z.number().optional(),
  leader: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  status: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function DeptsActionDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { open, setOpen, currentRow } = useDeptsDialog()
  const isEdit = !!currentRow

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deptName: '',
      parentId: 0,
      orderNum: 0,
      leader: '',
      phone: '',
      email: '',
      status: '0',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        deptName: currentRow.deptName,
        parentId: currentRow.parentId || 0,
        orderNum: currentRow.orderNum || 0,
        leader: currentRow.leader || '',
        phone: currentRow.phone || '',
        email: currentRow.email || '',
        status: currentRow.status || '0',
      })
    } else {
      form.reset({
        deptName: '',
        parentId: 0,
        orderNum: 0,
        leader: '',
        phone: '',
        email: '',
        status: '0',
      })
    }
  }, [currentRow, form])

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit && currentRow) {
        await deptService.updateDept(currentRow.deptId, data)
        toast.success('Department updated successfully')
      } else {
        await deptService.createDept(data)
        toast.success('Department created successfully')
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
          <DialogTitle>{isEdit ? 'Edit Department' : 'Create New Department'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the department information.' : 'Add a new department to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form id='dept-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='deptName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., IT Department' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='orderNum'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Sort Order</FormLabel>
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
                name='leader'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Leader</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., John Doe' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., +1234567890' className='col-span-4' {...field} />
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
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., dept@example.com' className='col-span-4' {...field} />
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='dept-form'>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
