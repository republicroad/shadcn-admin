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
import { usePostsDialog } from './posts-provider'
import { postService } from '@/services'
import { toast } from 'sonner'

const formSchema = z.object({
  postName: z.string().min(1, 'Post name is required.'),
  postCode: z.string().min(1, 'Post code is required.'),
  postSort: z.number().min(0),
  status: z.string().optional(),
  remark: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function PostsActionDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { open, setOpen, currentRow } = usePostsDialog()
  const isEdit = !!currentRow

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postName: '',
      postCode: '',
      postSort: 0,
      status: '0',
      remark: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        postName: currentRow.postName,
        postCode: currentRow.postCode,
        postSort: currentRow.postSort,
        status: currentRow.status || '0',
        remark: currentRow.remark || '',
      })
    } else {
      form.reset({ postName: '', postCode: '', postSort: 0, status: '0', remark: '' })
    }
  }, [currentRow, form])

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit && currentRow) {
        await postService.updatePost(currentRow.postId, data)
        toast.success('Post updated successfully')
      } else {
        await postService.createPost(data)
        toast.success('Post created successfully')
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
          <DialogTitle>{isEdit ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the post information.' : 'Add a new post to the system.'}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <Form {...form}>
            <form id='post-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='postName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Post Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Manager' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postCode'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., MGR' className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postSort'
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
          <Button type='submit' form='post-form'>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
