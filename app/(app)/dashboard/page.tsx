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

  // 🧬 INIT: session → user → profile
  useEffect(() => {
    const init = async () => {
      try {
        await supabase.auth.getSession()

        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          router.push('/login')
          return
        }

        const currentUser = data.user
        setUser(currentUser)

        // 🔍 Fetch profile
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        // 🧠 Create if missing
        if (!existingProfile) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([
              {
                id: currentUser.id,
                email: currentUser.email,
                onboarding_complete: false,
              },
            ])
            .select()
            .single()

          setProfile(newProfile)
          router.push('/onboarding')
          return
        }

        setProfile(existingProfile)

        // 🚪 Gate: onboarding
        if (!existingProfile.onboarding_complete) {
          router.push('/onboarding')
          return
        }
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // 🔓 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Loading your workspace...</div>
  }

  // ⚡ Derived state
  const readiness = profile?.onboarding_complete ? 100 : 10

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      {/* 🧭 Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: 28 }}>Mission control.</h1>
          <p style={{ opacity: 0.6, marginTop: 4 }}>
            One screen. One next move.
          </p>
        </div>

        <div>
          <span style={{ marginRight: 12, opacity: 0.7 }}>
            {user?.email}
          </span>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ⚡ Readiness */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 42, marginBottom: 0 }}>
          {readiness === 100 ? '1' : '0'}
        </h2>

        <p style={{ opacity: 0.7 }}>
          AI readiness — {readiness === 100 ? 'Activated' : 'Getting started'}
        </p>

        <div
          style={{
            height: 6,
            background: '#eee',
            borderRadius: 4,
            marginTop: 10,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${readiness}%`,
              background: 'black',
              height: '100%',
            }}
          />
        </div>
      </div>

      {/* 🎯 Next Action */}
      <div
        style={{
          marginTop: 40,
          padding: 20,
          border: '1px solid #eee',
          borderRadius: 10,
        }}
      >
        <p style={{ fontSize: 12, opacity: 0.6 }}>NEXT ACTION</p>

        {!profile?.onboarding_complete ? (
          <>
            <h3>Finish setting up your system</h3>
            <p style={{ opacity: 0.7 }}>
              Tell us about your business so we can tailor your AI workflows.
            </p>

            <button onClick={() => router.push('/onboarding')}>
              Continue onboarding →
            </button>
          </>
        ) : (
          <>
            <h3>Find your first AI-fit task</h3>
            <p style={{ opacity: 0.7 }}>
              We’ll identify the highest-leverage task to automate first.
            </p>

            <button>
              Start the audit →
            </button>
          </>
        )}
      </div>

      {/* 🧱 Workflows */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          border: '1px solid #eee',
          borderRadius: 10,
        }}
      >
        <h3>Active workflows</h3>

        <p style={{ opacity: 0.6 }}>
          Nothing running yet.
        </p>

        <button style={{ marginTop: 10 }}>
          Browse templates →
        </button>
      </div>

      {/* 🧠 Profile Context */}
      <div style={{ marginTop: 30, opacity: 0.6 }}>
        <p><strong>Business:</strong> {profile?.business_name || '—'}</p>
        <p><strong>Goal:</strong> {profile?.goal || '—'}</p>
        <p><strong>Experience:</strong> {profile?.experience_level || '—'}</p>
      </div>
    </div>
  )
}