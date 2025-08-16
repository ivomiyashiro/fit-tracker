import RegisterPage from '@/web/modules/auth/pages/register.page'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up/')({
  beforeLoad: async ({ context }) => {
    if (context.auth?.user) {
      throw redirect({
        to: '/workouts',
      })
    }
  },
  component: RegisterPage,
})
