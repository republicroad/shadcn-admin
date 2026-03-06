import { create } from 'zustand'
import { type Role } from '../data/schema'

interface RolesState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Role | null
  setCurrentRow: (role: Role | null) => void
}

export const useRolesDialog = create<RolesState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (role) => set({ currentRow: role }),
}))

interface RolesDeleteState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Role | null
  setCurrentRow: (role: Role | null) => void
}

export const useRolesDeleteDialog = create<RolesDeleteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (role) => set({ currentRow: role }),
}))

interface RolesMultiDeleteState {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useRolesMultiDeleteDialog = create<RolesMultiDeleteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
