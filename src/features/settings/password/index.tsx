import { ContentSection } from '../components/content-section'
import { PasswordProfileForm } from './password-form'

export function SettingsPassword() {
  return (
    <ContentSection
      title='Password'
      desc='Reset your password.'
    >
      <PasswordProfileForm />
    </ContentSection>
  )
}
