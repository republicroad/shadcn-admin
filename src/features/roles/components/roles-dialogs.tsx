import { RolesActionDialog } from './roles-action-dialog'
import { RolesDeleteDialog, RolesMultiDeleteDialog } from './roles-delete-dialog'

export function RolesDialogs() {
  return (
    <>
      <RolesActionDialog />
      <RolesDeleteDialog />
      <RolesMultiDeleteDialog rows={[]} />
    </>
  )
}
