import { z } from 'zod'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
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

import { detailList } from '../data/schema'
import { Tag } from 'lucide-react'

const formSchema = z
  .object({
    list_id:  z.string().min(1, 'list_id is required.'),
    list_name: z.string().min(1, 'list_name is required.'),
    value: z.string().min(1, 'value is required.'),
    tag: z.string(),
    ttl: z.number()
 })
type detailListForm = z.infer<typeof formSchema>

type DetailListCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initform: any
}
export function DetailListCreateDialog({
  open,
  onOpenChange,
  initform
}: DetailListCreateDialogProps) {
  const queryClient = useQueryClient()
  const form = useForm<detailListForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      list_id: initform.list_id || '',
      list_name: initform.list_name || '',
      value: initform.value || '',
      tag: initform.tag || '',
      ttl: initform.ttl || null,
    },
  })


  const onSubmit = (values: detailListForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
    console.log('Submitted data:', values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{'新增名单数据'}</DialogTitle>
          <DialogDescription>
            {'Create new detail list here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
          <Form {...form}>
            <form
              id='detail-add-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField 
              control={form.control}
              name='list_id'
              render={() => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1' hidden >
                  <FormLabel className='col-span-2 text-end'>list_id</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder={initform.list_id}
                      className='col-span-4'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='list_name'
              render={() => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1' >
                  <FormLabel className='col-span-2 text-end'>名单名称:</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      defaultValue={initform.list_name}
                      className='col-span-4'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name='value'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>名单数据: </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请输入名单数据'
                        className='col-span-4'
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tag'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                    备注:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='请输入备注'
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
                name='ttl'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                    过期时间(秒):
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请输入过期时间'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        <DialogFooter>
          <Button type='submit' form='detail-add-form'>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}