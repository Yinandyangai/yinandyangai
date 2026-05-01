'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // 🧬 1. wait for session to hydrate
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        router.push('/login')
        return
      }

      // 🧠 2. now safely get user
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push('/login')
        return
      }

      setUser(userData.user)

      // 🔍 3. check if profile exists
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .maybeSingle()

      let finalProfile = existingProfile

      // 🧠 4. create profile if missing
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userData.user.id,
              email: userData.user.email,
            },
          ])
          .select()
          .single()

        if (insertError) {
          console.error('Profile insert error:', insertError)
        } else {
          finalProfile = newProfile
        }
      }

      setProfile(finalProfile)

      console.log('USER:', userData.user)
      console.log('PROFILE:', finalProfile)

      setLoading(false)
    }

    init()

    // 🔁 optional: keep session reactive
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router, supabase])

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      {user && <p>Logged in as: {user.email}</p>}

      {profile && (
        <>
          <p>Profile ID: {profile.id}</p>
          <p>Created at: {profile.created_at}</p>
        </>
      )}
    </div>
  )
}