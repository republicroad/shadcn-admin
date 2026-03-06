import { postService } from '@/services'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usePostsDeleteDialog, usePostsMultiDeleteDialog } from './posts-provider'
import { type Row } from '@tanstack/react-table'
import { type Post } from '../data/schema'

export function PostsDeleteDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { open, setOpen, currentRow } = usePostsDeleteDialog()

  const handleDelete = async () => {
    if (!currentRow) return
    try {
      await postService.deletePost(currentRow.postId)
      toast.success('Post deleted successfully')
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Delete failed')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      handleConfirm={handleDelete}
      title='Delete Post'
      desc={`Are you sure you want to delete post "${currentRow?.postName}"? This action cannot be undone.`}
      confirmText='Delete'
      destructive
    />
  )
}

export function PostsMultiDeleteDialog({
  rows,
  onSuccess,
}: {
  rows: Row<Post>[]
  onSuccess?: () => void
}) {
  const { open, setOpen } = usePostsMultiDeleteDialog()

  const handleDelete = async () => {
    try {
      const ids = rows.map((r) => r.original.postId)
      await postService.deletePosts(ids)
      toast.success('Posts deleted successfully')
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Delete failed')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      handleConfirm={handleDelete}
      title='Delete Posts'
      desc={`Are you sure you want to delete ${rows.length} post(s)? This action cannot be undone.`}
      confirmText='Delete'
      destructive
    />
  )
}
