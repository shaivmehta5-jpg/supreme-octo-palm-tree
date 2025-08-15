import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession()

  // If not logged in, send back to /login
  if (!session) {
    redirect('/login')
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
      <p>✅ Logged in as {session.user.email}</p>
    </main>
  )
}
