import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ArrowRight, Boxes, Check, CircleAlert, ClipboardList, KeyRound, LayoutDashboard, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { hasSupabaseConfig, supabase } from './lib/supabase'

const workflows = [
  { title: 'Outward Courier', count: '7 stages', icon: Truck, stages: ['Request', 'Assign', 'Prepare', 'Dispatch Planning', 'Pick Up', 'Tracking', 'Acknowledgement'] },
  { title: 'Inward Tracking', count: '3 stages', icon: PackageCheck, stages: ['Docket Received', 'Track Shipment', 'Hand Over Material'] },
]

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, value) => setSession(value))
    return () => subscription.unsubscribe()
  }, [])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (authError) setError('Sign in failed. Check your credentials or contact your administrator.')
  }

  async function resetPassword() {
    if (!supabase || !email) { setError('Enter your email address first.'); return }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
    setError(resetError ? 'Could not send the reset email. Please try again.' : 'Password reset email sent.')
  }

  if (!hasSupabaseConfig) return <SetupScreen />
  if (loading) return <main className="loading-screen"><span className="spinner" />Restoring your session…</main>
  if (!session) return <LoginScreen email={email} password={password} setEmail={setEmail} setPassword={setPassword} onSubmit={signIn} onReset={resetPassword} busy={busy} error={error} />
  return <WorkspaceScreen email={session.user.email ?? 'Signed in'} onSignOut={() => void supabase?.auth.signOut()} />
}

function SetupScreen() {
  return <main className="setup-wrap">
    <header className="brand-row"><div className="brand-icon"><Boxes size={21} /></div><div><b>Courier FMS</b><small>FLOW MANAGEMENT SYSTEM</small></div><span className="environment-pill"><span /> Setup required</span></header>
    <section className="setup-hero">
      <div className="eyebrow"><span className="eyebrow-mark" /> IMPLEMENTATION WORKSPACE</div>
      <h1>Your courier workflows,<br /><span>ready for the next step.</span></h1>
      <p className="hero-copy">The application foundation is in place. Connect the existing Supabase project and share its schema map so the workflows can be wired to your real data and permissions.</p>
      <div className="notice"><CircleAlert size={18} /><div><strong>Backend connection is not configured</strong><p>No Supabase URL, public anon key, or schema export was found in this workspace. No sample records are shown.</p></div></div>
      <div className="workflow-grid">{workflows.map(({ title, count, icon: Icon, stages }) => <article className="workflow-card" key={title}>
        <div className="workflow-top"><div className="workflow-icon"><Icon size={19} /></div><span>{count}</span></div>
        <h2>{title}</h2><div className="stage-list">{stages.map((stage, i) => <div className="stage" key={stage}><span className={i === 0 ? 'stage-dot current' : 'stage-dot'}>{i === 0 ? <Check size={10} /> : null}</span><span>{stage}</span>{i < stages.length - 1 && <i />}</div>)}</div>
      </article>)}</div>
      <div className="next-step"><div className="next-icon"><KeyRound size={18} /></div><div><strong>Connect the existing Supabase project</strong><p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to a local <code>.env</code>, then provide the current schema types and RLS policies.</p></div><ArrowRight className="next-arrow" size={19} /></div>
    </section>
    <footer className="page-footer"><span>SECURE BY DESIGN <ShieldCheck size={14} /></span><span>INDIA · ASIA/KOLKATA</span></footer>
  </main>
}

function LoginScreen({ email, password, setEmail, setPassword, onSubmit, onReset, busy, error }: {
  email: string; password: string; setEmail: (value: string) => void; setPassword: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void; onReset: () => void; busy: boolean; error: string
}) {
  return <main className="login-layout"><section className="login-brand"><div className="brand-row"><div className="brand-icon"><Boxes size={21} /></div><div><b>Courier FMS</b><small>FLOW MANAGEMENT SYSTEM</small></div></div><div className="login-brand-copy"><span>ONE FLOW, FULL VISIBILITY</span><h1>Every dispatch.<br />Every handover.<br /><em>One clear view.</em></h1><p>Manage your courier operations from the first request through final acknowledgement.</p></div><span className="login-footer">OPERATIONS · TRACKING · CONTROL</span></section>
    <section className="login-panel"><form onSubmit={onSubmit} className="login-form"><div className="form-symbol"><LayoutDashboard size={20} /></div><p className="eyebrow">YOUR WORKSPACE</p><h2>Welcome back</h2><p className="login-intro">Sign in to continue to your operations.</p><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" /></label>{error && <div className="form-message">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}<ArrowRight size={16} /></button><button type="button" className="text-button" onClick={onReset}>Forgot password?</button><div className="login-security"><ShieldCheck size={15} /> Protected with Supabase authentication</div></form></section></main>
}

function WorkspaceScreen({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return <main className="workspace-blocked"><div className="blocked-card"><div className="brand-icon"><ClipboardList size={21} /></div><p className="eyebrow">SIGNED IN AS {email.toUpperCase()}</p><h1>Schema map needed</h1><p>Authentication is connected. The application needs the existing database types and workflow configuration before it can safely load records or permissions.</p><button className="text-button" onClick={onSignOut}>Sign out</button></div></main>
}
