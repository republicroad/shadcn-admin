import { ListImportDialog } from './list-import-dialog'
import { ListExportDialog } from './list-export-dialog'
import { ListCreateDialog } from './list-add-dialog'
import { ListDeleteDialog } from './list-delete-dialog'
import { useList } from './list-provider'

export function ListDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useList()
  return (
    <>
      <ListCreateDialog
        key='list-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ListImportDialog
            key={`list-import-${currentRow.list_id}`}
            open={open === 'import'}
            onOpenChange={() => {
              setOpen('import')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <ListExportDialog
            key={`list-export-${currentRow.list_id}`}
            open={open === 'export'}
            onOpenChange={() => {
              setOpen('export')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <ListDeleteDialog
            key={`list-delete-${currentRow.list_id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
        

      )}
    </>
  )
}