import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type NotificationRow } from '../data/row-guards'

export type NotificationsDialogType = 'add' | 'edit' | 'delete'

type NotificationsContextType = {
  open: NotificationsDialogType | null
  setOpen: (str: NotificationsDialogType | null) => void
  currentRow: NotificationRow | null
  setCurrentRow: React.Dispatch<React.SetStateAction<NotificationRow | null>>
}

const NotificationsContext =
  React.createContext<NotificationsContextType | null>(null)

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<NotificationsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<NotificationRow | null>(null)

  return (
    <NotificationsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const notificationsContext = React.useContext(NotificationsContext)

  if (!notificationsContext) {
    throw new Error(
      'useNotifications has to be used within <NotificationsContext>'
    )
  }

  return notificationsContext
}
