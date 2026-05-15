import { create } from 'zustand'

export type FormListOption = {
  list_id: string
  list_name: string
}

type FormListState = {
  listOptions: FormListOption[]
  setListOptions: (listOptions: FormListOption[]) => void
  resetListOptions: () => void
}

export const useFormListStore = create<FormListState>()((set) => ({
  listOptions: [],
  setListOptions: (listOptions) => {
    set({ listOptions })
  },
  resetListOptions: () => {
    set({ listOptions: [] })
  },
}))
