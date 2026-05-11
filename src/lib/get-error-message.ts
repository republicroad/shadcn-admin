import { AxiosError } from 'axios'

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong!'
) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }

    const title = error.response?.data?.title
    if (typeof title === 'string' && title.trim().length > 0) {
      return title
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallback
}
