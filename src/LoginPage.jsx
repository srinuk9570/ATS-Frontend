import { useState, useEffect } from 'react'

const API = 'http://localhost:5000/api/auth'

export default function LoginPage({ onLogin, onSignUp }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== 'http://localhost:5000') return
      if (e.data?.token && e.data?.user) {
        localStorage.setItem('ats_token', e.data.token)
        onLogin({ user: e.data.user })
      } else if (e.data?.error) {
        setError(e.data.error)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onLogin])

  const handleLogin = async () => {
    setError('')
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!password || password.length < 6)      { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const res  = await fetch(`${API}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid email or password.')
      localStorage.setItem('ats_token', data.token)
      onLogin({ user: data.user })
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const openOAuth = (provider) => {
    const w = 500, h = 600
    const l = window.screenX + (window.outerWidth  - w) / 2
    const t = window.screenY + (window.outerHeight - h) / 2
    window.open(`${API}/${provider}`, `${provider}_oauth`, `width=${w},height=${h},left=${l},top=${t}`)
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#F8FAFC' }}>

      {/* ── Left panel ── */}
      <div style={{
        width:420, flexShrink:0, background:'linear-gradient(160deg,#4F46E5 0%,#7C3AED 100%)',
        padding:'48px 44px', display:'flex', flexDirection:'column',
        position:'relative', overflow:'hidden',
      }}>
        {/* BG circles */}
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:52 }}>
          <div style={{ width:36, height:36, background:'rgba(255,255,255,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>A</div>
          <span style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>ATS Intelligence</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize:36, fontWeight:800, color:'#fff', lineHeight:1.2, letterSpacing:'-1px', marginBottom:12 }}>
          AI-Powered<br />Resume<br /><span style={{ color:'#C7D2FE' }}>Intelligence</span>
        </div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:40 }}>
          Beat ATS filters. Land more interviews.<br />Powered by real-time AI analysis.
        </div>

        {/* Score preview cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:36 }}>
          {[
            { label:'ATS Score',     value:'87%',         color:'#34D399', bar:87 },
            { label:'Keyword Match', value:'92%',         color:'#FCD34D', bar:92 },
            { label:'Skills Found',  value:'14',          color:'#A78BFA', bar:70 },
            { label:'Missing',       value:'React, Docker',color:'#FCA5A5', bar:0  },
          ].map(c => (
            <div key={c.label} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'14px 16px', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{c.label}</div>
              <div style={{ fontSize: c.bar===0?14:24, fontWeight:800, color:c.color, lineHeight:1, letterSpacing:'-0.5px' }}>{c.value}</div>
              {c.bar>0 && (
                <div style={{ height:3, background:'rgba(255,255,255,0.15)', borderRadius:10, marginTop:8, overflow:'hidden' }}>
                  <div style={{ width:`${c.bar}%`, height:'100%', background:c.color, borderRadius:10 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:'auto' }}>
          {['Real-time ATS Score Analysis','AI Keyword Optimization','Smart Job Description Matching','Resume Strength Scoring','Instant AI Feedback'].map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.65)' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#C7D2FE', flexShrink:0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', marginBottom:6, letterSpacing:'-0.5px' }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'#64748B', marginBottom:28 }}>
            Don't have an account?{' '}
            <button onClick={onSignUp} style={{ background:'none', border:'none', color:'#4F46E5', fontWeight:600, cursor:'pointer', fontSize:14, padding:0 }}>Sign up</button>
          </p>

          {/* Social buttons */}
          {[
            { provider:'google',   icon:<GoogleIcon />,   label:'Continue with Google'   },
          ].map(s => (
            <button key={s.provider} onClick={() => openOAuth(s.provider)}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, background:'#fff', color:'#0F172A', fontSize:14, fontWeight:500, cursor:'pointer', marginBottom:10, transition:'all .15s', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#C7D2FE'; e.currentTarget.style.background='#F8FAFC' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.background='#fff' }}>
              {s.icon} {s.label}
            </button>
          ))}

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'18px 0', color:'#CBD5E1', fontSize:12 }}>
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
            or continue with email
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Email address</label>
            <input type="email" placeholder="you@email.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} autoComplete="email"
              style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:'#0F172A', background:'#fff', outline:'none', boxSizing:'border-box', transition:'border-color .15s' }}
              onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
          </div>

          {/* Password */}
          <div style={{ marginBottom:8 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} autoComplete="current-password"
                style={{ width:'100%', padding:'11px 44px 11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:'#0F172A', background:'#fff', outline:'none', boxSizing:'border-box', transition:'border-color .15s' }}
                onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              <button onClick={() => setShowPw(p => !p)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex', alignItems:'center' }}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign:'right', marginBottom:20 }}>
            <button style={{ background:'none', border:'none', color:'#4F46E5', fontSize:13, cursor:'pointer', fontWeight:500 }}>Forgot password?</button>
          </div>

          {/* Login btn */}
          <button onClick={handleLogin} disabled={loading}
            style={{ width:'100%', padding:'13px', background:loading?'#94A3B8':'#4F46E5', color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:loading?'not-allowed':'pointer', transition:'all .15s', boxShadow:loading?'none':'0 4px 14px rgba(79,70,229,0.35)', marginBottom:20 }}
            onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.background='#4338CA'; e.currentTarget.style.transform='translateY(-1px)' }}}
            onMouseLeave={e=>{ e.currentTarget.style.background=loading?'#94A3B8':'#4F46E5'; e.currentTarget.style.transform='translateY(0)' }}>
            {loading ? 'Logging in…' : 'Log in →'}
          </button>

          {/* Backend status */}
          <ApiStatus />
        </div>
      </div>
    </div>
  )
}

function ApiStatus() {
  const [status, setStatus] = useState('checking')
  const check = () => {
    setStatus('checking')
    fetch('http://localhost:5000/api/health', { signal: AbortSignal.timeout(3000) })
      .then(r => setStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'))
  }
  useEffect(() => { check() }, [])
  const cfg = {
    checking: { bg:'#FEF3C7', border:'#FDE68A', color:'#92400E', dot:'#F59E0B', label:'Checking backend…' },
    online:   { bg:'#D1FAE5', border:'#6EE7B7', color:'#065F46', dot:'#059669', label:'Backend connected ✓' },
    offline:  { bg:'#FEE2E2', border:'#FECACA', color:'#991B1B', dot:'#DC2626', label:'Backend offline — run: node server.js' },
  }[status]
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:10, fontSize:12, color:cfg.color, fontWeight:600 }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:cfg.dot, flexShrink:0 }} />
      {cfg.label}
      {status==='offline' && <button onClick={check} style={{ marginLeft:'auto', border:'none', background:'none', color:cfg.color, cursor:'pointer', fontSize:11, fontWeight:700 }}>Retry ↺</button>}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}