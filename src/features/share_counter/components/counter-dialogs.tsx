
import { CountersDeleteDialog } from './counter-delete-dialog'
import { CountersActionDialog } from './counter-add-dialogs'
import { useCounter } from './counter-provider'

export function CounterDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCounter()
  return (
    <>
      <CountersActionDialog
        key='counter-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <CountersDeleteDialog
            key={`counter-delete-${currentRow.counter_name}`}
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
