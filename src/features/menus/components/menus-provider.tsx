import { create } from 'zustand'
import { type Menu } from '../data/schema'

interface MenusState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Menu | null
  setCurrentRow: (menu: Menu | null) => void
}

export const useMenusDialog = create<MenusState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (menu) => set({ currentRow: menu }),
}))

interface MenusDeleteState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Menu | null
  setCurrentRow: (menu: Menu | null) => void
}

export const useMenusDeleteDialog = create<MenusDeleteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (menu) => set({ currentRow: menu }),
}))
