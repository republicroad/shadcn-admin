import { create } from 'zustand'
import { type Post } from '../data/schema'

interface PostsState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Post | null
  setCurrentRow: (post: Post | null) => void
}

export const usePostsDialog = create<PostsState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (post) => set({ currentRow: post }),
}))

interface PostsDeleteState {
  open: boolean
  setOpen: (open: boolean) => void
  currentRow: Post | null
  setCurrentRow: (post: Post | null) => void
}

export const usePostsDeleteDialog = create<PostsDeleteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (post) => set({ currentRow: post }),
}))

interface PostsMultiDeleteState {
  open: boolean
  setOpen: (open: boolean) => void
}

export const usePostsMultiDeleteDialog = create<PostsMultiDeleteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
