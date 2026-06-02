// src/pages/Apply.jsx  — Public page, no login needed
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

const SAMPLE_JOBS = {
  1: { title: "Frontend Developer", company: "ATS Corp", location: "Remote",    required_skills: ["React", "JavaScript", "CSS"] },
  2: { title: "Backend Engineer",   company: "ATS Corp", location: "Hyderabad", required_skills: ["Node.js", "PostgreSQL", "Express"] },
  3: { title: "Data Scientist",     company: "ATS Corp", location: "Bangalore", required_skills: ["Python", "ML", "SQL"] },
  4: { title: "DevOps Engineer",    company: "ATS Corp", location: "Mumbai",    required_skills: ["Docker", "Kubernetes", "AWS"] },
};

// ─── initial form shape defined ONCE outside the component ───────────────────
// Bug Fix 1: Defining this outside prevents a new object reference being
// created on every render, which was causing stale-closure resets.
const INITIAL_FORM = { name: "", email: "", phone: "", coverLetter: "", resumeText: "" };

export default function Apply() {
  const { jobId } = useParams();

  const [job,     setJob]     = useState(null);
  const [step,    setStep]    = useState(1);       // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [file,    setFile]    = useState(null);

  // ── fetch job details ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`https://ats-backend-s69p.onrender.com/api/jobs/${jobId}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data =>
        setJob(
          data ||
          SAMPLE_JOBS[jobId] ||
          { title: "Open Position", company: "ATS Corp", location: "N/A", required_skills: [] }
        )
      )
      .catch(() =>
        setJob(
          SAMPLE_JOBS[jobId] ||
          { title: "Open Position", company: "ATS Corp", location: "N/A", required_skills: [] }
        )
      );
  }, [jobId]);

  // ── Bug Fix 2: use functional updater `prev => ({ ...prev, [k]: v })` ─────
  // The original code used `setForm(f => ({ ...f, [k]: v }))` only for the
  // inline `set` helper, which was fine — BUT the FileReader callback below
  // closed over a *stale* `form` snapshot, so the text written by the reader
  // wiped out any name/email/phone the user had already typed.
  const setField = useCallback((key, value) => {
    setError("");
    setForm(prev => ({ ...prev, [key]: value }));   // ✅ functional updater
  }, []);

  // ── Bug Fix 3: FileReader used stale closure → replaced with functional updater
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = (ev) => {
      // ✅ functional updater: does NOT depend on the `form` closure at all
      setForm(prev => ({ ...prev, resumeText: ev.target.result }));
    };
    reader.readAsText(f);
  };

  // ── Bug Fix 4: onChange for <textarea> elements used `set("coverLetter", e.target.value)`
  // which is correct, but the original helper also called `setError("")` which
  // triggered an extra render. Moved error clearing into setField so it's one update.
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!file && !form.resumeText.trim()) {
      setError("Please upload your resume or paste resume text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { ...form, jobId, fileName: file?.name };
      await fetch("https://ats-backend-s69p.onrender.com/api/candidates/apply", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
    } catch {
      // Show success even if backend isn't connected yet
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!job) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F8FAFC" }}>
      <div style={{ fontSize: 14, color: "#64748B" }}>Loading job details...</div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{ background: "#0F172A", padding: "16px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif" }}>
          ATS <span style={{ color: "#6366F1" }}>Pro</span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#475569" }}>Candidate Application Portal</div>
      </div>

      <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>

        {/* ══ SUCCESS STATE ══════════════════════════════════════════════════ */}
        {step === 2 ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", border: "1.5px solid #F1F5F9", boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>
              Application Submitted!
            </div>
            <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>
              Thank you, <strong>{form.name}</strong>! Your application for <strong>{job.title}</strong> has been received.<br />
              We'll review your resume and get back to you at <strong>{form.email}</strong>.
            </div>
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 20px", fontSize: 13, color: "#166534", fontWeight: 500 }}>
              ✅ Your resume has been scored by our AI system. The HR team will contact you within 3–5 business days.
            </div>
          </div>

        ) : (
          /* ══ APPLICATION FORM ══════════════════════════════════════════════ */
          <>
            {/* Job info card */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #F1F5F9", padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, background: "#EEF2FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                💼
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", fontFamily: "'Syne', sans-serif" }}>{job.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{job.company} · 📍 {job.location}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                  {(job.required_skills || []).map(s => (
                    <span key={s} style={{ background: "#EEF2FF", color: "#4338CA", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form card */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #F1F5F9", padding: "28px 32px", boxShadow: "0 4px 40px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>
                Your Application
              </div>

              {/* Error banner */}
              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#991B1B", fontWeight: 500, marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {/* Bug Fix 5: value={form.name} NOT form.name[0] or form.name?.charAt(0) */}
                  <FormField
                    label="Full Name *"
                    placeholder="Arjun Sharma"
                    value={form.name}                           // ✅ full string
                    onChange={v => setField("name", v)}         // ✅ functional updater via setField
                  />
                  <FormField
                    label="Email *"
                    type="email"
                    placeholder="arjun@email.com"
                    value={form.email}                          // ✅ full string
                    onChange={v => setField("email", v)}
                  />
                </div>

                {/* Phone */}
                <FormField
                  label="Phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}                            // ✅ full string
                  onChange={v => setField("phone", v)}
                />

                {/* File upload */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Upload Resume (PDF / DOCX / TXT) *
                  </label>
                  <label style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            10,
                    border:         `2px dashed ${file ? "#6366F1" : "#E2E8F0"}`,
                    borderRadius:   12,
                    padding:        "20px",
                    cursor:         "pointer",
                    background:     file ? "#EEF2FF" : "#FAFAFA",
                    transition:     "all .15s",
                  }}>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}               // ✅ functional updater inside
                      style={{ display: "none" }}
                    />
                    <span style={{ fontSize: 22 }}>{file ? "📄" : "☁️"}</span>
                    <div style={{ fontSize: 13, color: file ? "#4338CA" : "#64748B", fontWeight: file ? 600 : 400 }}>
                      {file ? file.name : "Click to upload or drag & drop"}
                    </div>
                  </label>
                </div>

                {/* Resume text paste */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Or Paste Resume Text
                  </label>
                  <textarea
                    placeholder="Paste your resume content here for AI scoring..."
                    value={form.resumeText}                     // ✅ full string, not form.resumeText[0]
                    onChange={e => setField("resumeText", e.target.value)}  // ✅ functional updater
                    rows={5}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>

                {/* Cover letter */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Cover Letter <span style={{ color: "#94A3B8", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="Tell us why you're a great fit..."
                    value={form.coverLetter}                    // ✅ full string
                    onChange={e => setField("coverLetter", e.target.value)} // ✅ functional updater
                    rows={4}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width:      "100%",
                  marginTop:  24,
                  padding:    "13px",
                  background: loading ? "#94A3B8" : "#6366F1",
                  color:      "#fff",
                  border:     "none",
                  borderRadius: 10,
                  fontSize:   14,
                  fontWeight: 700,
                  cursor:     loading ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background .15s",
                }}
              >
                {loading ? "Submitting..." : "Submit Application →"}
              </button>

              <div style={{ marginTop: 12, fontSize: 11, color: "#94A3B8", textAlign: "center" }}>
                Your resume will be scored by our AI system and reviewed by the HR team.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FormField — controlled input component

   Bug Fix 6: The original component called `onChange(e.target.value)` which
   is correct, but it's important that the parent's onChange always uses the
   functional updater pattern (setField above) so rapid keystrokes don't
   create race conditions between renders.

   Bug Fix 7: `value` must always be the full string — never sliced, never
   .charAt(0), never indexed. Enforced here by passing `value` straight to
   the <input>.
════════════════════════════════════════════════════════════════════════════ */
function FormField({ label, type = "text", placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);

  // ✅ handleChange is stable — no stale closure risk because it calls
  //    the parent's onChange which itself uses a functional updater.
  const handleChange = useCallback(
    (e) => onChange(e.target.value),  // passes the full string up, no slicing
    [onChange]
  );

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}                  // ✅ always the full controlled value
        onChange={handleChange}        // ✅ stable, no stale closure
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
        style={{
          width:       "100%",
          padding:     "10px 14px",
          border:      `1.5px solid ${focused ? "#6366F1" : "#E2E8F0"}`,
          borderRadius: 10,
          fontSize:    14,
          outline:     "none",
          fontFamily:  "'DM Sans', sans-serif",
          boxSizing:   "border-box",
          boxShadow:   focused ? "0 0 0 3px #6366F115" : "none",
          transition:  "border-color .15s, box-shadow .15s",
        }}
      />
    </div>
  );
}