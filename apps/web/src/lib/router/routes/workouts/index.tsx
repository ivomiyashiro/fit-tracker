import { createFileRoute, redirect } from '@tanstack/react-router'

import WorkoutsListPage from '@/web/modules/workouts/pages/workouts-list/workouts-list.page'

export const Route = createFileRoute('/workouts/')({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.user) {
      throw redirect({
        to: '/auth/sign-in',
      })
    }
  },
  component: WorkoutsListPage,
})
