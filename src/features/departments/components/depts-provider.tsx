import { create } from 'zustand'
import { type Dept } from '../data/schema'

interface DeptsState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Dept | null
  setCurrentRow: (dept: Dept | null) => void
}

export const useDeptsDialog = create<DeptsState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (dept) => set({ currentRow: dept }),
}))

interface DeptsDeleteState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Dept | null
  setCurrentRow: (dept: Dept | null) => void
}

export const useDeptsDeleteDialog = create<DeptsDeleteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (dept) => set({ currentRow: dept }),
}))
