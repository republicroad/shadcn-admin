import { TrashIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { type Role } from '../data/schema'
import { useRolesMultiDeleteDialog } from './roles-provider'

interface DataTableBulkActionsProps {
  table: Table<Role>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { setOpen } = useRolesMultiDeleteDialog()

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => setOpen(true)}
      disabled={!table.getFilteredSelectedRowModel().rows.length}
    >
      <TrashIcon className='mr-2 size-4' aria-hidden='true' />
      Delete ({table.getFilteredSelectedRowModel().rows.length})
    </Button>
  )
}
