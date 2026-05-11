import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type _List } from '../data/schema'

type ListDialogType = 'create' | 'import' | 'export' | 'delete'

type ListContextType = {
  open: ListDialogType | null
  setOpen: (str: ListDialogType | null) => void
  currentRow: _List | null
  setCurrentRow: React.Dispatch<React.SetStateAction<_List | null>>
}

const ListContext = React.createContext<ListContextType | null>(null)

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ListDialogType>(null)
  const [currentRow, setCurrentRow] = useState<_List | null>(null)

  return (
    <ListContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ListContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useList = () => {
  const listContext = React.useContext(ListContext)

  if (!listContext) {
    throw new Error('useList has to be used within <ListContext>')
  }

  return listContext
}
