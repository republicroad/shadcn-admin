import { useEffect, useState } from 'react'
import { DetailListCreateDialog } from './detail-add-dialog'
import { DetailListDeleteDialog } from './detail-delete-dialog'
import { useDetailList } from './detail-provider'


export function DetailListDialogs( listData: any) {
  
  const { open, setOpen, currentRow, setCurrentRow } = useDetailList()
  const [initForm, setInit] = useState({});
  const originForm = {
    list_id: listData.list_id || '',
    list_name: listData.list_name || '',
    value: '',
    tag: '',
    create_time: '',
    ttl: '',
  }
  
  return (
    <>
      <DetailListCreateDialog
        key='detail-list-create'
        open={open === 'create'}
        onOpenChange={() =>{
          setOpen('create'),
          setInit(originForm)
        }}
        initform={initForm}
      />

      {currentRow && (
        <>
          <DetailListDeleteDialog
            key={`detail-list-delete-${currentRow.list_id}`}
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