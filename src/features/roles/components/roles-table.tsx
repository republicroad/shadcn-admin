import { useState, useEffect } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, type SortingState, type ColumnFiltersState, type VisibilityState, type RowSelectionState } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { roleService, type SysRole } from '@/services'
import { rolesColumns } from './roles-columns'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { RolesActionDialog } from './roles-action-dialog'
import { RolesDeleteDialog, RolesMultiDeleteDialog } from './roles-delete-dialog'

export function RolesTable() {
  const [data, setData] = useState<SysRole[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await roleService.getRoleList({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      })
      setData(result.list)
      setTotal(result.total)
    } catch {
      // errors handled by api interceptor
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination])

  const table = useReactTable({
    data,
    columns: rolesColumns,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between gap-2'>
        <DataTableToolbar table={table} searchPlaceholder='Filter by role name...' searchKey='roleName' />
        <DataTableBulkActions table={table} />
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(header.column.columnDef.meta?.className)}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={rolesColumns.length} className='h-24 text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={rolesColumns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <RolesActionDialog onSuccess={fetchData} />
      <RolesDeleteDialog onSuccess={fetchData} />
      <RolesMultiDeleteDialog rows={selectedRows} onSuccess={() => { setRowSelection({}); fetchData() }} />
    </div>
  )
}
