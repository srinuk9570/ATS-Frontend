import { useState, useEffect, useRef } from "react";

/* ── Fonts ── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'DM Sans',sans-serif;background:#fff;color:#0f172a;overflow-x:hidden}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .fade-up{animation:fadeUp .65s cubic-bezier(.22,1,.36,1) both}
    .d1{animation-delay:.05s}.d2{animation-delay:.15s}.d3{animation-delay:.25s}.d4{animation-delay:.35s}.d5{animation-delay:.45s}
    ::selection{background:#4f46e5;color:#fff}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#f1f5f9}
    ::-webkit-scrollbar-thumb{background:#6366f1;border-radius:10px}
    .nav-link{font-size:14px;color:#64748b;text-decoration:none;font-weight:500;transition:color .15s;cursor:pointer;background:none;border:none;font-family:inherit;padding:0}
    .nav-link:hover{color:#0f172a}
    .card-hover{transition:transform .2s,box-shadow .2s,border-color .2s}
    .card-hover:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.1)}
  `}</style>
);

const C = {
  ink:    '#0a0f1e',
  navy:   '#0f172a',
  slate:  '#1e293b',
  muted:  '#64748b',
  subtle: '#94a3b8',
  border: '#e2e8f0',
  bg:     '#f8fafc',
  white:  '#ffffff',
  indigo: '#4f46e5',
  violet: '#7c3aed',
  emerald:'#059669',
  amber:  '#d97706',
  rose:   '#e11d48',
  sky:    '#0284c7',
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function App() {
  const [page, setPage] = useState('landing'); // 'landing' | 'checker' | 'dashboard'
  return (
    <>
      <FontLink />
      {page === 'landing' && <LandingPage onGetStarted={() => setPage('checker')} onDashboard={() => setPage('dashboard')} />}
      {page === 'checker' && <ATSCheckerPage onBack={() => setPage('landing')} onDashboard={() => setPage('dashboard')} />}
      {page === 'dashboard' && <DashboardPage onBack={() => setPage('landing')} onChecker={() => setPage('checker')} />}
    </>
  );
}

/* ══════════════════════════════════
   LANDING PAGE
══════════════════════════════════ */
function LandingPage({ onGetStarted, onDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color: C.navy, background: '#fff', overflowX:'hidden' }}>
      <Nav scrolled={scrolled} onGetStarted={onGetStarted} onDashboard={onDashboard} />
      <Hero onGetStarted={onGetStarted} />
      <LogoBar />
      <HowItWorks />
      <KeywordSection />
      <ScoreSection />
      <FeaturesGrid onDashboard={onDashboard} />
      <Testimonials />
      <PricingSection onGetStarted={onGetStarted} />
      <BlogSection />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

/* ── NAV ── */
function Nav({ scrolled, onGetStarted, onDashboard }) {
  const navItems = [
    { label: 'Features',     id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing',      id: 'pricing' },
    { label: 'Blog',         id: 'blog' },
  ];

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
      transition:'all .3s ease',
      padding:'0 40px',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', height:68, gap:40 }}>
        <div onClick={() => scrollTo('hero')} style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, cursor:'pointer' }}>
          <div style={{ width:34, height:34, background:`linear-gradient(135deg,${C.indigo},${C.violet})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, color:'#fff', fontSize:15 }}>A</div>
          <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:17, color:C.navy, letterSpacing:'-0.3px' }}>ATS<span style={{ color:C.indigo }}> Intelligence</span></span>
        </div>

        <nav style={{ display:'flex', gap:28, flex:1, justifyContent:'center' }}>
          {navItems.map(({ label, id }) => (
            <button key={label} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <button className="nav-link" onClick={onDashboard}>Dashboard</button>
        </nav>

        <div style={{ display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button onClick={onGetStarted} style={{ padding:'8px 18px', background:'transparent', border:'none', fontSize:14, fontWeight:500, color:C.navy, cursor:'pointer' }}>Log in</button>
          <button onClick={onGetStarted}
            style={{ padding:'9px 22px', background:C.indigo, color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', transition:'background .15s, transform .1s', boxShadow:`0 2px 12px ${C.indigo}40` }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#4338ca'; e.currentTarget.style.transform='translateY(-1px)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background=C.indigo; e.currentTarget.style.transform='translateY(0)' }}>
            Get Started Free
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── HERO ── */
function Hero({ onGetStarted }) {
  return (
    <section id="hero" style={{ paddingTop:140, paddingBottom:100, paddingLeft:40, paddingRight:40, background:'linear-gradient(160deg,#fafbff 0%,#f0f0ff 40%,#fff 100%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-120, right:-120, width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle,${C.indigo}12,transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:350, height:350, borderRadius:'50%', background:`radial-gradient(circle,${C.violet}08,transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
        <div>
          <div className="fade-up d1" style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${C.indigo}10`, border:`1px solid ${C.indigo}30`, borderRadius:100, padding:'5px 14px', fontSize:12, fontWeight:600, color:C.indigo, marginBottom:20 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.indigo, animation:'pulse 1.5s infinite' }} />
            AI-Powered Resume Analysis
          </div>
          <h1 className="fade-up d2" style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:54, fontWeight:800, lineHeight:1.08, letterSpacing:'-2px', color:C.navy, marginBottom:22 }}>
            Resume & Job<br /><span style={{ color:C.indigo }}>Description</span><br />Matching Tool
          </h1>
          <p className="fade-up d3" style={{ fontSize:17, color:C.muted, lineHeight:1.7, maxWidth:440, marginBottom:32 }}>
            Upload your resume, paste the JD, and let our AI help you pass ATS screening and catch recruiters' attention with a perfect keyword match.
          </p>
          <div className="fade-up d4" style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40 }}>
            <button onClick={onGetStarted}
              style={{ padding:'14px 32px', background:C.indigo, color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer', boxShadow:`0 4px 20px ${C.indigo}45`, transition:'all .15s', fontFamily:"'Bricolage Grotesque',sans-serif" }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#4338ca'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.background=C.indigo; e.currentTarget.style.transform='translateY(0)' }}>
              Match Resume with JD Now →
            </button>
            <button onClick={onGetStarted}
              style={{ padding:'14px 24px', background:'transparent', border:`1.5px solid ${C.border}`, color:C.navy, borderRadius:10, fontSize:15, fontWeight:500, cursor:'pointer', transition:'all .15s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.indigo; e.currentTarget.style.color=C.indigo }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.navy }}>
              View Sample Report
            </button>
          </div>
          <div className="fade-up d5" style={{ display:'flex', gap:28 }}>
            {[['10K+','Resumes Analyzed'],['94%','ATS Pass Rate'],['Free','To Get Started']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:22, fontWeight:800, color:C.navy }}>{n}</div>
                <div style={{ fontSize:12, color:C.muted, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up d3" style={{ animation:'float 4s ease-in-out infinite' }}>
          <DemoCard />
        </div>
      </div>
    </section>
  );
}

function DemoCard() {
  const [activeTab, setActiveTab] = useState(2);
  const matched = ['ReactJS','Java Spring Boot','PostgreSQL','Agile methodologies','CI/CD pipelines','Mentorship'];
  const missing = ['SDLC','Test automation','Troubleshooting','Container-based environment'];
  const tabs = ['Resume Sections','Improve Resume','ATS Checker'];

  return (
    <div style={{ background:'#fff', borderRadius:18, boxShadow:'0 24px 80px rgba(0,0,0,0.12)', overflow:'hidden', border:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, padding:'0 20px' }}>
        {tabs.map((t,i) => (
          <div key={t} onClick={() => setActiveTab(i)} style={{ padding:'14px 16px', fontSize:12, fontWeight:600, color:i===activeTab?C.indigo:C.muted, borderBottom:i===activeTab?`2px solid ${C.indigo}`:'2px solid transparent', cursor:'pointer', transition:'color .15s' }}>{t}</div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, padding:'12px 20px', borderBottom:`1px solid ${C.border}` }}>
        {['Add Job Descriptions','Rerun ATS checks'].map(b => (
          <button key={b} style={{ padding:'7px 14px', background:'#f1f5f9', border:'none', borderRadius:7, fontSize:11, fontWeight:600, color:C.slate, cursor:'pointer' }}>{b}</button>
        ))}
      </div>
      <div style={{ margin:'16px 20px', background:C.emerald, borderRadius:8, padding:'12px 20px', textAlign:'center' }}>
        <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>74% Match</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, padding:'0 20px 20px' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.navy, marginBottom:8 }}>Matched Keywords</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {matched.map(k => <span key={k} style={{ padding:'4px 10px', background:'#d1fae5', color:'#065f46', borderRadius:20, fontSize:10, fontWeight:600 }}>{k}</span>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.navy, marginBottom:8 }}>Unmatched Keywords</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {missing.map(k => <span key={k} style={{ padding:'4px 10px', background:'#fef3c7', color:'#92400e', borderRadius:20, fontSize:10, fontWeight:600 }}>{k}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LOGO BAR ── */
function LogoBar() {
  const companies = ['Google','Microsoft','Amazon','Meta','Netflix','Stripe','Figma','Notion'];
  return (
    <div style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'28px 40px', background:'#fafbff' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <p style={{ textAlign:'center', fontSize:12, fontWeight:600, color:C.subtle, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:20 }}>Used by professionals targeting roles at</p>
        <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', alignItems:'center' }}>
          {companies.map(c => <span key={c} style={{ fontSize:14, fontWeight:700, color:'#cbd5e1', letterSpacing:'-0.3px', fontFamily:"'Bricolage Grotesque',sans-serif" }}>{c}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── HOW IT WORKS ── */
function HowItWorks() {
  const steps = [
    { n:'01', icon:'📄', title:'Upload Your Resume', desc:'Upload PDF, DOCX, or paste your resume text. Our AI parses every section instantly.', color: C.indigo },
    { n:'02', icon:'💼', title:'Paste Job Description', desc:'Add the JD from any job posting. Our AI extracts required skills, keywords, and priorities.', color: C.violet },
    { n:'03', icon:'⚡', title:'Get Your Match Score', desc:'Instantly see your ATS compatibility score, matched keywords, gaps, and what to fix.', color: C.emerald },
    { n:'04', icon:'✨', title:'Optimize & Apply', desc:'Use AI suggestions to add missing keywords naturally, then apply with confidence.', color: C.sky },
  ];

  return (
    <section id="how-it-works" style={{ padding:'100px 40px', background:'#fff' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.indigo, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, letterSpacing:'-1.5px', color:C.navy, marginBottom:14 }}>
            From upload to interview-ready<br />in under 2 minutes
          </h2>
          <p style={{ fontSize:16, color:C.muted, maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>No guessing. No templates. Just precise AI analysis that tells you exactly what your resume needs.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, position:'relative' }}>
          <div style={{ position:'absolute', top:28, left:'12.5%', right:'12.5%', height:1, background:`linear-gradient(90deg,${C.indigo}30,${C.indigo},${C.indigo}30)`, zIndex:0 }} />
          {steps.map((s) => (
            <div key={s.n} className="card-hover" style={{ background:'#fff', borderRadius:16, padding:'28px 24px', border:`1px solid ${C.border}`, position:'relative', zIndex:1 }}>
              <div style={{ width:48, height:48, background:s.color, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontSize:10, fontWeight:800, color:C.subtle, letterSpacing:'1px', marginBottom:6 }}>STEP {s.n}</div>
              <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:C.navy, marginBottom:8 }}>{s.title}</div>
              <div style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── KEYWORD SECTION ── */
function KeywordSection() {
  const unmatched = ['Product Strategy','Customer Focus','Threat Modeling','Go-to-market','OKR Planning'];
  const matched   = ['Product Management','Cybersecurity','Cross-functional teams','Stakeholder Management','Data Analysis','Vulnerability Management','Agile','Collaboration'];
  return (
    <section style={{ padding:'100px 40px', background:'linear-gradient(160deg,#fafbff,#f0f0ff 50%,#fafbff)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:C.indigo, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>KEYWORD INTELLIGENCE</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:44, fontWeight:800, letterSpacing:'-1.5px', color:C.navy, marginBottom:20, lineHeight:1.1 }}>
            Identify Keywords<br />from Job Description
          </h2>
          <p style={{ fontSize:15, color:C.muted, marginBottom:28, lineHeight:1.7 }}>Add target Job Descriptions to find exactly what your resume needs:</p>
          {[
            { c:C.indigo, t:'Essential skills your resume must have' },
            { c:C.violet, t:'Desirable skills that help you stand out' },
            { c:C.emerald, t:'Know what hiring managers are expecting' },
          ].map(f => (
            <div key={f.t} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:f.c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, flexShrink:0 }}>→</div>
              <span style={{ fontSize:15, color:C.slate, fontWeight:500 }}>{f.t}</span>
            </div>
          ))}
        </div>
        <div style={{ position:'relative', height:380 }}>
          <div style={{ position:'absolute', top:0, left:0, width:260, background:'#fff', borderRadius:16, boxShadow:'0 12px 40px rgba(0,0,0,0.1)', border:`1px solid ${C.border}`, padding:20, zIndex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.navy, marginBottom:12 }}>Unmatched Keywords</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {unmatched.map(k => (
                <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ padding:'6px 14px', background:'#f1f5f9', color:C.slate, borderRadius:20, fontSize:12, fontWeight:600 }}>{k}</span>
                  <div style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:C.muted, cursor:'pointer' }}>+</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:'absolute', bottom:0, right:0, width:280, background:'#fff', borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,0.14)', border:`1px solid ${C.border}`, padding:20, zIndex:2 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.navy, marginBottom:12 }}>Matched Keywords</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {matched.map((k,i) => (
                <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ padding:'6px 14px', background: i%3===0?'#d1fae5':i%3===1?'#ddd6fe':'#fde68a', color: i%3===0?'#065f46':i%3===1?'#4c1d95':'#78350f', borderRadius:20, fontSize:12, fontWeight:600 }}>{k}</span>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:C.border, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:C.muted }}>✓</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:'absolute', top:'15%', right:'-5%', width:'65%', height:'75%', background:`linear-gradient(135deg,${C.indigo},${C.violet})`, borderRadius:16, zIndex:0, opacity:0.12 }} />
        </div>
      </div>
    </section>
  );
}

/* ── SCORE SECTION ── */
function ScoreSection() {
  return (
    <section style={{ padding:'100px 40px', background:'#fff' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, letterSpacing:'-1.5px', color:C.navy, marginBottom:14 }}>
            Match resumes to real job<br />descriptions fast
          </h2>
          <p style={{ fontSize:15, color:C.muted, maxWidth:440, margin:'0 auto' }}>Drop in any JD and instantly find out if your resume says what it needs to.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {/* Gauge card */}
          <div className="card-hover" style={{ background:'#fff', border:`1.5px solid ${C.border}`, borderRadius:20, padding:32 }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:C.navy, marginBottom:24, lineHeight:1.3 }}>Compare your resume to a job description in seconds</h3>
            <GaugeChart score={70} />
            <div style={{ marginTop:20, fontSize:13, color:C.muted, lineHeight:1.7 }}>Drop in any job description and instantly find out if your resume says what it needs to. You'll know what's aligned, what's missing, and what to adjust before you apply.</div>
          </div>
          {/* Highlight card */}
          <div className="card-hover" style={{ background:'#fff', border:`1.5px solid ${C.border}`, borderRadius:20, padding:32 }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:C.navy, marginBottom:24, lineHeight:1.3 }}>Highlight the right words</h3>
            <div style={{ background:'#f8fafc', borderRadius:12, overflow:'hidden', border:`1px solid ${C.border}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', padding:'10px 14px', borderBottom:`1px solid ${C.border}` }}>
                {['Hard Skills','Status','Highlight'].map(h => <span key={h} style={{ fontSize:11, fontWeight:700, color:C.muted }}>{h}</span>)}
              </div>
              {[['CRM',true,false],['Retention',false,true],['Stakeholder Mgmt',true,true],['Data Analysis',true,false]].map(([k,s,h]) => (
                <div key={k} style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', padding:'10px 14px', borderBottom:`1px solid ${C.border}`, alignItems:'center' }}>
                  <span style={{ fontSize:12, color:C.slate }}>{k}</span>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:s?C.emerald:C.border, display:'flex', alignItems:'center', justifyContent:'center' }}>{s && <span style={{ color:'#fff', fontSize:10 }}>✓</span>}</div>
                  <div style={{ width:30, height:16, borderRadius:100, background:h?C.indigo:C.border, position:'relative', cursor:'pointer' }}>
                    <div style={{ position:'absolute', top:2, left:h?14:2, width:12, height:12, borderRadius:'50%', background:'#fff', transition:'left .2s' }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop:16, fontSize:13, color:C.muted, lineHeight:1.7 }}>Find the keywords hiring teams actually look for so you can reflect them naturally.</p>
          </div>
          {/* Customize card */}
          <div className="card-hover" style={{ background:'#fff', border:`1.5px solid ${C.border}`, borderRadius:20, padding:32 }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:C.navy, marginBottom:24, lineHeight:1.3 }}>Customize your resume with purpose</h3>
            <div style={{ background:'#f8fafc', borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.navy, marginBottom:10 }}>Job Description</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                {[['Hard Skills','#d1fae5','#065f46'],['Soft Skills','#ede9fe','#4c1d95'],['Other','#fef3c7','#92400e']].map(([l,bg,c]) => (
                  <span key={l} style={{ padding:'3px 10px', background:bg, color:c, borderRadius:20, fontSize:10, fontWeight:600 }}>{l}</span>
                ))}
              </div>
              <div style={{ lineHeight:2.2, fontSize:13, color:C.slate }}>
                ...requires strong <span style={{ background:'#ede9fe', color:'#4c1d95', padding:'2px 6px', borderRadius:4, fontWeight:600 }}>strategy</span> and <span style={{ background:'#d1fae5', color:'#065f46', padding:'2px 6px', borderRadius:4, fontWeight:600 }}>actionable</span> <span style={{ background:'#fef3c7', color:'#92400e', padding:'2px 6px', borderRadius:4, fontWeight:600 }}>knowledge</span> to address <span style={{ background:'#fee2e2', color:'#991b1b', padding:'2px 6px', borderRadius:4, fontWeight:600 }}>challenges</span>...
              </div>
            </div>
            <p style={{ marginTop:16, fontSize:13, color:C.muted, lineHeight:1.7 }}>Tailor your bullets, summary, and skills for what the role actually asks for.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GaugeChart({ score }) {
  const r = 60, circ = Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <svg width={160} height={90} viewBox="0 0 160 90">
        <path d="M 14 80 A 66 66 0 0 1 146 80" fill="none" stroke="#f1f5f9" strokeWidth={12} strokeLinecap="round" />
        <path d="M 14 80 A 66 66 0 0 1 146 80" fill="none" stroke={score>=80?C.emerald:score>=60?C.amber:C.rose} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${fill} ${circ}`} />
        <text x="80" y="70" textAnchor="middle" style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:26, fontWeight:800, fill:C.navy }}>{score}%</text>
        <text x="80" y="84" textAnchor="middle" style={{ fontSize:10, fontWeight:600, fill:C.muted }}>Good Match Score</text>
      </svg>
      <div style={{ display:'flex', gap:6, marginTop:8 }}>
        {[['Poor','#ef4444'],['Fair','#f59e0b'],['Good','#10b981'],['Great','#6366f1']].map(([l,c]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:c }} />
            <span style={{ fontSize:10, color:C.muted }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FEATURES GRID ── */
function FeaturesGrid({ onDashboard }) {
  const features = [
    { icon:'🚀', title:'ATS Score Analysis',       desc:'Instant compatibility score with detailed breakdown across keywords, length, sections, and metrics.' },
    { icon:'🔍', title:'Keyword Gap Detection',    desc:'Side-by-side comparison of your resume vs JD, with exact placement suggestions for every missing keyword.' },
    { icon:'✏️', title:'AI Bullet Rewriter',       desc:'Transform weak, passive bullets into powerful, metric-driven achievements with one click.' },
    { icon:'📄', title:'Resume Generator',         desc:'Generate a fully tailored, ATS-optimized resume from your background and the target JD.' },
    { icon:'🎯', title:'Section Coverage',         desc:'Checks that all critical sections (Summary, Experience, Skills, Projects) are present and substantial.' },
    { icon:'📊', title:'Recruitment Dashboard',   desc:'Track all your applications, match scores, and job pipeline in one beautiful dashboard.', action: onDashboard },
  ];

  return (
    <section id="features" style={{ padding:'100px 40px', background:C.bg }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.indigo, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>FEATURES</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, letterSpacing:'-1.5px', color:C.navy, marginBottom:14 }}>
            Everything you need to land<br />more interviews
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {features.map((f) => (
            <div key={f.title} onClick={f.action} className="card-hover" style={{ background:'#fff', borderRadius:16, padding:28, border:`1px solid ${C.border}`, cursor:f.action?'pointer':'default', position:'relative', overflow:'hidden' }}>
              {f.action && <div style={{ position:'absolute', top:12, right:12, background:`${C.indigo}15`, color:C.indigo, fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>Try it →</div>}
              <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
              <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:C.navy, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
function Testimonials() {
  const testimonials = [
    { name:'Priya Sharma',  role:'SDE at Amazon',       text:'Got 3x more callbacks after using this. The keyword gap tool showed me exactly what I was missing for each role. Game changer.', avatar:'PS', color:'#4f46e5' },
    { name:'Rahul Verma',   role:'PM at Flipkart',      text:'I went from 0 replies to 4 interviews in 2 weeks. The ATS score told me my resume was being filtered out before any human saw it.', avatar:'RV', color:'#059669' },
    { name:'Anjali Reddy',  role:'Data Analyst at TCS', text:'The AI suggestions are incredibly specific. Not generic advice — it tells you exactly which bullets to rewrite and what words to add.', avatar:'AR', color:'#d97706' },
    { name:'Kiran Patel',   role:'DevOps at Infosys',   text:'Used this before applying to 10 companies. Got calls from 7. The match score helps you prioritize which jobs are actually worth applying to.', avatar:'KP', color:'#7c3aed' },
  ];
  return (
    <section style={{ padding:'100px 40px', background:'#fff' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.indigo, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>TESTIMONIALS</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, letterSpacing:'-1.5px', color:C.navy }}>Land a job faster</h2>
          <p style={{ fontSize:15, color:C.muted, marginTop:12 }}>Join thousands of professionals who optimized their way to more interviews.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
          {testimonials.map(t => (
            <div key={t.name} style={{ background:C.bg, borderRadius:16, padding:28, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:32, color:t.color, marginBottom:14, lineHeight:1 }}>"</div>
              <p style={{ fontSize:14, color:C.slate, lineHeight:1.75, marginBottom:20 }}>{t.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:t.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>{t.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{t.role}</div>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', gap:2 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color:'#fbbf24', fontSize:14 }}>★</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRICING ── */
function PricingSection({ onGetStarted }) {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name:'Free', price:0,  period:'forever', color:C.muted, features:['5 resume scans/month','Basic keyword matching','ATS score report','PDF upload support'], cta:'Get Started Free', highlight:false },
    { name:'Pro',  price:annual?9:12, period:'mo', color:C.indigo, features:['Unlimited resume scans','Advanced keyword intelligence','AI bullet rewriter','Resume generator','Priority support','Recruitment dashboard'], cta:'Start Pro Free', highlight:true },
    { name:'Team', price:annual?29:39, period:'mo', color:C.violet, features:['Everything in Pro','5 team seats','Bulk resume analysis','API access','Custom integrations','Dedicated account manager'], cta:'Contact Sales', highlight:false },
  ];

  return (
    <section id="pricing" style={{ padding:'100px 40px', background:C.bg }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.indigo, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>PRICING</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, letterSpacing:'-1.5px', color:C.navy, marginBottom:20 }}>Simple, transparent pricing</h2>
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, background:'#fff', border:`1px solid ${C.border}`, borderRadius:100, padding:'6px 6px 6px 16px' }}>
            <span style={{ fontSize:13, fontWeight:500, color:C.muted }}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} style={{ width:44, height:24, borderRadius:100, background:annual?C.indigo:C.border, cursor:'pointer', position:'relative', transition:'background .2s' }}>
              <div style={{ position:'absolute', top:3, left:annual?22:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,0.15)' }} />
            </div>
            <span style={{ fontSize:13, fontWeight:500, color:annual?C.indigo:C.muted }}>Annual</span>
            {annual && <span style={{ background:'#d1fae5', color:'#065f46', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100 }}>Save 25%</span>}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background:'#fff', borderRadius:20, padding:32, border:p.highlight?`2px solid ${C.indigo}`:`1px solid ${C.border}`, position:'relative', boxShadow:p.highlight?`0 20px 60px ${C.indigo}20`:'none' }}>
              {p.highlight && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:C.indigo, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 16px', borderRadius:100 }}>Most Popular</div>}
              <div style={{ fontSize:12, fontWeight:700, color:p.color, letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>{p.name}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, color:C.navy }}>{p.price===0?'Free':`$${p.price}`}</span>
                {p.price>0 && <span style={{ fontSize:14, color:C.muted }}>/{p.period}</span>}
              </div>
              <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>{p.price===0?'Perfect for occasional use':'Everything you need to land interviews'}</p>
              <button onClick={onGetStarted} style={{ width:'100%', padding:'12px', background:p.highlight?C.indigo:'transparent', color:p.highlight?'#fff':C.indigo, border:`1.5px solid ${p.highlight?C.indigo:C.indigo}`, borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:24, transition:'all .15s', fontFamily:"'DM Sans',sans-serif" }}
                onMouseEnter={e=>{ if(!p.highlight){e.currentTarget.style.background=`${C.indigo}10`} }}
                onMouseLeave={e=>{ if(!p.highlight){e.currentTarget.style.background='transparent'} }}>
                {p.cta}
              </button>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:`${C.emerald}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:C.emerald, fontSize:10 }}>✓</span>
                    </div>
                    <span style={{ fontSize:13, color:C.slate }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── BLOG ── */
function BlogSection() {
  const posts = [
    { tag:'Guide', title:'How ATS Systems Actually Work in 2026', excerpt:'Most candidates misunderstand what ATS systems scan for. Here\'s the definitive breakdown of how modern systems rank resumes.', date:'May 20, 2026', read:'5 min read', color:C.indigo },
    { tag:'Tips', title:'10 Keywords Every Software Engineer Resume Needs', excerpt:'We analyzed 5,000 JDs and found these are the keywords that appear most often — and that most resumes are missing.', date:'May 14, 2026', read:'4 min read', color:C.violet },
    { tag:'Story', title:'From 0 Callbacks to 6 Interviews in 3 Weeks', excerpt:'Priya\'s story: how optimizing her resume with AI changed her job search completely.', date:'May 7, 2026', read:'3 min read', color:C.emerald },
  ];

  return (
    <section id="blog" style={{ padding:'100px 40px', background:'#fff' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.indigo, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>BLOG</div>
            <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:42, fontWeight:800, letterSpacing:'-1.5px', color:C.navy }}>Resume insights & guides</h2>
          </div>
          <button style={{ padding:'10px 22px', border:`1.5px solid ${C.border}`, background:'transparent', borderRadius:10, fontSize:14, fontWeight:500, color:C.navy, cursor:'pointer' }}>View all posts →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {posts.map(p => (
            <div key={p.title} className="card-hover" style={{ background:C.bg, borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}`, cursor:'pointer' }}>
              <div style={{ height:6, background:p.color }} />
              <div style={{ padding:28 }}>
                <div style={{ display:'inline-block', padding:'3px 10px', background:`${p.color}15`, color:p.color, borderRadius:20, fontSize:11, fontWeight:700, marginBottom:14 }}>{p.tag}</div>
                <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:17, fontWeight:700, color:C.navy, marginBottom:10, lineHeight:1.35 }}>{p.title}</h3>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:20 }}>{p.excerpt}</p>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.subtle }}>
                  <span>{p.date}</span>
                  <span>{p.read}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTA({ onGetStarted }) {
  return (
    <section style={{ padding:'100px 40px', background:`linear-gradient(135deg,${C.navy},#1e1b4b)`, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:`${C.indigo}25`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:`${C.violet}20`, pointerEvents:'none' }} />
      <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:48, fontWeight:800, letterSpacing:'-2px', color:'#fff', marginBottom:18, lineHeight:1.1 }}>Pass ATS Screening &<br />Get More Interviews</h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.65)', marginBottom:36, lineHeight:1.7 }}>Don't guess the required keywords. Use AI to know exactly what your resume needs — and add it the right way.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={onGetStarted}
            style={{ padding:'15px 36px', background:'#fbbf24', color:'#1c1917', border:'none', borderRadius:10, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:"'Bricolage Grotesque',sans-serif", transition:'all .15s', boxShadow:'0 4px 20px rgba(251,191,36,.4)' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)'}}>
            Start Analyzing Free →
          </button>
          <button onClick={onGetStarted}
            style={{ padding:'15px 28px', background:'transparent', border:'1.5px solid rgba(255,255,255,0.3)', color:'#fff', borderRadius:10, fontSize:15, fontWeight:500, cursor:'pointer' }}>
            See How It Works
          </button>
        </div>
        <div style={{ marginTop:28, fontSize:12, color:'rgba(255,255,255,0.4)' }}>Free forever · No credit card · 10,000+ resumes analyzed</div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ background:C.navy, padding:'48px 40px 32px', borderTop:`1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
          <div>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:17, color:'#fff', marginBottom:12 }}>ATS<span style={{ color:C.indigo }}> Intelligence</span></div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.7, maxWidth:260 }}>AI-powered resume analysis that helps you pass ATS screening and land more interviews.</p>
          </div>
          {[
            ['Product',['Resume Scanner','ATS Score','AI Writer','Resume Builder']],
            ['Company', ['About','Blog','Careers','Contact']],
            ['Legal',   ['Privacy Policy','Terms of Service','Cookie Policy']],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:14 }}>{title}</div>
              {links.map(l => (
                <a key={l} href="#" style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:8, transition:'color .15s' }}
                  onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.85)'}
                  onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>© 2026 ATS Intelligence. All rights reserved.</span>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Built for job seekers who mean business.</span>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════
   ATS CHECKER PAGE
══════════════════════════════════ */
function ATSCheckerPage({ onBack, onDashboard }) {
  const [step, setStep] = useState(1); // 1=upload, 2=analyze, 3=results
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [activeResultTab, setActiveResultTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sampleResume = `John Doe | Software Engineer
Email: john@email.com | LinkedIn: linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 5 years building scalable web applications using ReactJS, Node.js, and PostgreSQL. Strong background in Agile methodologies and CI/CD pipelines.

EXPERIENCE
Senior Software Engineer — TechCorp (2022–Present)
• Built React dashboards serving 50K+ users
• Led team of 4 engineers using Agile sprint planning
• Deployed microservices via CI/CD pipelines (Jenkins, Docker)
• Mentored 2 junior engineers

Software Engineer — StartupXYZ (2020–2022)
• Developed REST APIs using Java Spring Boot
• Optimized PostgreSQL queries reducing load time by 40%

SKILLS
ReactJS, Node.js, Java Spring Boot, PostgreSQL, Docker, Git, Agile, CI/CD`;

  const sampleJD = `Senior Software Engineer — FinTech Solutions

We are looking for a Senior Software Engineer to join our platform team.

Requirements:
• 4+ years experience with ReactJS and Java Spring Boot
• Strong knowledge of PostgreSQL and database optimization
• Experience with SDLC best practices and test automation
• Familiarity with container-based environments (Docker/K8s)
• Agile/Scrum methodology experience
• Mentorship and leadership capabilities
• Excellent troubleshooting skills
• CI/CD pipeline experience`;

  const handleAnalyze = () => {
    if (!resumeText || !jdText) return;
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setLoading(false); setStep(3); return 100; }
        return p + 4;
      });
    }, 80);
  };

  const matchedKw  = ['ReactJS','Java Spring Boot','PostgreSQL','Agile','CI/CD pipelines','Mentorship','Docker'];
  const missingKw  = ['SDLC','Test automation','Troubleshooting','Container-based environment'];
  const score = 74;

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background:'#fff', borderBottom:`1px solid ${C.border}`, padding:'0 40px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', height:60, gap:20 }}>
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', fontSize:14, color:C.muted, padding:'6px 10px', borderRadius:8, transition:'background .15s' }}
            onMouseEnter={e=>e.currentTarget.style.background=C.bg}
            onMouseLeave={e=>e.currentTarget.style.background='none'}>
            ← Back
          </button>
          <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:16, color:C.navy }}>ATS<span style={{ color:C.indigo }}> Intelligence</span></div>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', gap:8 }}>
            {['Resume Sections','Improve Resume','ATS Checker'].map((t,i) => (
              <button key={t} onClick={() => {}} style={{ padding:'6px 14px', background:i===2?`${C.indigo}10`:'none', color:i===2?C.indigo:C.muted, border:i===2?`1px solid ${C.indigo}30`:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>{t}</button>
            ))}
          </div>
          <button onClick={onDashboard} style={{ padding:'7px 16px', background:C.indigo, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Dashboard →</button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px' }}>
        {step < 3 && (
          <>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:34, fontWeight:800, color:C.navy, marginBottom:8 }}>ATS Checker</h1>
              <p style={{ fontSize:15, color:C.muted }}>Paste your resume and job description to get your match score instantly</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24 }}>
              {/* Resume input */}
              <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden' }}>
                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:15, fontWeight:700, color:C.navy }}>📄 Your Resume</div>
                  <button onClick={() => setResumeText(sampleResume)} style={{ fontSize:12, color:C.indigo, background:'none', border:`1px solid ${C.indigo}30`, borderRadius:6, padding:'4px 10px', cursor:'pointer', fontWeight:600 }}>Use Sample</button>
                </div>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  style={{ width:'100%', height:280, border:'none', outline:'none', padding:20, fontSize:13, color:C.slate, lineHeight:1.7, resize:'none', fontFamily:"'DM Sans',sans-serif", background:'transparent' }}
                />
                {resumeText && <div style={{ padding:'8px 20px', background:'#f0fdf4', borderTop:`1px solid #bbf7d0`, fontSize:12, color:'#166534', fontWeight:600 }}>✓ {resumeText.split(' ').length} words detected</div>}
              </div>

              {/* JD input */}
              <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden' }}>
                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:15, fontWeight:700, color:C.navy }}>💼 Job Description</div>
                  <button onClick={() => setJdText(sampleJD)} style={{ fontSize:12, color:C.indigo, background:'none', border:`1px solid ${C.indigo}30`, borderRadius:6, padding:'4px 10px', cursor:'pointer', fontWeight:600 }}>Use Sample</button>
                </div>
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="Paste job description here..."
                  style={{ width:'100%', height:280, border:'none', outline:'none', padding:20, fontSize:13, color:C.slate, lineHeight:1.7, resize:'none', fontFamily:"'DM Sans',sans-serif", background:'transparent' }}
                />
                {jdText && <div style={{ padding:'8px 20px', background:'#f0fdf4', borderTop:`1px solid #bbf7d0`, fontSize:12, color:'#166534', fontWeight:600 }}>✓ Job description ready</div>}
              </div>
            </div>

            {loading ? (
              <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, padding:32, textAlign:'center' }}>
                <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:C.navy, marginBottom:16 }}>Analyzing your resume…</div>
                <div style={{ background:C.bg, borderRadius:100, height:8, overflow:'hidden', maxWidth:400, margin:'0 auto 12px' }}>
                  <div style={{ height:'100%', background:`linear-gradient(90deg,${C.indigo},${C.violet})`, borderRadius:100, width:`${progress}%`, transition:'width .1s' }} />
                </div>
                <div style={{ fontSize:13, color:C.muted }}>{progress < 30 ? 'Parsing resume sections…' : progress < 60 ? 'Extracting JD keywords…' : progress < 85 ? 'Matching skills & calculating score…' : 'Generating recommendations…'}</div>
              </div>
            ) : (
              <div style={{ display:'flex', justifyContent:'center', gap:12 }}>
                <button onClick={handleAnalyze} disabled={!resumeText || !jdText}
                  style={{ padding:'14px 40px', background:resumeText&&jdText?C.indigo:'#e2e8f0', color:resumeText&&jdText?'#fff':C.subtle, border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:resumeText&&jdText?'pointer':'not-allowed', fontFamily:"'Bricolage Grotesque',sans-serif", transition:'all .15s', boxShadow:resumeText&&jdText?`0 4px 20px ${C.indigo}40`:'none' }}>
                  ⚡ Run ATS Analysis
                </button>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <ATSResults
            score={score} matchedKw={matchedKw} missingKw={missingKw}
            activeTab={activeResultTab} setActiveTab={setActiveResultTab}
            onRerun={() => setStep(1)}
          />
        )}
      </div>
    </div>
  );
}

function ATSResults({ score, matchedKw, missingKw, activeTab, setActiveTab, onRerun }) {
  const scoreColor = score >= 80 ? C.emerald : score >= 60 ? C.amber : C.rose;
  const tabs = ['overview','keywords','sections','suggestions'];

  const sections = [
    { name:'Contact Info',    score:100, status:'great' },
    { name:'Professional Summary', score:85, status:'good' },
    { name:'Work Experience', score:90, status:'great' },
    { name:'Skills',          score:70, status:'fair' },
    { name:'Education',       score:100, status:'great' },
    { name:'Projects',        score:40, status:'poor' },
  ];

  const suggestions = [
    { icon:'💡', priority:'High', title:'Add "SDLC" to your Skills section', detail:'The JD mentions SDLC 3 times. Add it to your skills list and reference it in at least one bullet.' },
    { icon:'🔧', priority:'High', title:'Include test automation experience', detail:'Mention specific tools like Jest, Selenium, or Cypress in your bullet points.' },
    { icon:'📦', priority:'Medium', title:'Add container-based environment keywords', detail:'Add Kubernetes or "container orchestration" to your DevOps experience.' },
    { icon:'🛠', priority:'Medium', title:'Expand troubleshooting examples', detail:'Add 1-2 bullets that describe debugging complex issues with measurable impact.' },
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:30, fontWeight:800, color:C.navy, marginBottom:4 }}>Your ATS Analysis Report</h1>
          <p style={{ fontSize:14, color:C.muted }}>Senior Software Engineer — FinTech Solutions</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onRerun} style={{ padding:'9px 18px', background:'#fff', border:`1px solid ${C.border}`, color:C.navy, borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Rerun Analysis</button>
          <button style={{ padding:'9px 18px', background:C.indigo, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Export PDF</button>
        </div>
      </div>

      {/* Score banner */}
      <div style={{ background:`linear-gradient(135deg,${scoreColor}15,${scoreColor}05)`, border:`2px solid ${scoreColor}30`, borderRadius:20, padding:'28px 40px', marginBottom:28, display:'grid', gridTemplateColumns:'auto 1fr auto auto auto', gap:40, alignItems:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:64, fontWeight:800, color:scoreColor, lineHeight:1 }}>{score}%</div>
          <div style={{ fontSize:13, fontWeight:700, color:scoreColor }}>Match Score</div>
        </div>
        <div>
          <div style={{ height:10, background:`${scoreColor}20`, borderRadius:100, overflow:'hidden', marginBottom:10 }}>
            <div style={{ height:'100%', width:`${score}%`, background:scoreColor, borderRadius:100 }} />
          </div>
          <div style={{ fontSize:13, color:C.muted }}>Your resume matches <strong>{score}%</strong> of the job requirements. Add {missingKw.length} missing keywords to potentially reach 90%+.</div>
        </div>
        {[['✅ Matched',matchedKw.length,'#d1fae5','#065f46'],['❌ Missing',missingKw.length,'#fee2e2','#991b1b'],['📋 Sections','6/6','#ddd6fe','#4c1d95']].map(([l,v,bg,c]) => (
          <div key={l} style={{ background:bg, borderRadius:12, padding:'12px 20px', textAlign:'center' }}>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:26, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:11, fontWeight:600, color:c, opacity:0.7 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding:'10px 20px', background:'none', border:'none', borderBottom:activeTab===t?`2px solid ${C.indigo}`:'2px solid transparent', color:activeTab===t?C.indigo:C.muted, fontSize:14, fontWeight:600, cursor:'pointer', textTransform:'capitalize', transition:'color .15s', marginBottom:-1 }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, border:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:C.navy, marginBottom:16 }}>✅ Matched Keywords ({matchedKw.length})</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {matchedKw.map(k => <span key={k} style={{ padding:'6px 14px', background:'#d1fae5', color:'#065f46', borderRadius:20, fontSize:13, fontWeight:600 }}>{k}</span>)}
            </div>
          </div>
          <div style={{ background:'#fff', borderRadius:16, padding:24, border:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:C.navy, marginBottom:16 }}>❌ Missing Keywords ({missingKw.length})</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {missingKw.map(k => <span key={k} style={{ padding:'6px 14px', background:'#fef3c7', color:'#92400e', borderRadius:20, fontSize:13, fontWeight:600 }}>{k}</span>)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keywords' && (
        <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden' }}>
          <div style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'1fr 100px 100px', gap:16 }}>
            {['Keyword','In Resume','In JD'].map(h => <span key={h} style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</span>)}
          </div>
          {[...matchedKw.map(k=>({k,inResume:true,inJd:true})),...missingKw.map(k=>({k,inResume:false,inJd:true}))].map(({k,inResume,inJd}) => (
            <div key={k} style={{ padding:'14px 24px', borderBottom:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'1fr 100px 100px', gap:16, alignItems:'center', background:inResume?'#fff':'#fffbeb' }}>
              <span style={{ fontSize:14, fontWeight:500, color:C.slate }}>{k}</span>
              <span style={{ fontSize:13, color:inResume?C.emerald:C.rose, fontWeight:700 }}>{inResume?'✓ Yes':'✗ Missing'}</span>
              <span style={{ fontSize:13, color:C.emerald, fontWeight:700 }}>✓ Required</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'sections' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {sections.map(s => {
            const sc = s.score >= 80 ? C.emerald : s.score >= 60 ? C.amber : C.rose;
            return (
              <div key={s.name} style={{ background:'#fff', borderRadius:12, padding:'18px 24px', border:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'1fr 200px 60px', gap:20, alignItems:'center' }}>
                <span style={{ fontSize:14, fontWeight:600, color:C.navy }}>{s.name}</span>
                <div style={{ height:8, background:C.bg, borderRadius:100, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${s.score}%`, background:sc, borderRadius:100 }} />
                </div>
                <span style={{ fontSize:14, fontWeight:800, color:sc, textAlign:'right' }}>{s.score}%</span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {suggestions.map((s,i) => (
            <div key={i} style={{ background:'#fff', borderRadius:14, padding:24, border:`1px solid ${C.border}`, display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                  <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:15, fontWeight:700, color:C.navy }}>{s.title}</span>
                  <span style={{ padding:'2px 10px', background:s.priority==='High'?'#fee2e2':'#fef3c7', color:s.priority==='High'?'#991b1b':'#92400e', borderRadius:20, fontSize:11, fontWeight:700 }}>{s.priority}</span>
                </div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>{s.detail}</p>
              </div>
              <button style={{ padding:'7px 16px', background:`${C.indigo}10`, color:C.indigo, border:`1px solid ${C.indigo}30`, borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>Apply Fix</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   RECRUITMENT DASHBOARD PAGE
══════════════════════════════════ */
function DashboardPage({ onBack, onChecker }) {
  const [activeSection, setActiveSection] = useState('overview');

  const applications = [
    { company:'Swiggy', role:'Senior Frontend Engineer', stage:'Interview', score:88, date:'May 28', color:'#ff6900' },
    { company:'Razorpay', role:'Full Stack Developer', stage:'Applied', score:72, date:'May 26', color:'#2b4acb' },
    { company:'CRED',    role:'Software Engineer II', stage:'Screening', score:91, date:'May 25', color:'#1a1a2e' },
    { company:'Zepto',   role:'Backend Engineer', stage:'Rejected', score:54, date:'May 22', color:'#8b0000' },
    { company:'Meesho',  role:'React Developer', stage:'Offer', score:95, date:'May 20', color:'#9b59b6' },
    { company:'Groww',   role:'Data Engineer', stage:'Applied', score:67, date:'May 18', color:'#00b386' },
  ];

  const stageColors = { Applied:'#3b82f6', Screening:'#f59e0b', Interview:'#8b5cf6', Offer:'#10b981', Rejected:'#ef4444' };
  const stageBgs    = { Applied:'#eff6ff', Screening:'#fffbeb', Interview:'#f5f3ff', Offer:'#f0fdf4', Rejected:'#fef2f2' };

  const navItems = [
    { id:'overview', label:'Overview', icon:'📊' },
    { id:'applications', label:'Applications', icon:'📋' },
    { id:'analytics', label:'Analytics', icon:'📈' },
    { id:'checker', label:'ATS Checker', icon:'⚡', action: onChecker },
  ];

  const stats = [
    { label:'Total Applications', value:'24', delta:'+6 this week', color:C.indigo },
    { label:'Avg Match Score',    value:'76%', delta:'+8% vs last month', color:C.emerald },
    { label:'Interview Rate',     value:'38%', delta:'+12% improvement', color:C.violet },
    { label:'Active Pipeline',    value:'8',   delta:'3 awaiting response', color:C.amber },
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', fontFamily:"'DM Sans',sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width:230, background:C.navy, display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, zIndex:100 }}>
        <div style={{ padding:'24px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:16, color:'#fff' }}>ATS<span style={{ color:C.indigo }}> Intelligence</span></div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Recruitment Dashboard</div>
        </div>
        <nav style={{ padding:'16px 12px', flex:1 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => { if(n.action) n.action(); else setActiveSection(n.id); }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, border:'none', background:activeSection===n.id?'rgba(79,70,229,0.25)':'transparent', color:activeSection===n.id?'#fff':'rgba(255,255,255,0.5)', fontSize:14, fontWeight:500, cursor:'pointer', marginBottom:4, textAlign:'left', transition:'all .15s' }}
              onMouseEnter={e=>{ if(activeSection!==n.id) e.currentTarget.style.background='rgba(255,255,255,0.06)' }}
              onMouseLeave={e=>{ if(activeSection!==n.id) e.currentTarget.style.background='transparent' }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onBack} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, border:'none', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:500, cursor:'pointer', textAlign:'left' }}>
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft:230, flex:1, padding:'32px 40px' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div>
            <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:26, fontWeight:800, color:C.navy }}>
              {activeSection === 'overview' ? 'Dashboard Overview' : activeSection === 'applications' ? 'My Applications' : 'Analytics'}
            </h1>
            <p style={{ fontSize:14, color:C.muted, marginTop:2 }}>Sunday, 31 May 2026</p>
          </div>
          <button onClick={onChecker} style={{ padding:'10px 20px', background:C.indigo, color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
            ⚡ New ATS Check
          </button>
        </div>

        {(activeSection === 'overview' || activeSection === 'applications') && (
          <>
            {/* Stat cards */}
            {activeSection === 'overview' && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }}>
                {stats.map(s => (
                  <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:24, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>{s.label}</div>
                    <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:32, fontWeight:800, color:s.color, marginBottom:6 }}>{s.value}</div>
                    <div style={{ fontSize:12, color:C.emerald, fontWeight:600 }}>↑ {s.delta}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Pipeline kanban */}
            {activeSection === 'overview' && (
              <div style={{ marginBottom:28 }}>
                <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:C.navy, marginBottom:16 }}>Application Pipeline</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14 }}>
                  {['Applied','Screening','Interview','Offer','Rejected'].map(stage => {
                    const apps = applications.filter(a => a.stage === stage);
                    return (
                      <div key={stage} style={{ background:'#fff', borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
                        <div style={{ padding:'12px 14px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontSize:12, fontWeight:700, color:stageColors[stage] }}>{stage}</span>
                          <span style={{ width:20, height:20, borderRadius:'50%', background:stageBgs[stage], display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:stageColors[stage] }}>{apps.length}</span>
                        </div>
                        <div style={{ padding:'10px 10px', display:'flex', flexDirection:'column', gap:8, minHeight:80 }}>
                          {apps.map(a => (
                            <div key={a.company} style={{ background:C.bg, borderRadius:8, padding:'10px 12px', borderLeft:`3px solid ${a.color}` }}>
                              <div style={{ fontSize:12, fontWeight:700, color:C.navy }}>{a.company}</div>
                              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.role.split(' ').slice(0,3).join(' ')}</div>
                              <div style={{ marginTop:6, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                <span style={{ fontSize:10, fontWeight:700, color:a.score>=80?C.emerald:a.score>=60?C.amber:C.rose }}>{a.score}% match</span>
                                <span style={{ fontSize:10, color:C.subtle }}>{a.date}</span>
                              </div>
                            </div>
                          ))}
                          {apps.length === 0 && <div style={{ fontSize:12, color:C.subtle, textAlign:'center', paddingTop:12 }}>—</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Applications table */}
            <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden' }}>
              <div style={{ padding:'18px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:17, fontWeight:700, color:C.navy }}>{activeSection === 'overview' ? 'Recent Applications' : 'All Applications'}</h2>
                <button style={{ fontSize:13, color:C.indigo, background:'none', border:`1px solid ${C.indigo}30`, borderRadius:8, padding:'6px 14px', cursor:'pointer', fontWeight:600 }}>+ Add Application</button>
              </div>
              <div style={{ padding:'0 24px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 120px 100px 100px 80px', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
                  {['Company','Role','Stage','Match','Date','Actions'].map(h => <span key={h} style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</span>)}
                </div>
                {applications.map(a => (
                  <div key={a.company} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 120px 100px 100px 80px', padding:'16px 0', borderBottom:`1px solid ${C.border}`, alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>{a.company[0]}</div>
                      <span style={{ fontSize:14, fontWeight:600, color:C.navy }}>{a.company}</span>
                    </div>
                    <span style={{ fontSize:13, color:C.muted }}>{a.role}</span>
                    <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 12px', background:stageBgs[a.stage], color:stageColors[a.stage], borderRadius:20, fontSize:12, fontWeight:700, width:'fit-content' }}>{a.stage}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:6, background:C.bg, borderRadius:100, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${a.score}%`, background:a.score>=80?C.emerald:a.score>=60?C.amber:C.rose, borderRadius:100 }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:a.score>=80?C.emerald:a.score>=60?C.amber:C.rose, minWidth:32 }}>{a.score}%</span>
                    </div>
                    <span style={{ fontSize:13, color:C.muted }}>{a.date}</span>
                    <button onClick={onChecker} style={{ fontSize:12, color:C.indigo, background:'none', border:`1px solid ${C.indigo}30`, borderRadius:6, padding:'5px 10px', cursor:'pointer', fontWeight:600 }}>ATS ⚡</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'analytics' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <div style={{ background:'#fff', borderRadius:16, padding:28, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:17, fontWeight:700, color:C.navy, marginBottom:24 }}>Match Score Distribution</h3>
              {[['90–100%',2,C.emerald],['75–89%',8,C.indigo],['60–74%',9,C.amber],['< 60%',5,C.rose]].map(([label, count, color]) => (
                <div key={label} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, color:C.slate, fontWeight:500 }}>{label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color }}>{count} applications</span>
                  </div>
                  <div style={{ height:10, background:C.bg, borderRadius:100, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(count/24)*100}%`, background:color, borderRadius:100, transition:'width 1s' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', borderRadius:16, padding:28, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:17, fontWeight:700, color:C.navy, marginBottom:24 }}>Application Funnel</h3>
              {[['Applied',24,'#3b82f6'],['Screened',14,'#f59e0b'],['Interviewed',9,'#8b5cf6'],['Offers',3,'#10b981']].map(([stage,n,color]) => (
                <div key={stage} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                  <div style={{ width:96, textAlign:'right', fontSize:13, color:C.muted, fontWeight:500 }}>{stage}</div>
                  <div style={{ flex:1, height:32, background:C.bg, borderRadius:8, overflow:'hidden', position:'relative' }}>
                    <div style={{ height:'100%', width:`${(n/24)*100}%`, background:color, opacity:0.85, borderRadius:8, transition:'width 1s' }} />
                    <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:12, fontWeight:700, color:'#fff', mixBlendMode:'multiply' }}>{n}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color, minWidth:36 }}>{Math.round((n/24)*100)}%</span>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff', borderRadius:16, padding:28, border:`1px solid ${C.border}`, gridColumn:'span 2' }}>
              <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:17, fontWeight:700, color:C.navy, marginBottom:20 }}>Top Missing Keywords (across all applications)</h3>
              <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                {[['SDLC',8],['Test automation',7],['Kubernetes',6],['Troubleshooting',5],['Go-to-market',4],['System design',4],['OKR Planning',3],['gRPC',2]].map(([kw, count]) => (
                  <div key={kw} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:100 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.slate }}>{kw}</span>
                    <span style={{ width:20, height:20, borderRadius:'50%', background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#991b1b' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}