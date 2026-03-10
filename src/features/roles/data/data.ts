import { useTranslation } from 'react-i18next'

export const useStatusesData = () => {
  const { t } = useTranslation('roles')
  return [
    {
      value: '0',
      label: t('normal'),
    },
    {
      value: '1',
      label: t('disabled'),
    },
  ]
}

export const useDataScopesData = () => {
  const { t } = useTranslation('roles')
  return [
    {
      value: '1',
      label: t('allData'),
    },
    {
      value: '2',
      label: t('customData'),
    },
    {
      value: '3',
      label: t('deptData'),
    },
    {
      value: '4',
      label: t('deptAndBelow'),
    },
    {
      value: '5',
      label: t('onlySelf'),
    },
  ]
}

// Legacy exports for backward compatibility
export const statuses = [
  {
    value: '0',
    label: 'Normal',
  },
  {
    value: '1',
    label: 'Disabled',
  },
]

export const dataScopes = [
  {
    value: '1',
    label: 'All Data',
  },
  {
    value: '2',
    label: 'Custom Data',
  },
  {
    value: '3',
    label: 'Department Data',
  },
  {
    value: '4',
    label: 'Department and Below',
  },
  {
    value: '5',
    label: 'Only Self',
  },
]
