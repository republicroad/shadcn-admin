import React, { useState } from 'react'
import { type NotificationChannel } from '../data/channels'
import { type NotificationRow } from '../data/row-guards'

export type NotificationsDialogType = 'add' | 'edit' | 'delete'
export type NotificationsDialogState = {
  channel: NotificationChannel
  type: NotificationsDialogType
}

type NotificationsContextType = {
  open: NotificationsDialogState | null
  setOpen: React.Dispatch<
    React.SetStateAction<NotificationsDialogState | null>
  >
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
  const [open, setOpen] = useState<NotificationsDialogState | null>(null)
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
