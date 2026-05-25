'use client'

import { useState } from 'react'
import z from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import EmailInput from '@/components/ui/email-input'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { PasswordInput } from '@/components/ui/password-input'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { AuthLayout } from '../auth-layout'

const formSchema = z
  .object({
    email: z.email().max(255, 'Email must be at most 255 characters'),
    otp: z
      .string()
      .min(6, 'OTP must be 6 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'OTP has invalid characters'),
    password: z.string().max(255, 'Password must be at most 255 characters'),
    confirmPassword: z
      .string()
      .max(255, 'Confirm Password must be at most 255 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  })

type FormSchema = z.infer<typeof formSchema>
type FormField = keyof FormSchema

export const ForgotPasswordOTP = () => {
  const steps: { title: string; description: string; fields: FormField[] }[] = [
    {
      title: 'forgot-password',
      description:
        '请输入您注册时使用的邮箱地址，我们将向您发送一个包含验证码的邮件。',
      fields: ['email'],
    },
    {
      title: 'otp',
      description: '请输入邮箱中的验证码以验证您的身份。',
      fields: ['otp'],
    },
    {
      title: 'reset-password',
      description: '请输入新的密码以重置您的账户密码。',
      fields: ['password', 'confirmPassword'],
    },
  ]

  const [currentStep, setCurrentStep] = useState(0)

  const currentForm = steps[currentStep]

  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  const handleNextButton = async () => {
    const currentFields = steps[currentStep].fields

    const isValid = await form.trigger(currentFields)

    if (isValid && !isLastStep) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBackButton = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onSubmit = async (values: FormSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Form successfully submitted')

    console.log(values)
  }

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0: {
        return (
          <FieldGroup>
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <EmailInput
                    {...field}
                    id='email'
                    aria-invalid={fieldState.invalid}
                    placeholder=''
                    autoComplete='off'
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        )
      }

      case 1: {
        return (
          <FieldGroup>
            <Controller
              name='otp'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='otp'>OTP</FieldLabel>
                  <InputOTP
                    id='otp'
                    maxLength={6}
                    pattern='^[a-zA-Z0-9]+$'
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                    disabled={false}
                  >
                    <InputOTPGroup className='gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                      {Array.from({ length: 6 }, (_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        )
      }

      case 2: {
        return (
          <FieldGroup>
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id='password'
                    aria-invalid={fieldState.invalid}
                    placeholder=''
                    autoComplete='off'
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id='confirmPassword'
                    aria-invalid={fieldState.invalid}
                    placeholder=''
                    autoComplete='off'
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        )
      }

      default: {
        return null
      }
    }
  }

  return (
    <Card>
      <CardHeader className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <CardTitle>{currentForm.title}</CardTitle>
            <p className='text-xs text-muted-foreground'>
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardDescription>{currentForm.description}</CardDescription>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent>
        <form id='multi-form' onSubmit={form.handleSubmit(onSubmit)}>
          {renderCurrentStepContent()}
        </form>
      </CardContent>
      <CardFooter>
        <Field className='justify-between' orientation='horizontal'>
          {currentStep > 0 && (
            <Button type='button' variant='ghost' onClick={handleBackButton}>
              <ChevronLeft /> Back
            </Button>
          )}
          {!isLastStep && (
            <Button
              type='button'
              variant='secondary'
              onClick={handleNextButton}
            >
              Next
              <ChevronRight />
            </Button>
          )}
          {isLastStep && (
            <Button
              type='submit'
              form='multi-form'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : 'Submit'}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  )
}
