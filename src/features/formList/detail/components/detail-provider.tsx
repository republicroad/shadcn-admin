import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type detailList } from '../data/schema'

type DetailListDialogType = 'create' | 'import' | 'export' | 'delete'

type DetailListContextType = {
  open: DetailListDialogType | null
  setOpen: (str: DetailListDialogType | null) => void
  currentRow: detailList | null
  setCurrentRow: React.Dispatch<React.SetStateAction<detailList | null>>
}

const DetailListContext = React.createContext<DetailListContextType | null>(null)

export function DetailListProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DetailListDialogType>(null)
  const [currentRow, setCurrentRow] = useState<detailList | null>(null)

  return (
    <DetailListContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DetailListContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDetailList = () => {
  const detaiListContext = React.useContext(DetailListContext)

  if (!detaiListContext) {
    throw new Error('useDetailList has to be used within <ListContext>')
  }

  return detaiListContext
}
