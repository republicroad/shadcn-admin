import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useRolesDialog } from './roles-provider'
import { useTranslation } from 'react-i18next'

export function RolesPrimaryButtons() {
  const { t } = useTranslation('roles')
  const { setOpen, setCurrentRow } = useRolesDialog()

  const handleCreate = () => {
    setCurrentRow(null)
    setOpen(true)
  }

  return (
    <div className='flex gap-2'>
      <Button onClick={handleCreate} size='sm' className='h-8'>
        <PlusIcon className='mr-2 size-4' aria-hidden='true' />
        {t('newRole')}
      </Button>
    </div>
  )
}
