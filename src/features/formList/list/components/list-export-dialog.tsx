
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
  FormLabel
} from '@/components/ui/form'
import { RadioGroup,  RadioGroupItem} from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { _List } from '../data/schema'


const formSchema = z.object({
  list_name: z.string(),
  list_id: z.string(),
  file_type: z.string()
})

type ListExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: _List
}

export function ListExportDialog({
  open,
  onOpenChange,
  currentRow
}: ListExportDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      list_name: currentRow? currentRow.list_name: '',
      list_id: currentRow? currentRow.list_id: '',
      file_type: ''
    },
  })

  const onSubmit = () => {
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle> 文件导出</DialogTitle>
          <DialogDescription>
            Export list quickly from a csv/xlxs file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='list-export-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name='list_id'
              render={() => (
                <FormItem className='my-2' hidden >
                  <FormLabel>list_id</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder={currentRow.list_id}
                      className='h-8 py-0'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='list_name'
              render={() => (
                <FormItem className='my-2' >
                  <FormLabel>名单名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder={currentRow.list_name}
                      className='h-8 py-0'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='file_type'
              render={( field ) => (
                <FormItem className='my-2' >
                  <FormLabel>文件类型</FormLabel>
                  <FormControl>
                      <RadioGroup
                      defaultValue='csv'
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='csv' />
                        </FormControl>
                        <FormLabel className='font-normal'>csv</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='xlsx' />
                        </FormControl>
                        <FormLabel className='font-normal'>xlsx</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>

                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' form='list-export-form'>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
