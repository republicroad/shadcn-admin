import { useState, useEffect } from 'react'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, type SortingState, type ColumnFiltersState, type VisibilityState, type RowSelectionState } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTableToolbar } from '@/components/data-table'
import { deptService, type SysDept } from '@/services'
import { deptsColumns } from './depts-columns'
import { DeptsActionDialog } from './depts-action-dialog'
import { DeptsDeleteDialog } from './depts-delete-dialog'

export function DeptsTable() {
  const [data, setData] = useState<SysDept[]>([])
  const [loading, setLoading] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await deptService.getAllDepts()
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns: deptsColumns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar table={table} searchPlaceholder='Filter by department name...' searchKey='deptName' />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className={cn(header.column.columnDef.meta?.className)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={deptsColumns.length} className='h-24 text-center'>Loading...</TableCell>
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
                <TableCell colSpan={deptsColumns.length} className='h-24 text-center'>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DeptsActionDialog onSuccess={fetchData} />
      <DeptsDeleteDialog onSuccess={fetchData} />
    </div>
  )
}
