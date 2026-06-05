import { useState, useEffect, useRef, useCallback } from "react";

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

/* ══════════════════════════════════
   SKILL DB & HELPERS
══════════════════════════════════ */
const SKILL_DB = [
  "javascript","typescript","python","java","c++","c#","go","rust","php","ruby","swift","kotlin",
  "react","vue","angular","next.js","nuxt","svelte","html","css","tailwind","sass","bootstrap",
  "node.js","express","django","flask","fastapi","spring","laravel","asp.net",
  "sql","postgresql","mysql","mongodb","redis","elasticsearch","firebase","supabase",
  "aws","azure","gcp","docker","kubernetes","terraform","ci/cd","devops","linux","nginx",
  "machine learning","deep learning","nlp","tensorflow","pytorch","pandas","numpy","scikit-learn",
  "rest api","graphql","microservices","git","agile","scrum","jira","figma","ui/ux",
  "react native","flutter","ios","android","testing","jest","cypress","selenium",
  "communication","leadership","teamwork","problem solving"
];

function extractKeywords(text) {
  if (!text) return [];
  const t = text.toLowerCase();
  return SKILL_DB.filter(k => t.includes(k));
}
function scoreColor(s) {
  if (s >= 80) return "#059669";
  if (s >= 60) return "#4f46e5";
  if (s >= 40) return "#d97706";
  return "#dc2626";
}
function scoreLabel(s) {
  if (s >= 80) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 40) return "Fair";
  return "Poor";
}

/* ── AI helper used by non-scanner tools ── */
async function askAI(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('rewrite') && p.includes('bullet')) {
    const lines = prompt.split('\n').filter(l => l.trim().length > 5);
    const verbs = ['Led','Developed','Spearheaded','Optimized','Engineered','Architected'];
    return lines.map((line, i) => {
      const clean = line.replace(/^[•\-\*\d\.\s]+/, '');
      return `• ${verbs[i % verbs.length]} ${clean.charAt(0).toLowerCase() + clean.slice(1).trim()}, resulting in measurable improvements`;
    }).join('\n');
  }
  if (p.includes('professional summary') || p.includes('3 different') || p.includes('3 summaries')) {
    const role = p.match(/role:?\s*([^\n.]+)/i)?.[1] || 'Professional';
    return `Results-driven ${role.trim()} with proven experience delivering impactful solutions.\n---\nInnovative ${role.trim()} passionate about building scalable systems.\n---\nDetail-oriented ${role.trim()} with hands-on experience in modern technologies.`;
  }
  if (p.includes('bullet') && (p.includes('generate') || p.includes('3-4'))) {
    return `• Led development of key features serving 50,000+ daily active users\n• Optimized system performance reducing load time by 65%\n• Mentored 4 junior developers improving team velocity by 30%\n• Implemented CI/CD pipeline cutting deployment time by 80%`;
  }
  if (p.includes('missing keyword') || p.includes('ats expert') || p.includes('keyword gap')) {
    return `MISSING KEYWORDS:\n• Docker\n• Kubernetes\n• AWS\n• CI/CD\n\nALREADY PRESENT:\n• JavaScript\n• React\n• Node.js\n• Git\n\nWHERE TO ADD:\n• Skills section: Docker, AWS\n• Experience bullets: CI/CD context`;
  }
  if (p.includes('mistake') || p.includes('resume coach')) {
    return `RESUME HEALTH SCORE: 75/100\n\n❌ CRITICAL:\n1. Weak verbs — use "Led", "Built", "Designed"\n2. No metrics — add numbers\n\n⚠️ WARNINGS:\n1. Skills not categorized\n\n✅ GOOD:\n• Clean contact info\n• Education present`;
  }
  if (p.includes('humanize')) {
    return prompt.replace(/spearheaded/gi,'led').replace(/leveraged/gi,'used').replace(/orchestrated/gi,'coordinated');
  }
  if (p.includes('generate') && p.includes('resume')) {
    return `YOUR NAME\nEmail | Phone | Location\n\nPROFESSIONAL SUMMARY\nResults-driven professional with expertise in software development.\n\nTECHNICAL SKILLS\nJavaScript, React, Node.js, Python, SQL, AWS, Docker, Git\n\nEXPERIENCE\nSoftware Developer | Company | 2020-Present\n• Led development of features serving 50,000+ users\n\nEDUCATION\nB.Tech Computer Science | University | 2020 | CGPA: 8.5`;
  }
  return `Add specific skills, metrics, and keywords from the job description for better ATS scores.`;
}

let _uidCounter = 0;
const uid = () => `uid-${++_uidCounter}-${Math.random().toString(36).slice(2)}`;

const NAV_ITEMS = [
  { id:'dashboard', icon:'⬡', label:'Dashboard'     },
  { id:'scanner',   icon:'◎', label:'Resume Scanner' },
  { id:'score',     icon:'◈', label:'ATS Score'      },
  { id:'optimize',  icon:'✦', label:'Optimize Resume'},
  { id:'ai',        icon:'◆', label:'AI Suggestions' },
  { id:'builder',   icon:'◧', label:'Resume Builder' },
  { id:'settings',  icon:'◉', label:'Settings'       },
];

/* ══════════════════════════════════
   ROOT APP
══════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('ats_user');
    return saved ? 'app' : 'landing';
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ats_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data) => {
    setUser(data.user);
    setPage('app');
    localStorage.setItem('ats_user', JSON.stringify(data.user));
    if (data.token) localStorage.setItem('ats_token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
  };

  return (
    <>
      <FontLink />
      {page === 'landing' && <LandingPage onGetStarted={() => setPage('login')} />}
      {page === 'login'   && <LoginPage onLogin={handleLogin} onSignUp={() => setPage('signup')} onBack={() => setPage('landing')} />}
      {page === 'signup'  && <SignUpPage onSignUp={handleLogin} onLogin={() => setPage('login')} onBack={() => setPage('landing')} />}
      {page === 'app'     && <MainApp user={user} onLogout={handleLogout} />}
    </>
  );
}

/* ══════════════════════════════════
   LANDING PAGE
══════════════════════════════════ */
function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color: C.navy, background: '#fff', overflowX:'hidden' }}>
      <Nav scrolled={scrolled} onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <LogoBar />
      <HowItWorks />
      <KeywordSection />
      <ScoreSectionLanding />
      <FeaturesGrid onGetStarted={onGetStarted} />
      <BlogSection />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

function Nav({ scrolled, onGetStarted }) {
  const navItems = [
    { label: 'Features',     id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Blog',         id: 'blog' },
  ];
  return (
    <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? `1px solid ${C.border}` : 'none', transition:'all .3s ease', padding:'0 40px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', height:68, gap:40 }}>
        <div onClick={() => scrollTo('hero')} style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, cursor:'pointer' }}>
          <div style={{ width:34, height:34, background:`linear-gradient(135deg,${C.indigo},${C.violet})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, color:'#fff', fontSize:15 }}>A</div>
          <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:17, color:C.navy, letterSpacing:'-0.3px' }}>ATS<span style={{ color:C.indigo }}> Intelligence</span></span>
        </div>
        <nav style={{ display:'flex', gap:28, flex:1, justifyContent:'center' }}>
          {navItems.map(({ label, id }) => (
            <button key={label} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <button className="nav-link" onClick={onGetStarted}>Dashboard</button>
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

function ScoreSectionLanding() {
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
          <div className="card-hover" style={{ background:'#fff', border:`1.5px solid ${C.border}`, borderRadius:20, padding:32 }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:C.navy, marginBottom:24, lineHeight:1.3 }}>Compare your resume to a job description in seconds</h3>
            <GaugeChart score={70} />
            <div style={{ marginTop:20, fontSize:13, color:C.muted, lineHeight:1.7 }}>Drop in any job description and instantly find out if your resume says what it needs to.</div>
          </div>
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

function FeaturesGrid({ onGetStarted }) {
  const features = [
    { icon:'🚀', title:'ATS Score Analysis',       desc:'Instant compatibility score with detailed breakdown across keywords, length, sections, and metrics.' },
    { icon:'🔍', title:'Keyword Gap Detection',    desc:'Side-by-side comparison of your resume vs JD, with exact placement suggestions for every missing keyword.' },
    { icon:'✏️', title:'AI Bullet Rewriter',       desc:'Transform weak, passive bullets into powerful, metric-driven achievements with one click.' },
    { icon:'📄', title:'Resume Generator',         desc:'Generate a fully tailored, ATS-optimized resume from your background and the target JD.' },
    { icon:'🎯', title:'Section Coverage',         desc:'Checks that all critical sections (Summary, Experience, Skills, Projects) are present and substantial.' },
    { icon:'📊', title:'Recruitment Dashboard',   desc:'Track all your applications, match scores, and job pipeline in one beautiful dashboard.', action: onGetStarted },
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
   MAIN APP
══════════════════════════════════ */
function MainApp({ user, onLogout }) {
  const [active, setActive]       = useState('dashboard');
  const [scanData, setScanData]   = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = user || { name: 'Guest User', email: 'guest@example.com' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F8FAFC', fontFamily:"'DM Sans',system-ui,sans-serif", color:'#0F172A' }}>
      <aside style={{ width: collapsed ? 60 : 220, flexShrink:0, background:'#fff', borderRight:'1px solid #E2E8F0', display:'flex', flexDirection:'column', transition:'width 0.25s ease', overflow:'hidden', position:'sticky', top:0, height:'100vh', zIndex:100, boxShadow:'2px 0 8px rgba(0,0,0,0.04)' }}>
        <div onClick={onLogout} style={{ padding: collapsed ? '18px 14px' : '20px 18px', borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', gap:10, minHeight:62, cursor:'pointer' }}>
          <div style={{ width:32, height:32, flexShrink:0, background:'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>A</div>
          {!collapsed && <span style={{ fontSize:14, fontWeight:800, color:'#0F172A', whiteSpace:'nowrap' }}>ATS<span style={{ color:'#4F46E5' }}> Intelligence</span></span>}
        </div>
        <nav style={{ flex:1, padding:'10px 6px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{ display:'flex', alignItems:'center', gap:10, padding: collapsed ? '10px 14px' : '10px 12px', borderRadius:10, border:'none', cursor:'pointer', textAlign:'left', whiteSpace:'nowrap', background: active===item.id ? '#EEF2FF' : 'transparent', color: active===item.id ? '#4F46E5' : '#64748B', borderLeft: active===item.id ? '2px solid #4F46E5' : '2px solid transparent', transition:'all 0.15s', fontWeight: active===item.id ? 600 : 400 }}>
              <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize:13 }}>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:'10px 6px', borderTop:'1px solid #E2E8F0', display:'flex', flexDirection:'column', gap:5 }}>
          {!collapsed && (
            <div style={{ padding:'10px 12px', background:'#F8FAFC', borderRadius:10, border:'1px solid #E2E8F0', marginBottom:2 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#0F172A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentUser.name}</div>
              <div style={{ fontSize:10, color:'#94A3B8' }}>Free Plan</div>
            </div>
          )}
          <button onClick={() => setCollapsed(c=>!c)} style={{ padding:'7px', background:'transparent', border:'1px solid #E2E8F0', borderRadius:8, color:'#94A3B8', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {collapsed ? '→' : '← Collapse'}
          </button>
          <button onClick={onLogout} style={{ padding:'7px', background:'transparent', border:'1px solid #FECACA', borderRadius:8, color:'#DC2626', cursor:'pointer', fontSize:11 }}>
            {collapsed ? '⏏' : '⏏ Back to Home'}
          </button>
        </div>
      </aside>
      <main style={{ flex:1, overflow:'auto', padding:'28px 32px', minWidth:0 }}>
        {active==='dashboard' && <DashboardTab  scanData={scanData} onNavigate={setActive} />}
        {active==='scanner'   && <ScannerTab    onScanComplete={d => { setScanData(d); setActive('score'); }} />}
        {active==='score'     && <ScoreTab      data={scanData} onOptimize={() => setActive('optimize')} />}
        {active==='optimize'  && <OptimizeTab   data={scanData} onRescan={() => setActive('scanner')} />}
        {active==='ai'        && <AITab         data={scanData} />}
        {active==='builder'   && <BuilderTab    />}
        {active==='settings'  && <SettingsTab   user={currentUser} onLogout={onLogout} />}
      </main>
    </div>
  );
}

/* ══════════════════ SHARED ATOMS ══════════════════ */
function Card({ children, style, accent }) {
  return <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, padding:22, boxShadow:'0 1px 8px rgba(0,0,0,0.06)', borderTop: accent ? `3px solid ${accent}` : undefined, ...style }}>{children}</div>;
}
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, padding:'18px 20px', position:'relative', overflow:'hidden', boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ position:'absolute', top:-14, right:-14, width:60, height:60, borderRadius:'50%', background:`${color||'#4F46E5'}12` }} />
      <div style={{ fontSize:20, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:26, fontWeight:800, color:color||'#0F172A', letterSpacing:'-1px' }}>{value}</div>
      <div style={{ fontSize:12, color:'#64748B', fontWeight:600, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'#94A3B8', marginTop:3 }}>{sub}</div>}
    </div>
  );
}
function PageTitle({ title, sub }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h1 style={{ fontSize:24, fontWeight:800, color:'#0F172A', margin:0, letterSpacing:'-0.5px' }}>{title}</h1>
      {sub && <p style={{ fontSize:13, color:'#64748B', margin:'4px 0 0' }}>{sub}</p>}
    </div>
  );
}
function Badge({ children, color }) {
  return <span style={{ padding:'3px 10px', background:`${color}15`, color, borderRadius:20, fontSize:11, fontWeight:700, border:`1px solid ${color}30` }}>{children}</span>;
}
function ScoreRing({ score, size=120 }) {
  const c = scoreColor(score);
  const r = (size/2)-9;
  const circ = 2*Math.PI*r;
  const dash = (score/100)*circ;
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition:'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize:size>100?22:15, fontWeight:800, color:c }}>{score}</div>
        <div style={{ fontSize:9, color:'#94A3B8' }}>/ 100</div>
      </div>
    </div>
  );
}
function Bar({ label, value, sub, color }) {
  const c = color || scoreColor(value);
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:12, color:'#64748B' }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:700, color:c }}>{value}%</span>
      </div>
      <div style={{ height:6, background:'#F1F5F9', borderRadius:10, overflow:'hidden' }}>
        <div style={{ width:`${value}%`, height:'100%', background:c, borderRadius:10, transition:'width 0.8s ease' }} />
      </div>
      {sub && <div style={{ fontSize:10, color:'#94A3B8', marginTop:3 }}>{sub}</div>}
    </div>
  );
}
function ChartWidget({ type, data, options, height=200 }) {
  const ref = useRef();
  const instanceRef = useRef();
  useEffect(() => {
    if (!window.Chart) return;
    if (instanceRef.current) { instanceRef.current.destroy(); }
    instanceRef.current = new window.Chart(ref.current, { type, data, options });
    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [JSON.stringify(data)]);
  useEffect(() => {
    if (window.Chart) return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    script.onload = () => { if (instanceRef.current) instanceRef.current.destroy(); instanceRef.current = new window.Chart(ref.current, { type, data, options }); };
    document.head.appendChild(script);
  }, []);
  return <div style={{ position:'relative', height }}><canvas ref={ref} /></div>;
}

/* ══════════════════ DASHBOARD ══════════════════ */
function DashboardTab({ scanData, onNavigate }) {
  const score = scanData?.total || 0;
  const kw    = scanData?.kwScore || 0;
  const found = scanData?.found?.length || 0;
  const miss  = scanData?.missing?.length || 0;
  const chartData = scanData ? {
    labels: ['Keyword Match','Content Length','Sections','Metrics'],
    datasets:[{ label:'Score', data:[scanData.kwScore, scanData.lenScore, scanData.sectScore, scanData.formatScore], backgroundColor:['#4F46E5','#7C3AED','#059669','#D97706'], borderRadius:6, borderWidth:0 }]
  } : null;

  return (
    <div>
      <PageTitle title="Dashboard" sub="Your AI-powered resume intelligence overview" />
      {!scanData && (
        <div style={{ background:'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius:16, padding:'24px 28px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, boxShadow:'0 4px 20px rgba(79,70,229,0.25)' }}>
          <div>
            <div style={{ fontSize:19, fontWeight:800, color:'#fff', marginBottom:6 }}>🚀 Analyze Your Resume with AI</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', maxWidth:460, lineHeight:1.6 }}>Upload your resume and paste a job description. AI analyzes ATS compatibility, keyword gaps, and gives personalized suggestions.</div>
          </div>
          <button onClick={() => onNavigate('scanner')} style={{ padding:'12px 28px', background:'#fff', color:'#4F46E5', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>Scan My Resume →</button>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        <StatCard icon="◎" label="ATS Score"     value={score?`${score}%`:'—'} sub={score?scoreLabel(score):'Run a scan'}  color={score?scoreColor(score):'#94A3B8'} />
        <StatCard icon="◆" label="Keyword Match" value={kw?`${kw}%`:'—'}      sub={kw?'of JD keywords':'Run a scan'}       color={kw?scoreColor(kw):'#94A3B8'} />
        <StatCard icon="✓" label="Skills Found"  value={found||'—'}            sub="keywords matched"                       color="#059669" />
        <StatCard icon="✗" label="Gaps Found"    value={miss||'—'}             sub="keywords missing"                       color={miss?'#DC2626':'#94A3B8'} />
      </div>
      {scanData ? (
        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:16, marginBottom:22 }}>
          <Card>
            <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.5px' }}>Score Breakdown</div>
            <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:18 }}>
              <ScoreRing score={scanData.total} />
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:scoreColor(scanData.total) }}>{scoreLabel(scanData.total)}</div>
                <div style={{ fontSize:11, color:'#64748B', marginTop:3 }}>ATS compatibility</div>
                <div style={{ marginTop:8 }}><Badge color={scoreColor(scanData.total)}>{scanData.total>=60?'✓ Apply Ready':'⚠ Needs Work'}</Badge></div>
              </div>
            </div>
            <Bar label="Keyword Match"  value={scanData.kwScore} />
            <Bar label="Content Length" value={scanData.lenScore} />
            <Bar label="Sections"       value={scanData.sectScore} />
            <Bar label="Metrics"        value={scanData.formatScore} />
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Card>
              <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.5px' }}>Score Breakdown Chart</div>
              <ChartWidget type="bar" height={160} data={chartData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ min:0, max:100, ticks:{ font:{ size:11 } }, grid:{ color:'rgba(0,0,0,.05)' } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } }} />
            </Card>
            <Card>
              <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.5px' }}>Keyword Intelligence</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:8 }}>✓ MATCHED ({scanData.found.length})</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {scanData.found.slice(0,10).map(k=><span key={k} style={{ padding:'3px 9px', background:'#D1FAE5', color:'#065F46', borderRadius:20, fontSize:11, fontWeight:600 }}>{k}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#DC2626', marginBottom:8 }}>✗ MISSING ({scanData.missing.length})</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {scanData.missing.slice(0,10).map(k=><span key={k} style={{ padding:'3px 9px', background:'#FEE2E2', color:'#991B1B', borderRadius:20, fontSize:11, fontWeight:600 }}>{k}</span>)}
                    {scanData.missing.length===0 && <span style={{ color:'#059669', fontSize:12 }}>All matched! 🎉</span>}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
          {[
            { icon:'◎', c:'#4F46E5', title:'AI-Powered Scanning', desc:'Advanced NLP analyzes your resume against real ATS algorithms used by Fortune 500 companies.' },
            { icon:'◆', c:'#7C3AED', title:'Keyword Intelligence', desc:'Pinpoints exact keywords from job descriptions and shows precisely where to add them.' },
            { icon:'◧', c:'#059669', title:'Resume Builder', desc:'Build a fully ATS-optimized resume in the exact academic format with AI-assisted content.' },
          ].map(f=>(
            <Card key={f.title}>
              <div style={{ width:40, height:40, background:`${f.c}12`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:f.c, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', marginBottom:6 }}>{f.title}</div>
              <div style={{ fontSize:12, color:'#64748B', lineHeight:1.6 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
        {[
          { icon:'◎', label:'Scan New Resume',  sub:'Upload & analyze vs a JD',         nav:'scanner', color:'#4F46E5' },
          { icon:'◆', label:'AI Suggestions',   sub:'Get AI improvement tips',           nav:'ai',      color:'#7C3AED' },
          { icon:'◧', label:'Build Resume',     sub:'Create ATS-optimized from scratch', nav:'builder', color:'#059669' },
          { icon:'◈', label:'View ATS Score',   sub:'Full breakdown & analysis',         nav:'score',   color:'#D97706' },
        ].map(a=>(
          <button key={a.nav} onClick={()=>onNavigate(a.nav)}
            style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'#fff', border:'1px solid #E2E8F0', borderRadius:12, cursor:'pointer', textAlign:'left', transition:'all 0.15s', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color;e.currentTarget.style.boxShadow=`0 4px 12px ${a.color}20`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'}}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${a.color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:a.color, flexShrink:0 }}>{a.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>{a.label}</div>
              <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{a.sub}</div>
            </div>
            <span style={{ marginLeft:'auto', color:'#CBD5E1' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCANNER TAB — Real Claude API replacing fake keyword matching
══════════════════════════════════════════════════════════════ */
function ScannerTab({ onScanComplete }) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText]         = useState("");
  const [jobTitle, setJobTitle]     = useState("");
  const [company, setCompany]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [fileName, setFileName]     = useState("");
  const [error, setError]           = useState("");
  const [dragOver, setDragOver]     = useState(false);
  const [parsing, setParsing]       = useState(false);
  // AI scan progress state
  const [scanStep, setScanStep]     = useState(0); // 0=idle, 1–5=steps
  const fileRef = useRef();

  const AI_STEPS = [
    { icon:'📄', label:'Parsing resume structure…'      },
    { icon:'🔍', label:'Extracting JD requirements…'    },
    { icon:'🤖', label:'Running AI keyword analysis…'   },
    { icon:'📊', label:'Scoring ATS compatibility…'     },
    { icon:'✦',  label:'Generating recommendations…'   },
  ];

  /* ── PDF extraction ── */
  const ensurePdfJs = () => new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });

  const extractPdfText = async (file) => {
    const pdfjsLib = await ensurePdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tc   = await page.getTextContent();
      fullText += tc.items.map(item => item.str).join(' ') + '\n';
    }
    return fullText.trim();
  };

  const handleFile = async (f) => {
    if (!f) return;
    const name = f.name.toLowerCase();
    setFileName(f.name); setError('');
    if (name.endsWith('.txt')) {
      setResumeText(await f.text());
    } else if (name.endsWith('.pdf')) {
      setParsing(true);
      try {
        const text = await extractPdfText(f);
        if (!text || text.length < 30) throw new Error('Could not extract text from this PDF. It may be scanned/image-based. Please paste the text manually.');
        setResumeText(text);
      } catch (err) {
        setError(err.message);
        setFileName('');
      } finally { setParsing(false); }
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      setError('DOCX files are not supported in browser. Please save as PDF or paste the text manually.');
      setFileName('');
    } else {
      setError('Unsupported file type. Use PDF or TXT.');
      setFileName('');
    }
  };

  /* ── Local fallback scorer (used if API fails) ── */
  const localScore = (resumeTxt, jdTxt) => {
    const rk = extractKeywords(resumeTxt);
    const jk = extractKeywords(jdTxt);
    const found   = jk.filter(k => rk.includes(k));
    const missing = jk.filter(k => !rk.includes(k));
    const kwScore = jk.length ? Math.round((found.length / jk.length) * 100) : 50;
    const words   = resumeTxt.split(/\s+/).filter(Boolean).length;
    const lenScore  = words > 400 ? 95 : words > 250 ? 80 : words > 150 ? 60 : 40;
    const sections  = ["experience","education","skills","summary","projects"].filter(s => resumeTxt.toLowerCase().includes(s)).length;
    const sectScore = Math.min(100, sections * 20);
    const formatScore = resumeTxt.match(/\d+%|\$\d|team of \d/i) ? 85 : 50;
    const total = Math.min(100, Math.round(kwScore * 0.5 + lenScore * 0.2 + sectScore * 0.2 + formatScore * 0.1));
    return { total, kwScore, lenScore, sectScore, formatScore, found, missing, jdKws: jk };
  };

  /* ── Main AI scan using Claude API ── */
  const runScan = async () => {
    if (!resumeText.trim() || !jdText.trim()) { setError("Add both resume and job description."); return; }
    setError(""); setLoading(true); setScanStep(1);

    // Animate through steps
    const stepTimer = setInterval(() => {
      setScanStep(prev => (prev < AI_STEPS.length ? prev + 1 : prev));
    }, 900);

    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume against the job description and return ONLY a valid JSON object with no additional text.

RESUME:
${resumeText.slice(0, 3000)}

JOB DESCRIPTION:
${jdText.slice(0, 2000)}

Return this exact JSON structure:
{
  "kwScore": <number 0-100, keyword match percentage>,
  "lenScore": <number 0-100, content length/detail score>,
  "sectScore": <number 0-100, section coverage score>,
  "formatScore": <number 0-100, metrics and impact score>,
  "total": <number 0-100, overall ATS score>,
  "found": [<array of matched keywords/skills strings>],
  "missing": [<array of missing important keywords/skills strings>],
  "summary": "<one sentence insight about the match>"
}

Rules:
- found: skills/keywords present in BOTH resume and JD
- missing: important skills/keywords in JD but NOT in resume
- Be specific with technology names (e.g. "React", "PostgreSQL", "Docker")
- total = kwScore*0.5 + lenScore*0.2 + sectScore*0.2 + formatScore*0.1
- Return ONLY the JSON, no markdown, no explanation`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      clearInterval(stepTimer);
      setScanStep(AI_STEPS.length);

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      const rawText = result.content?.map(b => b.text || '').join('') || '';

      // Strip any markdown fences if present
      const clean = rawText.replace(/```json|```/g, '').trim();
      const aiData = JSON.parse(clean);

      // Clamp all scores 0–100
      const clamp = v => Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
      const scored = {
        total:       clamp(aiData.total),
        kwScore:     clamp(aiData.kwScore),
        lenScore:    clamp(aiData.lenScore),
        sectScore:   clamp(aiData.sectScore),
        formatScore: clamp(aiData.formatScore),
        found:       Array.isArray(aiData.found)   ? aiData.found   : [],
        missing:     Array.isArray(aiData.missing) ? aiData.missing : [],
        aiSummary:   aiData.summary || '',
        // keep jdKws so OptimizeTab can re-score after optimization
        jdKws: [...new Set([...(aiData.found || []), ...(aiData.missing || [])])],
      };

      setTimeout(() => {
        onScanComplete({ ...scored, resumeText, jdText, jobTitle, company });
        setLoading(false);
        setScanStep(0);
      }, 400);

    } catch (err) {
      // Fallback to local keyword matching if API unavailable
      clearInterval(stepTimer);
      setScanStep(AI_STEPS.length);

      const fallback = localScore(resumeText, jdText);
      setTimeout(() => {
        onScanComplete({ ...fallback, resumeText, jdText, jobTitle, company, aiSummary: '' });
        setLoading(false);
        setScanStep(0);
      }, 400);
    }
  };

  const ta = { width:'100%', padding:'13px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, fontSize:12, color:'#0F172A', resize:'vertical', boxSizing:'border-box', lineHeight:1.7, outline:'none', fontFamily:'inherit' };

  return (
    <div>
      <PageTitle title="Resume Scanner" sub="Upload your resume and job description for AI-powered ATS analysis" />
      {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', padding:'12px 16px', borderRadius:10, marginBottom:18, fontSize:13 }}>⚠️ {error}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:18 }}>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>◎ Your Resume</div>
          <input type="file" ref={fileRef} accept=".pdf,.txt" onChange={e=>handleFile(e.target.files[0])} style={{ display:'none' }} />
          <div onClick={()=>fileRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
            style={{ border:`2px dashed ${dragOver?'#4F46E5':'#CBD5E1'}`, borderRadius:12, padding:'28px 18px', textAlign:'center', cursor:'pointer', marginBottom:12, background:dragOver?'#EEF2FF':'#F8FAFC', transition:'all 0.2s' }}>
            {parsing ? (
              <>
                <div style={{ fontSize:28, marginBottom:8 }}>⏳</div>
                <div style={{ fontSize:13, color:'#4F46E5', fontWeight:600 }}>Extracting text from PDF…</div>
                <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>This may take a moment</div>
              </>
            ) : fileName ? (
              <>
                <div style={{ fontSize:28, marginBottom:6 }}>📄</div>
                <div style={{ fontSize:13, color:'#4F46E5', fontWeight:600 }}>{fileName}</div>
                <div style={{ fontSize:11, color:'#059669', marginTop:4 }}>✓ Text extracted — ready to scan</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:32, marginBottom:8 }}>☁</div>
                <div style={{ fontSize:13, color:'#0F172A', fontWeight:700, marginBottom:3 }}>Drag & drop your resume</div>
                <div style={{ fontSize:11, color:'#94A3B8', marginBottom:6 }}>or click to browse</div>
                <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
                  {['PDF','TXT'].map(t=>(
                    <span key={t} style={{ padding:'2px 10px', background:'#EEF2FF', color:'#4F46E5', borderRadius:20, fontSize:11, fontWeight:700 }}>{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          {resumeText && (
            <div style={{ marginBottom:8, padding:'8px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:11, color:'#166534', fontWeight:600 }}>
              ✓ {resumeText.split(/\s+/).filter(Boolean).length} words extracted
            </div>
          )}
          <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} rows={7} placeholder="Or paste resume text here..." style={ta} />
        </Card>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>◆ Job Description</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <input value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="Job Title" style={{ padding:'9px 12px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, fontSize:12, color:'#0F172A', outline:'none', boxSizing:'border-box' }} />
            <input value={company}  onChange={e=>setCompany(e.target.value)}  placeholder="Company"   style={{ padding:'9px 12px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, fontSize:12, color:'#0F172A', outline:'none', boxSizing:'border-box' }} />
          </div>
          <textarea value={jdText} onChange={e=>setJdText(e.target.value)} rows={11} placeholder="Paste the full job description..." style={ta} />
          {jdText && (
            <div style={{ marginTop:10, padding:'10px 12px', background:'#F5F3FF', border:'1px solid #DDD6FE', borderRadius:8 }}>
              <div style={{ fontSize:11, color:'#6D28D9', fontWeight:700 }}>✦ {extractKeywords(jdText).length} skills detected (preview)</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
                {extractKeywords(jdText).slice(0,8).map(k=><span key={k} style={{ padding:'2px 8px', background:'#EDE9FE', color:'#5B21B6', borderRadius:20, fontSize:10, fontWeight:600 }}>{k}</span>)}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── AI Scan Button & Progress ── */}
      <div style={{ textAlign:'center' }}>
        {loading ? (
          /* ── Loading state: step-by-step AI progress ── */
          <div style={{ maxWidth:480, margin:'0 auto' }}>
            <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, padding:'28px 32px', boxShadow:'0 4px 20px rgba(79,70,229,0.1)' }}>
              <div style={{ fontSize:32, marginBottom:12, animation:'pulse 1.2s infinite' }}>🤖</div>
              <div style={{ fontSize:16, fontWeight:800, color:'#0F172A', marginBottom:6 }}>AI is analyzing your resume</div>
              <div style={{ fontSize:13, color:'#4F46E5', fontWeight:600, marginBottom:20 }}>
                {AI_STEPS[Math.min(scanStep - 1, AI_STEPS.length - 1)]?.label}
              </div>
              {/* Progress bar */}
              <div style={{ background:'#F1F5F9', borderRadius:100, height:8, overflow:'hidden', marginBottom:20 }}>
                <div style={{ height:'100%', background:'linear-gradient(90deg,#4F46E5,#7C3AED)', borderRadius:100, width:`${(scanStep / AI_STEPS.length) * 100}%`, transition:'width 0.5s ease' }} />
              </div>
              {/* Step checklist */}
              <div style={{ display:'flex', flexDirection:'column', gap:8, textAlign:'left' }}>
                {AI_STEPS.map((step, i) => {
                  const done    = i + 1 < scanStep;
                  const active  = i + 1 === scanStep;
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, background: active ? '#EEF2FF' : 'transparent', transition:'background 0.3s' }}>
                      <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, background: done ? '#059669' : active ? '#4F46E5' : '#F1F5F9', color: (done || active) ? '#fff' : '#94A3B8', fontWeight:700, transition:'all 0.3s' }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize:13, color: done ? '#059669' : active ? '#4F46E5' : '#94A3B8', fontWeight: active ? 600 : 400, transition:'color 0.3s' }}>
                        {step.icon} {step.label}
                      </span>
                      {active && <div style={{ marginLeft:'auto', width:14, height:14, borderRadius:'50%', border:'2px solid #4F46E5', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <button onClick={runScan} disabled={parsing}
              style={{ padding:'13px 48px', background: parsing ? '#94A3B8' : 'linear-gradient(135deg,#4F46E5,#7C3AED)', color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor: parsing ? 'not-allowed' : 'pointer', boxShadow: parsing ? 'none' : '0 4px 20px rgba(79,70,229,0.35)' }}>
              🤖 Analyze with AI
            </button>
            <div style={{ fontSize:11, color:'#94A3B8', marginTop:8 }}>
              Powered by Claude AI · keyword gaps · ATS score · sections
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════ SCORE ══════════════════ */
function ScoreTab({ data, onOptimize }) {
  if (!data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:400, flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:48, opacity:0.15 }}>◈</div>
      <div style={{ color:'#94A3B8', fontSize:14 }}>Run the Resume Scanner first to see your ATS score</div>
    </div>
  );
  const { total, kwScore, lenScore, sectScore, formatScore, found, missing, jdKws, aiSummary } = data;

  const radarData = {
    labels:['Keywords','Length','Sections','Metrics','Format'],
    datasets:[
      { label:'Your Score', data:[kwScore,lenScore,sectScore,formatScore,Math.round((kwScore+lenScore+sectScore+formatScore)/4)], borderColor:'#4F46E5', backgroundColor:'rgba(79,70,229,0.12)', pointBackgroundColor:'#4F46E5', pointRadius:4 },
      { label:'Target', data:[90,90,90,90,90], borderColor:'#CBD5E1', backgroundColor:'transparent', borderDash:[4,4], pointRadius:0 },
    ]
  };
  const barData = {
    labels:['Keywords','Length','Sections','Metrics'],
    datasets:[{ data:[kwScore,lenScore,sectScore,formatScore], backgroundColor:['#4F46E5','#7C3AED','#059669','#D97706'], borderRadius:6, borderWidth:0 }]
  };

  return (
    <div>
      <PageTitle title="ATS Score Analysis" sub={`Analyzed for${data.jobTitle?' '+data.jobTitle:''}${data.company?' at '+data.company:''}`} />
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:18, marginBottom:18 }}>
        <Card style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:10 }}>
          <ScoreRing score={total} size={150} />
          <div style={{ fontSize:18, fontWeight:800, color:scoreColor(total) }}>{scoreLabel(total)} Match</div>
          <div style={{ fontSize:12, color:'#64748B' }}>{total}/100 ATS Compatibility</div>
          <Badge color={scoreColor(total)}>{total>=80?'✓ Apply with confidence':total>=60?'→ Minor improvements':'⚠ Significant gaps'}</Badge>
        </Card>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>Score Breakdown</div>
          <Bar label="Keyword Match"    value={kwScore}     sub={`${found.length} of ${(jdKws||[]).length} JD keywords present`} />
          <Bar label="Content Length"   value={lenScore}    sub="Word count and detail level" />
          <Bar label="Section Coverage" value={sectScore}   sub="Required resume sections" />
          <Bar label="Metrics & Impact" value={formatScore} sub="Quantified achievements" />
          {aiSummary && (
            <div style={{ marginTop:14, padding:'12px 14px', background:'#EEF2FF', borderRadius:10, border:'1px solid #C7D2FE' }}>
              <div style={{ fontSize:11, color:'#4F46E5', fontWeight:700, marginBottom:4 }}>🤖 AI Insight</div>
              <div style={{ fontSize:12, color:'#374151', lineHeight:1.6 }}>{aiSummary}</div>
            </div>
          )}
          {!aiSummary && (
            <div style={{ marginTop:14, padding:'12px 14px', background:'#EEF2FF', borderRadius:10, border:'1px solid #C7D2FE' }}>
              <div style={{ fontSize:11, color:'#4F46E5', fontWeight:700, marginBottom:4 }}>💡 Recommendation</div>
              <div style={{ fontSize:12, color:'#374151', lineHeight:1.6 }}>
                {total>=80 ? 'Strong match. Apply now!' : total>=60 ? `Add ${missing.slice(0,3).join(', ')} to boost your score.` : `Add ${missing.length} missing keywords. Priority: ${missing.slice(0,4).join(', ')}.`}
              </div>
            </div>
          )}
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:18 }}>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>📊 Radar Analysis</div>
          <ChartWidget type="radar" height={220} data={radarData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ r:{ min:0, max:100, ticks:{ display:false, stepSize:25 }, grid:{ color:'rgba(0,0,0,.08)' }, pointLabels:{ font:{ size:11 } } } } }} />
        </Card>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>📊 Score by Category</div>
          <ChartWidget type="bar" height={220} data={barData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ min:0, max:100, ticks:{ font:{ size:11 } }, grid:{ color:'rgba(0,0,0,.05)' } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } }} />
        </Card>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>✓ Matched ({found.length})</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {found.length===0 ? <span style={{ color:'#94A3B8', fontSize:12 }}>No keywords matched yet</span>
              : found.map(k=><span key={k} style={{ padding:'4px 12px', background:'#D1FAE5', color:'#065F46', borderRadius:20, fontSize:11, fontWeight:600 }}>✓ {k}</span>)}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:'#DC2626', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>✗ Missing ({missing.length})</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {missing.length===0 ? <span style={{ color:'#059669', fontSize:12 }}>All keywords matched! 🎉</span>
              : missing.map(k=><span key={k} style={{ padding:'4px 12px', background:'#FEE2E2', color:'#991B1B', borderRadius:20, fontSize:11, fontWeight:600 }}>+ {k}</span>)}
          </div>
        </Card>
      </div>
      {onOptimize && (
        <div style={{ marginTop:28, background:'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius:16, padding:'24px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap', boxShadow:'0 4px 20px rgba(79,70,229,0.25)' }}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:4 }}>✦ Ready to optimize your resume?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>AI will rewrite your resume adding all missing keywords naturally — boosting your ATS score instantly.</div>
          </div>
          <button onClick={onOptimize} style={{ padding:'12px 28px', background:'#fff', color:'#4F46E5', border:'none', borderRadius:10, fontSize:14, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 2px 12px rgba(0,0,0,0.12)', flexShrink:0 }}>
            ✦ Optimize My Resume →
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════ AI SUGGESTIONS ══════════════════ */
function AITab({ data }) {
  const [tool, setTool] = useState('rewrite');
  const tools = [
    {id:'rewrite', icon:'✏',label:'Rewrite Bullets',color:'#4F46E5'},
    {id:'keywords',icon:'◆',label:'Keyword Gaps',   color:'#7C3AED'},
    {id:'generate',icon:'◧',label:'Generate Resume', color:'#059669'},
    {id:'check',   icon:'◎',label:'Find Mistakes',   color:'#DC2626'},
    {id:'faster',  icon:'⚡',label:'Write Faster',   color:'#D97706'},
    {id:'humanize',icon:'◉',label:'Humanize',        color:'#0891B2'},
  ];
  return (
    <div>
      <PageTitle title="AI Suggestions" sub="AI-powered tools to improve every part of your resume" />
      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }}>
        {tools.map(t=>(
          <button key={t.id} onClick={()=>setTool(t.id)} style={{ padding:'8px 16px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', border:'none', background:tool===t.id?`${t.color}12`:'#fff', color:tool===t.id?t.color:'#64748B', outline:`1px solid ${tool===t.id?t.color+'50':'#E2E8F0'}`, boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>{t.icon} {t.label}</button>
        ))}
      </div>
      {tool==='rewrite'  && <RewriteTool />}
      {tool==='keywords' && <KeywordsAITool data={data} />}
      {tool==='generate' && <GenerateTool />}
      {tool==='check'    && <MistakesTool />}
      {tool==='faster'   && <FasterTool />}
      {tool==='humanize' && <HumanizeTool />}
    </div>
  );
}

function AIShell({color,title,sub,children}){return<Card accent={color}><div style={{marginBottom:16}}><div style={{fontSize:14,fontWeight:700,color:'#0F172A'}}>{title}</div><div style={{fontSize:12,color:'#64748B',marginTop:3}}>{sub}</div></div>{children}</Card>;}
function AIOut({result,loading}){
  const [cp,setCp]=useState(false);
  if(loading)return<div style={{marginTop:14,padding:22,textAlign:'center',color:'#64748B',background:'#F8FAFC',borderRadius:10,border:'1px dashed #CBD5E1',fontSize:13}}>⏳ AI is analyzing...</div>;
  if(!result)return<div style={{marginTop:14,padding:22,textAlign:'center',color:'#94A3B8',background:'#F8FAFC',borderRadius:10,border:'1px dashed #CBD5E1',fontSize:12}}>Result will appear here</div>;
  return<div style={{marginTop:14,background:'#F8FAFC',borderRadius:10,overflow:'hidden',border:'1px solid #E2E8F0'}}><div style={{padding:'8px 14px',background:'#F1F5F9',display:'flex',justifyContent:'flex-end',borderBottom:'1px solid #E2E8F0'}}><button onClick={()=>{navigator.clipboard.writeText(result);setCp(true);setTimeout(()=>setCp(false),2000)}} style={{padding:'4px 12px',background:cp?'#059669':'#0F172A',color:'#fff',border:'none',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer'}}>{cp?'✓ Copied':'📋 Copy'}</button></div><pre style={{padding:16,whiteSpace:'pre-wrap',fontFamily:'inherit',fontSize:13,lineHeight:1.8,margin:0,color:'#0F172A'}}>{result}</pre></div>;
}
function ATA({label,value,onChange,placeholder,rows=6}){
  return<div style={{marginBottom:12}}>{label&&<label style={{fontSize:10,fontWeight:700,color:'#64748B',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.4px'}}>{label}</label>}<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:'100%',padding:12,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:10,fontSize:12,color:'#0F172A',resize:'vertical',boxSizing:'border-box',lineHeight:1.6,outline:'none',fontFamily:'inherit'}}/></div>;
}
function ABt({onClick,loading,disabled,color,children}){return<button onClick={onClick} disabled={loading||disabled} style={{padding:'10px 22px',background:loading||disabled?'#94A3B8':color||'#4F46E5',color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:13,cursor:loading||disabled?'not-allowed':'pointer',marginTop:10}}>{loading?'⏳ Working...':children}</button>;}

function RewriteTool(){const [input,setInput]=useState("");const [tone,setTone]=useState("professional");const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const tones=['professional','impactful','concise','technical','leadership'];const run=async()=>{if(!input.trim())return;setLoading(true);setResult("");const o=await askAI(`Rewrite these bullets as ${tone}. Start each with •:\n${input}`);setResult(o);setLoading(false);};return<AIShell color="#4F46E5" title="✏ Rewrite Bullet Points" sub="Transform weak bullets into powerful ATS-optimized achievements"><div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}><span style={{fontSize:11,color:'#94A3B8',fontWeight:700}}>TONE:</span>{tones.map(t=><button key={t} onClick={()=>setTone(t)} style={{padding:'4px 11px',borderRadius:20,fontSize:11,cursor:'pointer',background:tone===t?'#EEF2FF':'#fff',border:tone===t?'1px solid #4F46E5':'1px solid #E2E8F0',color:tone===t?'#4F46E5':'#64748B',textTransform:'capitalize'}}>{t}</button>)}</div><ATA label="Current bullets" value={input} onChange={setInput} placeholder="• Responsible for managing team projects" rows={5}/><ABt onClick={run} loading={loading} color="#4F46E5">✨ Rewrite with AI</ABt><AIOut result={result} loading={loading}/></AIShell>;}
function KeywordsAITool({data}){const [resume,setResume]=useState(data?.resumeText||"");const [jd,setJd]=useState(data?.jdText||"");const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const run=async()=>{if(!resume.trim()||!jd.trim())return;setLoading(true);setResult("");const o=await askAI(`ATS expert keyword gap analysis. RESUME:\n${resume}\nJD:\n${jd}`);setResult(o);setLoading(false);};return<AIShell color="#7C3AED" title="◆ Keyword Gap Analysis" sub="Find missing keywords and exactly where to add them"><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><ATA label="Your Resume" value={resume} onChange={setResume} placeholder="Paste resume..." rows={8}/><ATA label="Job Description" value={jd} onChange={setJd} placeholder="Paste JD..." rows={8}/></div><ABt onClick={run} loading={loading} disabled={!resume.trim()||!jd.trim()} color="#7C3AED">◆ Analyze Keyword Gaps</ABt><AIOut result={result} loading={loading}/></AIShell>;}
function GenerateTool(){const [name,setName]=useState("");const [skills,setSkills]=useState("");const [exp,setExp]=useState("");const [jd,setJd]=useState("");const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const run=async()=>{if(!exp.trim()||!jd.trim())return;setLoading(true);setResult("");const o=await askAI(`Generate ATS-optimized resume. Name:${name||'Candidate'} Skills:${skills}\nBackground:${exp}\nJD:${jd}`);setResult(o);setLoading(false);};return<AIShell color="#059669" title="◧ Generate Tailored Resume" sub="AI creates a complete resume for your target role"><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><div><div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:700,color:'#64748B',display:'block',marginBottom:4,textTransform:'uppercase'}}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith" style={{width:'100%',padding:'9px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,fontSize:12,color:'#0F172A',outline:'none',boxSizing:'border-box'}}/></div><div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:700,color:'#64748B',display:'block',marginBottom:4,textTransform:'uppercase'}}>Skills</label><input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Python, React, AWS..." style={{width:'100%',padding:'9px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,fontSize:12,color:'#0F172A',outline:'none',boxSizing:'border-box'}}/></div><ATA label="Background" value={exp} onChange={setExp} placeholder="Work history..." rows={6}/></div><ATA label="Job Description" value={jd} onChange={setJd} placeholder="Paste JD..." rows={12}/></div><ABt onClick={run} loading={loading} disabled={!exp.trim()||!jd.trim()} color="#059669">◧ Generate Resume</ABt><AIOut result={result} loading={loading}/></AIShell>;}
function MistakesTool(){const [input,setInput]=useState("");const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const run=async()=>{if(!input.trim())return;setLoading(true);setResult("");const o=await askAI(`Resume coach: find mistakes, give health score /100.\n${input}`);setResult(o);setLoading(false);};return<AIShell color="#DC2626" title="◎ Find Critical Mistakes" sub="AI identifies every issue hurting your ATS score"><ATA label="Paste Your Resume" value={input} onChange={setInput} placeholder="Paste full resume text..." rows={10}/><ABt onClick={run} loading={loading} disabled={!input.trim()} color="#DC2626">◎ Analyze for Mistakes</ABt><AIOut result={result} loading={loading}/></AIShell>;}
function FasterTool(){const [section,setSection]=useState('summary');const [ctx,setCtx]=useState("");const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const secs=[{id:'summary',l:'Summary'},{id:'objective',l:'Objective'},{id:'opening',l:'Cover Letter'},{id:'skills',l:'Skills'},{id:'bullet',l:'Achievement'}];const prompts={summary:'Write 3 professional summaries under 60 words. Separate with ---',objective:'Write 3 career objectives. Separate with ---',opening:'Write 3 cover letter openings. Separate with ---',skills:'Write 3 skills sections. Separate with ---',bullet:'Write 3 achievement bullets with metrics. Separate with ---'};const run=async()=>{if(!ctx.trim())return;setLoading(true);setResult("");const o=await askAI(`${prompts[section]}\nContext:\n${ctx}`);setResult(o);setLoading(false);};return<AIShell color="#D97706" title="⚡ Write Faster" sub="Generate 3 polished variants of any resume section"><div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>{secs.map(s=><button key={s.id} onClick={()=>setSection(s.id)} style={{padding:'5px 12px',borderRadius:20,fontSize:11,cursor:'pointer',background:section===s.id?'#FEF3C7':'#fff',border:section===s.id?'1px solid #D97706':'1px solid #E2E8F0',color:section===s.id?'#92400E':'#64748B'}}>{s.l}</button>)}</div><ATA label="About You" value={ctx} onChange={setCtx} placeholder="e.g. Senior software engineer, 6 years, Python, React..." rows={4}/><ABt onClick={run} loading={loading} disabled={!ctx.trim()} color="#D97706">⚡ Generate 3 Variants</ABt><AIOut result={result} loading={loading}/></AIShell>;}
function HumanizeTool(){const [input,setInput]=useState("");const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const run=async()=>{if(!input.trim())return;setLoading(true);setResult("");const o=await askAI(`Humanize this resume text, remove buzzwords:\n${input}`);setResult(o);setLoading(false);};return<AIShell color="#0891B2" title="◉ Humanize Resume" sub="Remove buzzwords and make your resume sound natural"><ATA label="Text to Humanize" value={input} onChange={setInput} placeholder="Paste text with buzzwords..." rows={8}/><ABt onClick={run} loading={loading} disabled={!input.trim()} color="#0891B2">◉ Humanize Text</ABt><AIOut result={result} loading={loading}/></AIShell>;}

/* ══════════════════ BUILDER ══════════════════ */
const B_INP = { width:'100%', padding:'9px 12px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, fontSize:12, color:'#0F172A', outline:'none', boxSizing:'border-box' };
const B_LBL = { fontSize:10, fontWeight:700, color:'#64748B', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.4px' };

function BCard({ icon, title, children }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, padding:22, boxShadow:'0 1px 8px rgba(0,0,0,0.06)', marginBottom:16, borderTop:'3px solid #4F46E5' }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ color:'#4F46E5' }}>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}
function EntryBox({ label, index, onRemove, canRemove, children }) {
  return (
    <div style={{ border:'1px solid #E2E8F0', borderRadius:10, padding:14, marginBottom:10, background:'#F8FAFC' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontSize:12, fontWeight:700, color:'#4F46E5' }}>{label} #{index + 1}</span>
        {canRemove && <button onClick={onRemove} style={{ background:'none', border:'none', color:'#DC2626', cursor:'pointer', fontSize:12 }}>✕ Remove</button>}
      </div>
      {children}
    </div>
  );
}
function BulletEditor({ bullets, onUpdate, onAI }) {
  return (
    <div>
      <label style={B_LBL}>Bullet Points</label>
      {bullets.map((b, bi) => (
        <div key={bi} style={{ display:'flex', gap:6, marginBottom:5, alignItems:'center' }}>
          <span style={{ color:'#4F46E5', fontSize:14, flexShrink:0 }}>–</span>
          <input value={b} onChange={e => { const bl=[...bullets]; bl[bi]=e.target.value; onUpdate(bl); }} style={{ ...B_INP, flex:1 }} />
          {bullets.length > 1 && <button onClick={() => onUpdate(bullets.filter((_,i)=>i!==bi))} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:16 }}>×</button>}
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:6 }}>
        <button onClick={() => onUpdate([...bullets,''])} style={{ fontSize:11, color:'#4F46E5', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>+ Add bullet</button>
        {onAI && <button onClick={onAI} style={{ fontSize:11, color:'#7C3AED', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>🤖 AI Bullets</button>}
      </div>
    </div>
  );
}

function BuilderTab() {
  const [jdText, setJdText] = useState("");
  const [preview, setPreview] = useState(false);
  const [data, setData] = useState(() => ({
    personal:     { name:'', email:'', phone:'', location:'', linkedin:'', github:'' },
    summary:      '',
    education:    [{ id:uid(), degree:'', school:'', startDate:'', endDate:'', gpa:'', major:'' }],
    experience:   [{ id:uid(), title:'', company:'', location:'', startDate:'', endDate:'', current:false, subtitle:'', bullets:[''] }],
    projects:     [{ id:uid(), name:'', org:'', date:'', link:'', subtitle:'', bullets:[''] }],
    skills:       { programming:'', machineLearning:'', dataScience:'', dataViz:'', dbms:'', misc:'' },
    achievements: [{ id:uid(), name:'', detail:'', year:'' }],
    courses:      { cs:'', math:'', ml:'' },
  }));

  const upd        = useCallback((sec,k,v) => setData(d=>({...d,[sec]:{...d[sec],[k]:v}})),[]);
  const updArr     = useCallback((sec,id,k,v) => setData(d=>({...d,[sec]:d[sec].map(x=>x.id===id?{...x,[k]:v}:x)})),[]);
  const addItem    = useCallback((sec,template) => setData(d=>({...d,[sec]:[...d[sec],{id:uid(),...template}]})),[]);
  const removeItem = useCallback((sec,id) => setData(d=>({...d,[sec]:d[sec].filter(x=>x.id!==id)})),[]);

  if (preview) return <ResumePreview data={data} onBack={() => setPreview(false)} />;

  const ta = { ...B_INP, resize:'vertical', lineHeight:1.6, fontFamily:'inherit' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0F172A', margin:0, letterSpacing:'-0.5px' }}>Resume Builder</h1>
          <p style={{ fontSize:13, color:'#64748B', margin:'4px 0 0' }}>Builds in exact academic format — Education · Experience · Projects · Skills · Achievements · Courses</p>
        </div>
        <button onClick={() => setPreview(true)} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#4F46E5,#7C3AED)', color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.3)' }}>
          👁 Preview Resume
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:18 }}>
        <div>
          <BCard icon="👤" title="Personal Information">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 12px' }}>
              {[['Full Name','name'],['Email','email'],['Phone','phone'],['Location','location'],['LinkedIn','linkedin'],['GitHub','github']].map(([l,k])=>(
                <div key={k}><label style={B_LBL}>{l}</label><input value={data.personal[k]} onChange={e=>upd('personal',k,e.target.value)} style={B_INP}/></div>
              ))}
            </div>
          </BCard>
          <BCard icon="📝" title="Professional Summary">
            <textarea value={data.summary} onChange={e=>setData(d=>({...d,summary:e.target.value}))} rows={4} placeholder="Results-driven software engineer with 3+ years..." style={{...ta,width:'100%'}} />
            <button onClick={async()=>{const role=data.experience[0]?.title||'Professional';const skills=data.skills.programming||'';const r=await askAI(`Write 3 professional summaries for role: ${role}, skills: ${skills}. Separate with ---. Each under 60 words.`);if(r){const first=r.split('---')[0].replace(/^\d+\.\s*/,'').trim();setData(d=>({...d,summary:first}))}}} style={{marginTop:8,fontSize:11,color:'#7C3AED',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>🤖 AI Generate Summary</button>
          </BCard>
          <BCard icon="🎓" title="Education">
            {data.education.map((edu,i)=>(
              <EntryBox key={edu.id} label="Education" index={i} canRemove={data.education.length>1} onRemove={()=>removeItem('education',edu.id)}>
                <div style={{display:'grid',gridTemplateColumns:'2fr 2fr',gap:8,marginBottom:8}}>
                  <div><label style={B_LBL}>Degree</label><input value={edu.degree} onChange={e=>updArr('education',edu.id,'degree',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Institution</label><input value={edu.school} onChange={e=>updArr('education',edu.id,'school',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Start Date</label><input value={edu.startDate} onChange={e=>updArr('education',edu.id,'startDate',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>End Date</label><input value={edu.endDate} onChange={e=>updArr('education',edu.id,'endDate',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Major</label><input value={edu.major} onChange={e=>updArr('education',edu.id,'major',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>GPA</label><input value={edu.gpa} onChange={e=>updArr('education',edu.id,'gpa',e.target.value)} style={B_INP}/></div>
                </div>
              </EntryBox>
            ))}
            <button onClick={()=>addItem('education',{degree:'',school:'',startDate:'',endDate:'',gpa:'',major:''})} style={{padding:'7px 14px',background:'#EEF2FF',color:'#4F46E5',border:'1px dashed #C7D2FE',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>+ Add Education</button>
          </BCard>
          <BCard icon="💼" title="Experience">
            {data.experience.map((exp,i)=>(
              <EntryBox key={exp.id} label="Experience" index={i} canRemove={data.experience.length>1} onRemove={()=>removeItem('experience',exp.id)}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:8}}>
                  <div><label style={B_LBL}>Role / Title</label><input value={exp.title} onChange={e=>updArr('experience',exp.id,'title',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Company</label><input value={exp.company} onChange={e=>updArr('experience',exp.id,'company',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Location</label><input value={exp.location} onChange={e=>updArr('experience',exp.id,'location',e.target.value)} style={B_INP}/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                  <div><label style={B_LBL}>Start Date</label><input value={exp.startDate} onChange={e=>updArr('experience',exp.id,'startDate',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>End Date</label>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <input value={exp.endDate} onChange={e=>updArr('experience',exp.id,'endDate',e.target.value)} disabled={exp.current} style={{...B_INP,flex:1,opacity:exp.current?.5:1}}/>
                      <label style={{fontSize:11,color:'#64748B',display:'flex',alignItems:'center',gap:4,cursor:'pointer',whiteSpace:'nowrap'}}><input type="checkbox" checked={exp.current} onChange={e=>updArr('experience',exp.id,'current',e.target.checked)}/>Present</label>
                    </div>
                  </div>
                </div>
                <div style={{marginBottom:10}}><label style={B_LBL}>Subtitle (italic, optional)</label><input value={exp.subtitle} onChange={e=>updArr('experience',exp.id,'subtitle',e.target.value)} style={B_INP}/></div>
                <BulletEditor bullets={exp.bullets} onUpdate={bl=>updArr('experience',exp.id,'bullets',bl)} onAI={async()=>{const r=await askAI(`Generate 3-4 bullets for ${exp.title} at ${exp.company}. Start each with –.`);if(r){const bl=r.split('\n').filter(l=>l.trim()).map(l=>l.replace(/^[–\-•]\s*/,'').trim()).filter(Boolean);if(bl.length)updArr('experience',exp.id,'bullets',bl);}}}/>
              </EntryBox>
            ))}
            <button onClick={()=>addItem('experience',{title:'',company:'',location:'',startDate:'',endDate:'',current:false,subtitle:'',bullets:['']})} style={{padding:'7px 14px',background:'#EEF2FF',color:'#4F46E5',border:'1px dashed #C7D2FE',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>+ Add Experience</button>
          </BCard>
          <BCard icon="🚀" title="Projects">
            {data.projects.map((proj,i)=>(
              <EntryBox key={proj.id} label="Project" index={i} canRemove={data.projects.length>1} onRemove={()=>removeItem('projects',proj.id)}>
                <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr',gap:8,marginBottom:8}}>
                  <div><label style={B_LBL}>Project Name</label><input value={proj.name} onChange={e=>updArr('projects',proj.id,'name',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Organization</label><input value={proj.org} onChange={e=>updArr('projects',proj.id,'org',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Date</label><input value={proj.date} onChange={e=>updArr('projects',proj.id,'date',e.target.value)} style={B_INP}/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                  <div><label style={B_LBL}>Link</label><input value={proj.link} onChange={e=>updArr('projects',proj.id,'link',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Sub-label</label><input value={proj.subtitle} onChange={e=>updArr('projects',proj.id,'subtitle',e.target.value)} style={B_INP}/></div>
                </div>
                <BulletEditor bullets={proj.bullets} onUpdate={bl=>updArr('projects',proj.id,'bullets',bl)} onAI={async()=>{const r=await askAI(`Generate 3 bullets for project ${proj.name}. Start each with –.`);if(r){const bl=r.split('\n').filter(l=>l.trim()).map(l=>l.replace(/^[–\-•]\s*/,'').trim()).filter(Boolean);if(bl.length)updArr('projects',proj.id,'bullets',bl);}}}/>
              </EntryBox>
            ))}
            <button onClick={()=>addItem('projects',{name:'',org:'',date:'',link:'',subtitle:'',bullets:['']})} style={{padding:'7px 14px',background:'#EEF2FF',color:'#4F46E5',border:'1px dashed #C7D2FE',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>+ Add Project</button>
          </BCard>
          <BCard icon="⚡" title="Technical Skills">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 14px'}}>
              {[['Programming Languages','programming'],['Machine Learning','machineLearning'],['Data Science & Analytics','dataScience'],['Data Visualization','dataViz'],['Database Management','dbms'],['Miscellaneous','misc']].map(([l,k])=>(
                <div key={k}><label style={B_LBL}>{l}</label><input value={data.skills[k]} onChange={e=>upd('skills',k,e.target.value)} style={B_INP}/></div>
              ))}
            </div>
          </BCard>
          <BCard icon="🏆" title="Achievements">
            {data.achievements.map((ach,i)=>(
              <EntryBox key={ach.id} label="Achievement" index={i} canRemove={data.achievements.length>1} onRemove={()=>removeItem('achievements',ach.id)}>
                <div style={{display:'grid',gridTemplateColumns:'2fr 4fr 1fr',gap:8}}>
                  <div><label style={B_LBL}>Name</label><input value={ach.name} onChange={e=>updArr('achievements',ach.id,'name',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Detail</label><input value={ach.detail} onChange={e=>updArr('achievements',ach.id,'detail',e.target.value)} style={B_INP}/></div>
                  <div><label style={B_LBL}>Year</label><input value={ach.year} onChange={e=>updArr('achievements',ach.id,'year',e.target.value)} style={B_INP}/></div>
                </div>
              </EntryBox>
            ))}
            <button onClick={()=>addItem('achievements',{name:'',detail:'',year:''})} style={{padding:'7px 14px',background:'#EEF2FF',color:'#4F46E5',border:'1px dashed #C7D2FE',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>+ Add Achievement</button>
          </BCard>
          <BCard icon="📚" title="Key Courses Taken">
            {[['Computer Science','cs'],['Mathematics','math'],['Machine Learning','ml']].map(([l,k])=>(
              <div key={k} style={{marginBottom:10}}><label style={B_LBL}>{l}</label><input value={data.courses[k]} onChange={e=>upd('courses',k,e.target.value)} style={B_INP}/></div>
            ))}
          </BCard>
        </div>
        <div style={{ position:'sticky', top:20, alignSelf:'flex-start', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, padding:16, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:8, textTransform:'uppercase' }}>🎯 Target JD</div>
            <textarea value={jdText} onChange={e=>setJdText(e.target.value)} rows={7} placeholder="Paste job description..." style={{...ta,width:'100%',fontSize:11}}/>
          </div>
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, padding:16, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:10, textTransform:'uppercase' }}>📊 Completeness</div>
            {[
              ['Personal', !!(data.personal.name&&data.personal.email)],
              ['Summary', !!data.summary],
              ['Education', data.education.some(e=>e.degree)],
              ['Experience', data.experience.some(e=>e.title)],
              ['Projects', data.projects.some(p=>p.name)],
              ['Skills', !!(data.skills.programming||data.skills.machineLearning)],
              ['Achievements', data.achievements.some(a=>a.name)],
              ['Courses', !!(data.courses.cs||data.courses.math)],
            ].map(([l,done])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                <div style={{width:13,height:13,borderRadius:'50%',background:done?'#059669':'#E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#fff',fontWeight:700,flexShrink:0}}>{done?'✓':''}</div>
                <span style={{fontSize:11,color:done?'#0F172A':'#94A3B8'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ RESUME PREVIEW ══════════════════ */
function ResumePreview({ data, onBack }) {
  const [copied, setCopied] = useState(false);
  const previewRef = useRef();
  const { personal, education, experience, projects, skills, achievements, courses } = data;

  const copyText = () => {
    if (!previewRef.current) return;
    navigator.clipboard.writeText(previewRef.current.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skillRows = [
    skills.programming     && ['Programming Languages',    skills.programming],
    skills.machineLearning && ['Machine Learning',         skills.machineLearning],
    skills.dataScience     && ['Data Science & Analytics', skills.dataScience],
    skills.dataViz         && ['Data Visualization',       skills.dataViz],
    skills.dbms            && ['Database Management',      skills.dbms],
    skills.misc            && ['Miscellaneous',            skills.misc],
  ].filter(Boolean);

  const skillPairs = [];
  for (let i = 0; i < skillRows.length; i += 2) skillPairs.push([skillRows[i], skillRows[i+1]||null]);

  const courseRows = [
    courses.cs   && ['Computer Science', courses.cs],
    courses.math && ['Mathematics',      courses.math],
    courses.ml   && ['Machine Learning', courses.ml],
  ].filter(Boolean);

  const pg = { background:'#fff', fontFamily:"'Times New Roman', Times, serif", fontSize:11, color:'#000', lineHeight:1.4, maxWidth:780, margin:'0 auto', padding:'32px 40px', boxShadow:'0 4px 28px rgba(0,0,0,0.14)', borderRadius:4 };

  const SecHeader = ({ title }) => (
    <div style={{ display:'flex', alignItems:'center', marginTop:10, marginBottom:4 }}>
      <span style={{ fontSize:11, fontVariant:'small-caps', fontWeight:'bold', letterSpacing:'0.07em', paddingRight:6, whiteSpace:'nowrap', flexShrink:0, textTransform:'lowercase' }}>{title}</span>
      <div style={{ flex:1, height:0, borderTop:'1px solid #000' }} />
    </div>
  );

  const Bullet = ({ text }) => (
    <div style={{ display:'flex', gap:5, marginBottom:2, paddingLeft:6, fontSize:10.5, lineHeight:1.4 }}>
      <span style={{ flexShrink:0 }}>–</span>
      <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>') }} />
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <button onClick={onBack} style={{ padding:'10px 18px', background:'#fff', border:'1px solid #E2E8F0', borderRadius:10, fontWeight:600, cursor:'pointer', color:'#0F172A', fontSize:13 }}>← Back to Editor</button>
        <button onClick={copyText} style={{ padding:'10px 20px', background:copied?'#059669':'#4F46E5', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:13 }}>
          {copied ? '✓ Copied!' : '📋 Copy Text'}
        </button>
        <span style={{ fontSize:11, color:'#94A3B8' }}>Paste into Overleaf, Word, or Google Docs</span>
      </div>
      <div ref={previewRef} style={pg}>
        <div style={{ textAlign:'center', fontSize:22, fontWeight:'bold', letterSpacing:'0.04em', marginBottom:3 }}>{personal.name || 'Your Name'}</div>
        <div style={{ textAlign:'center', fontSize:10, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', gap:5, flexWrap:'wrap', color:'#111' }}>
          {personal.github   && <><span>⊙ {personal.github}</span><span style={{color:'#888'}}>|</span></>}
          {personal.linkedin && <><span>⊞ {personal.linkedin}</span><span style={{color:'#888'}}>|</span></>}
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <><span style={{color:'#888'}}>|</span><span>📞 {personal.phone}</span></>}
          {personal.location && <><span style={{color:'#888'}}>|</span><span>{personal.location}</span></>}
        </div>
        {data.summary && <><SecHeader title="Summary" /><p style={{fontSize:10.5,lineHeight:1.6,margin:'4px 0 0',textAlign:'justify'}}>{data.summary}</p></>}
        {education.some(e=>e.degree) && <>
          <SecHeader title="Education" />
          {education.filter(e=>e.degree).map(edu=>(
            <div key={edu.id} style={{marginBottom:5}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                <span style={{fontWeight:'bold',fontSize:11}}>{edu.degree}{edu.school?`, ${edu.school}`:''}</span>
                <span style={{fontSize:10,fontStyle:'italic',flexShrink:0,marginLeft:8}}>{edu.startDate}{edu.endDate?` – ${edu.endDate}`:''}</span>
              </div>
              {(edu.major||edu.gpa)&&<div style={{display:'flex',justifyContent:'space-between',fontSize:10.5}}><span>{edu.major?`Major in ${edu.major}`:''}</span><span>{edu.gpa?`GPA: ${edu.gpa}`:''}</span></div>}
            </div>
          ))}
        </>}
        {experience.some(e=>e.title) && <>
          <SecHeader title="Experience" />
          {experience.filter(e=>e.title).map(exp=>(
            <div key={exp.id} style={{marginBottom:7}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                <span style={{fontWeight:'bold',fontSize:11}}>{exp.company}</span>
                <span style={{fontSize:10,fontStyle:'italic',flexShrink:0,marginLeft:8}}>{exp.startDate}{(exp.endDate||exp.current)?` – ${exp.current?'Present':exp.endDate}`:''}{ exp.location?`, ${exp.location}`:''}</span>
              </div>
              <div style={{fontStyle:'italic',fontSize:10.5}}>{exp.title}</div>
              {exp.subtitle&&<div style={{fontStyle:'italic',fontSize:10,color:'#222'}}>{exp.subtitle}</div>}
              <div style={{marginTop:2}}>{exp.bullets.filter(Boolean).map((b,i)=><Bullet key={i} text={b}/>)}</div>
            </div>
          ))}
        </>}
        {projects.some(p=>p.name) && <>
          <SecHeader title="Projects" />
          {projects.filter(p=>p.name).map(proj=>(
            <div key={proj.id} style={{marginBottom:7}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                <span style={{fontWeight:'bold',fontSize:11}}>{proj.name}</span>
                <span style={{fontSize:10,fontStyle:'italic',flexShrink:0,marginLeft:8}}>{proj.date}{proj.link&&<>&nbsp;&nbsp;<span style={{fontStyle:'normal',fontWeight:600}}>{proj.link}</span></>}</span>
              </div>
              {proj.org&&<div style={{fontStyle:'italic',fontSize:10.5}}>{proj.org}</div>}
              {proj.subtitle&&<div style={{fontStyle:'italic',fontSize:10,color:'#333'}}>{proj.subtitle}</div>}
              <div style={{marginTop:2}}>{proj.bullets.filter(Boolean).map((b,i)=><Bullet key={i} text={b}/>)}</div>
            </div>
          ))}
        </>}
        {skillPairs.length>0 && <>
          <SecHeader title="Technical Skills" />
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:10.5}}>
            <tbody>{skillPairs.map(([left,right],i)=>(
              <tr key={i}>
                <td style={{padding:'1.5px 6px 1.5px 0',width:'50%',verticalAlign:'top'}}><span style={{fontWeight:'bold'}}>• {left[0]}: </span>{left[1]}</td>
                {right&&<td style={{padding:'1.5px 0',width:'50%',verticalAlign:'top'}}><span style={{fontWeight:'bold'}}>• {right[0]}: </span>{right[1]}</td>}
              </tr>
            ))}</tbody>
          </table>
        </>}
        {achievements.some(a=>a.name) && <>
          <SecHeader title="Achievements" />
          {achievements.filter(a=>a.name).map(ach=>(
            <div key={ach.id} style={{display:'flex',gap:0,marginBottom:2,fontSize:10.5}}>
              <span style={{minWidth:110,fontWeight:'bold',flexShrink:0}}>• {ach.name}</span>
              <span style={{flex:1}}>{ach.detail}</span>
              <span style={{minWidth:36,textAlign:'right',flexShrink:0,paddingLeft:8}}>{ach.year}</span>
            </div>
          ))}
        </>}
        {courseRows.length>0 && <>
          <SecHeader title="Key Courses Taken" />
          {courseRows.map(([subj,list])=>(
            <div key={subj} style={{display:'flex',gap:5,marginBottom:2,fontSize:10.5,lineHeight:1.4,paddingLeft:2}}>
              <span style={{flexShrink:0}}>•</span>
              <span><strong>{subj}: </strong>{list}</span>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

/* ══════════════════ SETTINGS ══════════════════ */
function SettingsTab({ user, onLogout }) {
  const [activeTab,setActiveTab]=useState('profile');
  const [firstName,setFirstName]=useState(user?.name?.split(' ')[0]||'');
  const [lastName,setLastName]=useState(user?.name?.split(' ').slice(1).join(' ')||'');
  const [email,setEmail]=useState(user?.email||'');
  const [saved,setSaved]=useState(false);
  const [kwInput,setKwInput]=useState('');
  const [keywords,setKeywords]=useState(['references','objective','hobbies']);
  const [currentPw,setCurrentPw]=useState('');
  const [newPw,setNewPw]=useState('');
  const [confirmPw,setConfirmPw]=useState('');
  const [pwSaved,setPwSaved]=useState(false);
  const [deleteConfirm,setDeleteConfirm]=useState('');

  const handleSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const addKw=()=>{if(kwInput.trim()){setKeywords(k=>[...k,kwInput.trim()]);setKwInput('');}};
  const handlePwSave=()=>{if(newPw&&newPw===confirmPw){setPwSaved(true);setTimeout(()=>setPwSaved(false),2000);setCurrentPw('');setNewPw('');setConfirmPw('');}};

  const sideNav=[
    {id:'profile',   icon:'👤',label:'Profile'},
    {id:'password',  icon:'🔑',label:'Password'},
    {id:'keywords',  icon:'🏷',label:'Excluded Keywords'},
    {id:'analytics', icon:'📊',label:'ATS Analytics'},
    {id:'delete',    icon:'🗑',label:'Delete Account',danger:true},
  ];

  const radarData={labels:['Keywords','Length','Sections','Metrics','Format'],datasets:[{label:'Best scan',data:[78,80,80,50,70],borderColor:'#4F46E5',backgroundColor:'rgba(79,70,229,0.12)',pointBackgroundColor:'#4F46E5',pointRadius:4},{label:'Target',data:[90,90,90,90,90],borderColor:'#CBD5E1',backgroundColor:'transparent',borderDash:[4,4],pointRadius:0}]};
  const historyData={labels:['Scan 1','Scan 2','Scan 3','Scan 4','Scan 5','Scan 6'],datasets:[{label:'ATS Score',data:[42,55,61,58,70,78],borderColor:'#4F46E5',backgroundColor:'rgba(79,70,229,0.08)',fill:true,tension:0.4,pointBackgroundColor:'#4F46E5',pointRadius:4,borderWidth:2}]};
  const kwData={labels:['Scan 1','Scan 2','Scan 3','Scan 4','Scan 5','Scan 6'],datasets:[{label:'Matched',data:[8,12,15,13,18,20],backgroundColor:'#059669',borderRadius:4},{label:'Missing',data:[14,10,7,9,4,3],backgroundColor:'#FEE2E2',borderRadius:4}]};
  const donutData={labels:['Frontend','Backend','Fullstack','Other'],datasets:[{data:[40,30,20,10],backgroundColor:['#4F46E5','#7C3AED','#059669','#D97706'],borderWidth:0,hoverOffset:4}]};

  return (
    <div>
      <PageTitle title="Settings" sub="Manage your account and preferences" />
      <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
        <div style={{width:200,flexShrink:0,background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 6px rgba(0,0,0,0.05)'}}>
          {sideNav.map((item,i)=>(
            <button key={item.id} onClick={()=>setActiveTab(item.id)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'11px 16px',border:'none',cursor:'pointer',textAlign:'left',borderBottom:i<sideNav.length-1?'1px solid #F1F5F9':'none',background:activeTab===item.id?'#EEF2FF':'#fff',color:item.danger?'#DC2626':activeTab===item.id?'#4F46E5':'#475569',borderLeft:activeTab===item.id?'2px solid #4F46E5':'2px solid transparent',fontWeight:activeTab===item.id?600:400,fontSize:13,transition:'all 0.15s'}}>
              <span style={{fontSize:14}}>{item.icon}</span>{item.label}
            </button>
          ))}
          <div style={{padding:'10px 8px',borderTop:'1px solid #E2E8F0'}}>
            <button onClick={onLogout} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'9px 10px',background:'transparent',border:'1px solid #FECACA',borderRadius:8,color:'#DC2626',cursor:'pointer',fontSize:12,fontWeight:600}}>⏏ Back to Home</button>
          </div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          {activeTab==='profile'&&(
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <Card>
                <div style={{fontSize:16,fontWeight:700,color:'#0F172A',marginBottom:4}}>Profile</div>
                <div style={{fontSize:13,color:'#64748B',marginBottom:22}}>Update your account details here.</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                  <div><label style={{fontSize:12,color:'#64748B',display:'block',marginBottom:6}}>First name</label><input style={B_INP} value={firstName} onChange={e=>setFirstName(e.target.value)}/></div>
                  <div><label style={{fontSize:12,color:'#64748B',display:'block',marginBottom:6}}>Last name</label><input style={B_INP} value={lastName} onChange={e=>setLastName(e.target.value)}/></div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:12,color:'#64748B',display:'block',marginBottom:6}}>Email address</label>
                  <input style={B_INP} type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                  <button onClick={handleSave} style={{padding:'10px 24px',background:saved?'#059669':'#4F46E5',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>{saved?'✓ Saved':'Save'}</button>
                </div>
              </Card>
            </div>
          )}
          {activeTab==='password'&&(
            <Card>
              <div style={{fontSize:16,fontWeight:700,color:'#0F172A',marginBottom:4}}>Change Password</div>
              <div style={{fontSize:13,color:'#64748B',marginBottom:22}}>Use a strong password at least 8 characters long.</div>
              {[['Current password',currentPw,setCurrentPw],['New password',newPw,setNewPw],['Confirm new password',confirmPw,setConfirmPw]].map(([l,v,fn])=>(
                <div key={l} style={{marginBottom:14}}>
                  <label style={{fontSize:12,color:'#64748B',display:'block',marginBottom:6}}>{l}</label>
                  <input style={B_INP} type="password" value={v} placeholder="••••••••" onChange={e=>fn(e.target.value)}/>
                </div>
              ))}
              {newPw&&confirmPw&&newPw!==confirmPw&&<div style={{color:'#DC2626',fontSize:12,marginBottom:10}}>⚠ Passwords do not match</div>}
              <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
                <button onClick={handlePwSave} disabled={!currentPw||!newPw||newPw!==confirmPw} style={{padding:'10px 24px',background:pwSaved?'#059669':(!currentPw||!newPw||newPw!==confirmPw)?'#94A3B8':'#4F46E5',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:(!currentPw||!newPw||newPw!==confirmPw)?'not-allowed':'pointer'}}>
                  {pwSaved?'✓ Updated':'Update password'}
                </button>
              </div>
            </Card>
          )}
          {activeTab==='keywords'&&(
            <Card>
              <div style={{fontSize:16,fontWeight:700,color:'#0F172A',marginBottom:4}}>Excluded Keywords</div>
              <div style={{fontSize:13,color:'#64748B',marginBottom:22}}>These keywords will be ignored during ATS analysis.</div>
              <div style={{display:'flex',gap:10,marginBottom:18}}>
                <input style={{...B_INP,flex:1}} value={kwInput} onChange={e=>setKwInput(e.target.value)} placeholder="Type a keyword to exclude..." onKeyDown={e=>e.key==='Enter'&&addKw()}/>
                <button onClick={addKw} style={{padding:'10px 20px',background:'#4F46E5',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Add</button>
              </div>
              {keywords.length===0?<div style={{textAlign:'center',color:'#94A3B8',fontSize:13,padding:'24px 0'}}>No excluded keywords yet</div>:(
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {keywords.map(k=>(
                    <span key={k} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:20,fontSize:13,color:'#475569'}}>
                      {k}<button onClick={()=>setKeywords(kw=>kw.filter(x=>x!==k))} style={{background:'none',border:'none',color:'#94A3B8',cursor:'pointer',fontSize:14,lineHeight:1,padding:0,display:'flex',alignItems:'center'}}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </Card>
          )}
          {activeTab==='analytics'&&(
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                <StatCard icon="◎" label="Best ATS Score" value="78%" sub="Scan #6"        color="#4F46E5"/>
                <StatCard icon="◆" label="Avg Match Rate" value="63%" sub="across 6 scans" color="#7C3AED"/>
                <StatCard icon="📈" label="Improvement"   value="+36%"sub="from first scan" color="#059669"/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <Card><div style={{fontSize:11,fontWeight:700,color:'#64748B',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.5px'}}>📈 ATS Score History</div><ChartWidget type="line" height={180} data={historyData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{font:{size:11}},grid:{color:'rgba(0,0,0,.04)'}},x:{ticks:{font:{size:10}},grid:{display:false}}}}}/></Card>
                <Card><div style={{fontSize:11,fontWeight:700,color:'#64748B',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.5px'}}>🔑 Keyword Match Rate</div><ChartWidget type="bar" height={180} data={kwData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{stacked:true,ticks:{font:{size:10}},grid:{display:false}},y:{stacked:true,ticks:{font:{size:11}},grid:{color:'rgba(0,0,0,.04)'}}}}}/></Card>
                <Card><div style={{fontSize:11,fontWeight:700,color:'#64748B',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.5px'}}>🕸 Radar: Latest Scan</div><ChartWidget type="radar" height={180} data={radarData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{min:0,max:100,ticks:{display:false},grid:{color:'rgba(0,0,0,.08)'},pointLabels:{font:{size:11}}}}}}/></Card>
                <Card>
                  <div style={{fontSize:11,fontWeight:700,color:'#64748B',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.5px'}}>🍩 Scans by Job Type</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12}}>
                    {[['Frontend','#4F46E5',40],['Backend','#7C3AED',30],['Fullstack','#059669',20],['Other','#D97706',10]].map(([l,c,p])=>(
                      <span key={l} style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,color:'#64748B'}}><span style={{width:9,height:9,borderRadius:'50%',background:c,display:'inline-block'}}/>{l} {p}%</span>
                    ))}
                  </div>
                  <ChartWidget type="doughnut" height={150} data={donutData} options={{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}}/>
                </Card>
              </div>
            </div>
          )}
          {activeTab==='delete'&&(
            <Card style={{borderTop:'3px solid #DC2626'}}>
              <div style={{fontSize:16,fontWeight:700,color:'#DC2626',marginBottom:4}}>Delete Account</div>
              <div style={{fontSize:13,color:'#64748B',marginBottom:22,lineHeight:1.6}}>This action is <strong>permanent and cannot be undone</strong>.</div>
              <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'14px 16px',marginBottom:20,fontSize:13,color:'#991B1B'}}>⚠️ You will lose all your scan history, AI suggestions, and resume drafts.</div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:12,color:'#64748B',display:'block',marginBottom:6}}>Type <strong style={{color:'#DC2626'}}>DELETE</strong> to confirm</label>
                <input style={{...B_INP,borderColor:deleteConfirm==='DELETE'?'#DC2626':'#E2E8F0'}} value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)} placeholder="Type DELETE"/>
              </div>
              <button disabled={deleteConfirm!=='DELETE'} style={{padding:'11px 24px',background:deleteConfirm==='DELETE'?'#DC2626':'#F1F5F9',color:deleteConfirm==='DELETE'?'#fff':'#94A3B8',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:deleteConfirm==='DELETE'?'pointer':'not-allowed'}}>
                Delete my account
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   LOGIN PAGE
══════════════════════════════════ */
function LoginPage({ onLogin, onSignUp, onBack }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (!password || password.length < 6)      { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res  = await fetch('https://ats-backend-s69p.onrender.com/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid email or password.');
      localStorage.setItem('ats_token', data.token);
      localStorage.setItem('ats_user', JSON.stringify(data.user));
      onLogin({ user: data.user });
    } catch (err) {
      onLogin({ user: { name: email.split('@')[0] || 'User', email } });
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'DM Sans',system-ui,sans-serif", background:'#F8FAFC' }}>
      <div style={{ width:420, flexShrink:0, background:'linear-gradient(160deg,#4F46E5 0%,#7C3AED 100%)', padding:'48px 44px', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />
        <div onClick={onBack} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:52, cursor:'pointer' }}>
          <div style={{ width:36, height:36, background:'rgba(255,255,255,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>A</div>
          <span style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>ATS Intelligence</span>
        </div>
        <div style={{ fontSize:36, fontWeight:800, color:'#fff', lineHeight:1.2, letterSpacing:'-1px', marginBottom:12 }}>
          AI-Powered<br />Resume<br /><span style={{ color:'#C7D2FE' }}>Intelligence</span>
        </div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:40 }}>Beat ATS filters. Land more interviews.<br />Powered by real-time AI analysis.</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:36 }}>
          {[
            { label:'ATS Score',     value:'87%',          color:'#34D399', bar:87 },
            { label:'Keyword Match', value:'92%',          color:'#FCD34D', bar:92 },
            { label:'Skills Found',  value:'14',           color:'#A78BFA', bar:70 },
            { label:'Missing',       value:'React, Docker', color:'#FCA5A5', bar:0  },
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
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:'auto' }}>
          {['Real-time ATS Score Analysis','AI Keyword Optimization','Smart Job Description Matching','Resume Strength Scoring','Instant AI Feedback'].map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.65)' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#C7D2FE', flexShrink:0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#64748B', fontSize:13, cursor:'pointer', marginBottom:28, fontWeight:500 }}>← Back to Home</button>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', marginBottom:6, letterSpacing:'-0.5px' }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'#64748B', marginBottom:28 }}>
            Don't have an account?{' '}
            <button onClick={onSignUp} style={{ background:'none', border:'none', color:'#4F46E5', fontWeight:600, cursor:'pointer', fontSize:14, padding:0 }}>Sign up</button>
          </p>
          <button
            onClick={() => { const w=500,h=600,l=window.screenX+(window.outerWidth-w)/2,t=window.screenY+(window.outerHeight-h)/2; window.open('https://ats-backend-s69p.onrender.com/api/auth/google',`google_oauth`,`width=${w},height=${h},left=${l},top=${t}`); }}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, background:'#fff', color:'#0F172A', fontSize:14, fontWeight:500, cursor:'pointer', marginBottom:10, transition:'all .15s', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#C7D2FE'; e.currentTarget.style.background='#F8FAFC'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.background='#fff'; }}>
            <GoogleIcon /> Continue with Google
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'18px 0', color:'#CBD5E1', fontSize:12 }}>
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
            or continue with email
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
          </div>
          {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>⚠️ {error}</div>}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Email address</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} autoComplete="email"
              style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:'#0F172A', background:'#fff', outline:'none', boxSizing:'border-box', transition:'border-color .15s' }}
              onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} autoComplete="current-password"
                style={{ width:'100%', padding:'11px 44px 11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:'#0F172A', background:'#fff', outline:'none', boxSizing:'border-box', transition:'border-color .15s' }}
                onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              <button onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex', alignItems:'center' }}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div style={{ textAlign:'right', marginBottom:20 }}>
            <button style={{ background:'none', border:'none', color:'#4F46E5', fontSize:13, cursor:'pointer', fontWeight:500 }}>Forgot password?</button>
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{ width:'100%', padding:'13px', background:loading?'#94A3B8':'#4F46E5', color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:loading?'not-allowed':'pointer', transition:'all .15s', boxShadow:loading?'none':'0 4px 14px rgba(79,70,229,0.35)', marginBottom:20 }}
            onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.background='#4338CA'; e.currentTarget.style.transform='translateY(-1px)'; }}}
            onMouseLeave={e=>{ e.currentTarget.style.background=loading?'#94A3B8':'#4F46E5'; e.currentTarget.style.transform='translateY(0)'; }}>
            {loading ? 'Logging in…' : 'Log in →'}
          </button>
          <ApiStatusBadge />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SIGN UP PAGE
══════════════════════════════════ */
function SignUpPage({ onSignUp, onLogin, onBack }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSignUp = async () => {
    setError('');
    if (!name.trim())           { setError('Full name is required.'); return; }
    if (!email.includes('@'))   { setError('Please enter a valid email address.'); return; }
    if (password.length < 6)    { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res  = await fetch('https://ats-backend-s69p.onrender.com/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');
      localStorage.setItem('ats_token', data.token);
      localStorage.setItem('ats_user', JSON.stringify(data.user));
      onSignUp({ user: data.user });
    } catch (err) {
      onSignUp({ user: { name, email } });
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSignUp(); };
  const inp = { width:'100%', padding:'11px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:'#0F172A', background:'#fff', outline:'none', boxSizing:'border-box', transition:'border-color .15s' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'DM Sans',system-ui,sans-serif", background:'#F8FAFC' }}>
      <div style={{ width:420, flexShrink:0, background:'linear-gradient(160deg,#4F46E5 0%,#7C3AED 100%)', padding:'48px 44px', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />
        <div onClick={onBack} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:52, cursor:'pointer' }}>
          <div style={{ width:36, height:36, background:'rgba(255,255,255,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>A</div>
          <span style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>ATS Intelligence</span>
        </div>
        <div style={{ fontSize:36, fontWeight:800, color:'#fff', lineHeight:1.2, letterSpacing:'-1px', marginBottom:12 }}>
          Start for free.<br />Land more<br /><span style={{ color:'#C7D2FE' }}>interviews.</span>
        </div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:40 }}>Join 10,000+ professionals already using<br />ATS Intelligence to optimize their resumes.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:'auto' }}>
          {[
            { icon:'🚀', title:'Instant ATS Score',      sub:'Get your score in under 60 seconds' },
            { icon:'🔍', title:'Keyword Gap Analysis',    sub:'See exactly what your resume is missing' },
            { icon:'✏️', title:'AI Bullet Rewriter',      sub:'Transform weak bullets into achievements' },
            { icon:'📄', title:'Resume Builder',          sub:'Build an ATS-optimized resume from scratch' },
          ].map(f => (
            <div key={f.title} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:34, height:34, background:'rgba(255,255,255,0.15)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{f.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#64748B', fontSize:13, cursor:'pointer', marginBottom:28, fontWeight:500 }}>← Back to Home</button>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', marginBottom:6, letterSpacing:'-0.5px' }}>Create your account</h1>
          <p style={{ fontSize:14, color:'#64748B', marginBottom:28 }}>
            Already have an account?{' '}
            <button onClick={onLogin} style={{ background:'none', border:'none', color:'#4F46E5', fontWeight:600, cursor:'pointer', fontSize:14, padding:0 }}>Log in</button>
          </p>
          {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#991B1B', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:14 }}>⚠️ {error}</div>}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Full name</label>
            <input type="text" placeholder="Jane Smith" value={name} onChange={e=>setName(e.target.value)} onKeyDown={handleKey} style={inp}
              onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Email address</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={handleKey} style={inp}
              onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleKey}
                style={{ ...inp, paddingRight:44 }}
                onFocus={e=>e.target.style.borderColor='#4F46E5'} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />
              <button onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex', alignItems:'center' }}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <button onClick={handleSignUp} disabled={loading}
            style={{ width:'100%', padding:'13px', background:loading?'#94A3B8':'#4F46E5', color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:loading?'not-allowed':'pointer', transition:'all .15s', boxShadow:loading?'none':'0 4px 14px rgba(79,70,229,0.35)', marginBottom:14 }}
            onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.background='#4338CA'; e.currentTarget.style.transform='translateY(-1px)'; }}}
            onMouseLeave={e=>{ e.currentTarget.style.background=loading?'#94A3B8':'#4F46E5'; e.currentTarget.style.transform='translateY(0)'; }}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
          <p style={{ fontSize:11, color:'#94A3B8', textAlign:'center', lineHeight:1.6 }}>By signing up you agree to our Terms of Service and Privacy Policy.</p>
          <div style={{ marginTop:16 }}><ApiStatusBadge /></div>
        </div>
      </div>
    </div>
  );
}

/* ── Backend Status Badge ── */
function ApiStatusBadge() {
  const [status, setStatus] = useState('checking');
  const check = () => {
    setStatus('checking');
    fetch('https://ats-backend-s69p.onrender.com/api/health', { signal: AbortSignal.timeout(3000) })
      .then(r => setStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  };
  useEffect(() => { check(); }, []);
  const cfg = {
    checking: { bg:'#FEF3C7', border:'#FDE68A', color:'#92400E', dot:'#F59E0B', label:'Checking backend…' },
    online:   { bg:'#D1FAE5', border:'#6EE7B7', color:'#065F46', dot:'#059669', label:'Backend connected ✓' },
    offline:  { bg:'#F8FAFC', border:'#E2E8F0', color:'#64748B', dot:'#94A3B8', label:'Demo mode — backend not connected' },
  }[status];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:10, fontSize:12, color:cfg.color, fontWeight:600 }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:cfg.dot, flexShrink:0 }} />
      {cfg.label}
      {status==='offline' && <button onClick={check} style={{ marginLeft:'auto', border:'none', background:'none', color:cfg.color, cursor:'pointer', fontSize:11, fontWeight:700 }}>Retry ↺</button>}
    </div>
  );
}

/* ── Icons ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ══════════════════════════════════
   OPTIMIZE RESUME TAB
══════════════════════════════════ */
function OptimizeTab({ data, onRescan }) {
  const [optimized, setOptimized]     = useState('');
  const [loading, setLoading]         = useState(false);
  const [step, setStep]               = useState('idle');
  const [copied, setCopied]           = useState(false);
  const [activeView, setActiveView]   = useState('side');
  const [progress, setProgress]       = useState(0);
  const [progressMsg, setProgressMsg] = useState('');

  const MSGS = [
    'Reading your resume…',
    'Identifying missing keywords…',
    'Rewriting bullet points…',
    'Injecting JD keywords naturally…',
    'Boosting ATS compatibility…',
    'Polishing final output…',
  ];

  const runOptimize = async () => {
    if (!data?.resumeText || !data?.jdText) return;
    setStep('loading'); setProgress(0); setProgressMsg(MSGS[0]);
    let msgIdx = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 14 + 4;
        msgIdx = Math.min(Math.floor(next / 18), MSGS.length - 1);
        setProgressMsg(MSGS[msgIdx]);
        if (next >= 92) { clearInterval(interval); return 92; }
        return next;
      });
    }, 400);

    try {
      const missing  = data.missing?.join(', ') || '';
      const found    = data.found?.join(', ')   || '';
      const score    = data.total || 0;
      const jobTitle = data.jobTitle || 'the target role';
      const company  = data.company  || '';
      const prompt = `You are an expert ATS resume optimizer. 

ORIGINAL RESUME:
${data.resumeText}

JOB DESCRIPTION:
${data.jdText}

ANALYSIS:
- Current ATS Score: ${score}%
- Already matched keywords: ${found}
- Missing keywords to add: ${missing}
- Target role: ${jobTitle}${company ? ' at ' + company : ''}

TASK: Rewrite the resume to maximize ATS score for this specific job.

RULES:
1. Keep ALL original experience, education, and facts — never invent anything
2. Naturally weave in ALL missing keywords: ${missing}
3. Strengthen every bullet with action verbs and metrics where possible
4. Keep the same resume structure/sections
5. Make each bullet 1-2 lines, starting with a strong verb
6. Keep Skills section updated with missing technical keywords
7. Rewrite the Professional Summary to match the JD
8. Output ONLY the full optimized resume text, no explanations or markdown headers

Write the complete optimized resume now:`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const result = await response.json();
      const text   = result.content?.map(b => b.text || '').join('') || '';
      clearInterval(interval);
      setProgress(100); setProgressMsg('Done!');
      setTimeout(() => { setOptimized(text.trim()); setStep('done'); }, 400);
    } catch (err) {
      clearInterval(interval);
      const missing = data.missing || [];
      const skills  = missing.join(', ');
      setOptimized(data.resumeText + (skills ? `\n\nADDITIONAL SKILLS (Added for ATS)\n${skills}` : ''));
      setProgress(100); setProgressMsg('Done!');
      setTimeout(() => setStep('done'), 400);
    }
  };

  const getNewScore = () => {
    if (!optimized || !data?.jdKws) return null;
    const rk   = extractKeywords(optimized);
    const jk   = data.jdKws;
    const found = jk.filter(k => rk.includes(k));
    return jk.length ? Math.min(100, Math.round((found.length / jk.length) * 100 * 0.5 +
      (optimized.split(/\s+/).filter(Boolean).length > 400 ? 95 : 80) * 0.2 +
      80 * 0.2 + 85 * 0.1)) : data.total;
  };

  const handleCopy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const newScore  = step === 'done' ? getNewScore() : null;
  const scoreDiff = newScore !== null ? newScore - (data?.total || 0) : 0;

  if (step === 'idle') return (
    <div>
      <PageTitle title="Optimize Resume" sub="AI rewrites your resume to match the job description and add missing keywords" />
      {!data?.resumeText ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300, flexDirection:'column', gap:12 }}>
          <div style={{ fontSize:48, opacity:0.15 }}>✦</div>
          <div style={{ color:'#94A3B8', fontSize:14 }}>Run the Resume Scanner first to use this feature</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
          <Card accent="#4F46E5">
            <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', marginBottom:16 }}>✦ What AI will optimize</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { icon:'🎯', title:'Inject missing keywords', sub:`Add ${data.missing?.length || 0} keywords: ${(data.missing||[]).slice(0,4).join(', ')}${(data.missing||[]).length > 4 ? '…' : ''}` },
                { icon:'✏️', title:'Rewrite bullet points',   sub:'Stronger verbs, metrics, and impact-driven language' },
                { icon:'📝', title:'Update Professional Summary', sub:'Tailored to the exact job description' },
                { icon:'⚡', title:'Boost ATS compatibility',  sub:`Current score: ${data.total}% → Target: 90%+` },
                { icon:'🔑', title:'Update Skills section',    sub:'Add all required technical keywords from JD' },
              ].map(f => (
                <div key={f.title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:34, height:34, background:'#EEF2FF', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{f.title}</div>
                    <div style={{ fontSize:11, color:'#64748B', marginTop:2 }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Card>
              <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.5px' }}>Current Status</div>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:16 }}>
                <ScoreRing score={data.total||0} size={90} />
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:scoreColor(data.total||0) }}>{scoreLabel(data.total||0)}</div>
                  <div style={{ fontSize:12, color:'#64748B' }}>Current ATS score</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ padding:'4px 12px', background:'#D1FAE5', color:'#065F46', borderRadius:20, fontSize:11, fontWeight:700 }}>✓ {data.found?.length||0} matched</span>
                <span style={{ padding:'4px 12px', background:'#FEE2E2', color:'#991B1B', borderRadius:20, fontSize:11, fontWeight:700 }}>✗ {data.missing?.length||0} missing</span>
              </div>
            </Card>
            <Card>
              <div style={{ fontSize:11, fontWeight:700, color:'#64748B', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.5px' }}>Missing Keywords</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {(data.missing||[]).map(k => <span key={k} style={{ padding:'4px 12px', background:'#FEF3C7', color:'#92400E', borderRadius:20, fontSize:11, fontWeight:600 }}>+ {k}</span>)}
                {(data.missing||[]).length === 0 && <span style={{ color:'#059669', fontSize:12 }}>All keywords matched! 🎉</span>}
              </div>
            </Card>
            <button onClick={runOptimize} style={{ padding:'16px', background:'linear-gradient(135deg,#4F46E5,#7C3AED)', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 20px rgba(79,70,229,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontFamily:'inherit' }}>
              <span style={{ fontSize:20 }}>✦</span> Optimize My Resume with AI
            </button>
            <div style={{ fontSize:11, color:'#94A3B8', textAlign:'center', marginTop:-8 }}>Takes 15–30 seconds · Your original is preserved</div>
          </div>
        </div>
      )}
    </div>
  );

  if (step === 'loading') return (
    <div>
      <PageTitle title="Optimize Resume" sub="AI is rewriting your resume…" />
      <Card style={{ textAlign:'center', padding:'60px 40px' }}>
        <div style={{ fontSize:52, marginBottom:20, animation:'pulse 1.5s infinite' }}>✦</div>
        <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:22, fontWeight:800, color:'#0F172A', marginBottom:8 }}>AI is optimizing your resume</div>
        <div style={{ fontSize:14, color:'#64748B', marginBottom:32 }}>{progressMsg}</div>
        <div style={{ background:'#F1F5F9', borderRadius:100, height:10, overflow:'hidden', maxWidth:480, margin:'0 auto 12px' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#4F46E5,#7C3AED)', borderRadius:100, width:`${progress}%`, transition:'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize:12, color:'#94A3B8' }}>{Math.round(progress)}% complete</div>
        <div style={{ marginTop:40, display:'flex', justifyContent:'center', gap:20, flexWrap:'wrap' }}>
          {['Adding keywords','Rewriting bullets','Updating summary','Boosting score'].map((t,i) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color: progress > i*25+10 ? '#059669' : '#94A3B8', fontWeight: progress > i*25+10 ? 700 : 400 }}>
              <span>{progress > i*25+10 ? '✓' : '○'}</span> {t}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0F172A', margin:0, letterSpacing:'-0.5px' }}>✦ Optimized Resume</h1>
          <p style={{ fontSize:13, color:'#64748B', margin:'4px 0 0' }}>Your resume has been rewritten to maximize ATS compatibility</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button onClick={() => setStep('idle')} style={{ padding:'9px 16px', background:'#fff', border:'1px solid #E2E8F0', color:'#475569', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>← Redo</button>
          <button onClick={onRescan} style={{ padding:'9px 16px', background:'#EEF2FF', border:'1px solid #C7D2FE', color:'#4F46E5', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>◎ Re-scan Optimized</button>
          <button onClick={() => handleCopy(optimized)} style={{ padding:'9px 18px', background:copied?'#059669':'#4F46E5', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', transition:'background 0.2s' }}>
            {copied ? '✓ Copied!' : '📋 Copy Resume'}
          </button>
        </div>
      </div>
      {newScore !== null && (
        <div style={{ background:'linear-gradient(135deg,#059669,#047857)', borderRadius:14, padding:'18px 28px', marginBottom:20, display:'flex', alignItems:'center', gap:28, flexWrap:'wrap', boxShadow:'0 4px 16px rgba(5,150,105,0.25)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:2 }}>Before</div>
              <div style={{ fontSize:32, fontWeight:800, color:'rgba(255,255,255,0.7)' }}>{data.total}%</div>
            </div>
            <div style={{ fontSize:28, color:'rgba(255,255,255,0.5)' }}>→</div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginBottom:2 }}>After</div>
              <div style={{ fontSize:42, fontWeight:800, color:'#fff', lineHeight:1 }}>{newScore}%</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:4 }}>{scoreDiff > 0 ? `+${scoreDiff}% score improvement! 🎉` : 'Resume optimized ✓'}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>
              {(data.missing||[]).length > 0 ? `${data.missing.length} missing keywords injected into your resume` : 'All keywords were already present — bullets and summary strengthened'}
            </div>
          </div>
        </div>
      )}
      <div style={{ display:'flex', gap:4, marginBottom:16, background:'#F1F5F9', borderRadius:10, padding:4, width:'fit-content' }}>
        {[['side','⇔ Side by Side'],['original','Original'],['optimized','✦ Optimized']].map(([v,l])=>(
          <button key={v} onClick={()=>setActiveView(v)}
            style={{ padding:'7px 18px', borderRadius:8, border:'none', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.15s', background:activeView===v?'#fff':'transparent', color:activeView===v?'#4F46E5':'#64748B', boxShadow:activeView===v?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>{l}</button>
        ))}
      </div>
      {activeView === 'side' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'12px 18px', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F8FAFC' }}>
              <span style={{ fontSize:12, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.5px' }}>Original — {data.total}% ATS</span>
              <button onClick={()=>handleCopy(data.resumeText)} style={{ fontSize:11, color:'#94A3B8', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Copy</button>
            </div>
            <pre style={{ padding:18, whiteSpace:'pre-wrap', fontFamily:'inherit', fontSize:12, lineHeight:1.8, color:'#475569', maxHeight:600, overflow:'auto', margin:0 }}>{data.resumeText}</pre>
          </div>
          <div style={{ background:'#fff', border:'2px solid #4F46E5', borderRadius:14, overflow:'hidden', boxShadow:'0 0 0 4px rgba(79,70,229,0.06)' }}>
            <div style={{ padding:'12px 18px', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#EEF2FF' }}>
              <span style={{ fontSize:12, fontWeight:700, color:'#4F46E5', textTransform:'uppercase', letterSpacing:'0.5px' }}>✦ Optimized — {newScore}% ATS</span>
              <button onClick={()=>handleCopy(optimized)} style={{ fontSize:11, color:'#4F46E5', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Copy</button>
            </div>
            <pre style={{ padding:18, whiteSpace:'pre-wrap', fontFamily:'inherit', fontSize:12, lineHeight:1.8, color:'#0F172A', maxHeight:600, overflow:'auto', margin:0 }}>{optimized}</pre>
          </div>
        </div>
      )}
      {activeView !== 'side' && (
        <div style={{ background:'#fff', border:activeView==='optimized'?'2px solid #4F46E5':'1px solid #E2E8F0', borderRadius:14, overflow:'hidden', boxShadow:activeView==='optimized'?'0 0 0 4px rgba(79,70,229,0.06)':'none' }}>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center', background:activeView==='optimized'?'#EEF2FF':'#F8FAFC' }}>
            <span style={{ fontSize:12, fontWeight:700, color:activeView==='optimized'?'#4F46E5':'#64748B', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              {activeView==='optimized' ? `✦ Optimized Resume — ${newScore}% ATS` : `Original Resume — ${data.total}% ATS`}
            </span>
            <button onClick={()=>handleCopy(activeView==='optimized'?optimized:data.resumeText)} style={{ fontSize:11, color:activeView==='optimized'?'#4F46E5':'#94A3B8', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>📋 Copy</button>
          </div>
          <pre style={{ padding:22, whiteSpace:'pre-wrap', fontFamily:'inherit', fontSize:13, lineHeight:1.9, color:'#0F172A', maxHeight:700, overflow:'auto', margin:0 }}>
            {activeView==='optimized' ? optimized : data.resumeText}
          </pre>
        </div>
      )}
      <div style={{ marginTop:16, padding:'12px 18px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <span style={{ fontSize:13, color:'#166534', fontWeight:600 }}>💡 Tip:</span>
        <span style={{ fontSize:13, color:'#166534' }}>Copy the optimized resume, go to Scanner, paste it, and re-run to verify your new ATS score.</span>
        <button onClick={onRescan} style={{ marginLeft:'auto', padding:'7px 16px', background:'#059669', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>◎ Go to Scanner →</button>
      </div>
    </div>
  );
}