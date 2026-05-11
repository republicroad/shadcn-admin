import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { getErrorMessage } from './get-error-message'

export function handleServerError(error: unknown) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'No content.'
  }

  if (error instanceof AxiosError) {
    errMsg = getErrorMessage(error, errMsg)
  }

  toast.error(errMsg)
}
