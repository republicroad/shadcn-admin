import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type shareCounter } from '../data/schema'

type CounterDialogType = 'add' | 'delete'

type CounterContextType = {
  open: CounterDialogType | null
  setOpen: (str: CounterDialogType | null) => void
  currentRow: shareCounter | null
  setCurrentRow: React.Dispatch<React.SetStateAction<shareCounter | null>>
}

const CounterContext = React.createContext<CounterContextType | null>(null)

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CounterDialogType>(null)
  const [currentRow, setCurrentRow] = useState<shareCounter | null>(null)

  return (
    <CounterContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CounterContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCounter = () => {
  const counterContext = React.useContext(CounterContext)

  if (!counterContext) {
    throw new Error('useCounter has to be used within <CounterContext>')
  }

  return counterContext
}
