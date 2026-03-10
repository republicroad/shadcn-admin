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
import { statuses, menuTypes, visibleOptions } from '../data/data'
import { useMenusDialog } from './menus-provider'
import { menuService } from '@/services'
import { toast } from 'sonner'

const formSchema = z.object({
  menuName: z.string().min(1, 'Menu name is required.'),
  parentId: z.number().optional(),
  orderNum: z.number().optional(),
  path: z.string().optional(),
  component: z.string().optional(),
  query: z.string().optional(),
  routeName: z.string().optional(),
  isFrame: z.number().optional(),
  isCache: z.number().optional(),
  menuType: z.string().min(1, 'Menu type is required.'),
  visible: z.string().optional(),
  status: z.string().optional(),
  perms: z.string().optional(),
  icon: z.string().optional(),
  remark: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function MenusActionDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { open, setOpen, currentRow } = useMenusDialog()
  const isEdit = !!currentRow

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menuName: '',
      parentId: 0,
      orderNum: 0,
      path: '',
      component: '',
      query: '',
      routeName: '',
      isFrame: 0,
      isCache: 0,
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: '',
      icon: '',
      remark: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        menuName: currentRow.menuName,
        parentId: currentRow.parentId || 0,
        orderNum: currentRow.orderNum || 0,
        path: currentRow.path || '',
        component: currentRow.component || '',
        query: currentRow.query || '',
        routeName: currentRow.routeName || '',
        isFrame: currentRow.isFrame || 0,
        isCache: currentRow.isCache || 0,
        menuType: currentRow.menuType,
        visible: currentRow.visible || '0',
        status: currentRow.status || '0',
        perms: currentRow.perms || '',
        icon: currentRow.icon || '',
        remark: currentRow.remark || '',
      })
    } else {
      form.reset({
        menuName: '',
        parentId: 0,
        orderNum: 0,
        path: '',
        component: '',
        query: '',
        routeName: '',
        isFrame: 0,
        isCache: 0,
        menuType: 'M',
        visible: '0',
        status: '0',
        perms: '',
        icon: '',
        remark: '',
      })
    }
  }, [currentRow, form])

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit && currentRow) {
        await menuService.updateMenu(currentRow.menuId, data)
        toast.success('Menu updated successfully')
      } else {
        await menuService.createMenu(data)
        toast.success('Menu created successfully')
      }
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Operation failed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Menu' : 'Create New Menu'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the menu information.' : 'Add a new menu to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form id='menu-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='menuName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu Name</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., System Management' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='menuType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu Type</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select type'
                          items={menuTypes}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='icon'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., Settings' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='orderNum'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='0'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='path'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Path</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., /system' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='component'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., system/index' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='perms'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., system:menu:list' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select status'
                          items={statuses}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='visible'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visible</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select visibility'
                          items={visibleOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remark</FormLabel>
                    <FormControl>
                      <Input placeholder='Optional remark' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='menu-form'>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
