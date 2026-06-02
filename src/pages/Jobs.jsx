// src/pages/Jobs.jsx
import { useState, useEffect } from "react";
import { authFetch } from "../api/authApi";

const SAMPLE_JOBS = [
  { id: 1, title: "Frontend Developer", description: "Build React UIs for our platform", required_skills: ["React", "JavaScript", "CSS", "HTML"], location: "Remote", status: "open", applicants: 24, created_at: "2025-05-01" },
  { id: 2, title: "Backend Engineer", description: "Node.js REST APIs and database design", required_skills: ["Node.js", "PostgreSQL", "Express"], location: "Hyderabad", status: "open", applicants: 18, created_at: "2025-05-03" },
  { id: 3, title: "Data Scientist", description: "ML models and data pipelines", required_skills: ["Python", "Machine Learning", "SQL", "Pandas"], location: "Bangalore", status: "open", applicants: 31, created_at: "2025-05-05" },
  { id: 4, title: "DevOps Engineer", description: "CI/CD, Docker, Kubernetes infrastructure", required_skills: ["Docker", "Kubernetes", "AWS", "CI/CD"], location: "Mumbai", status: "closed", applicants: 12, created_at: "2025-04-20" },
];

export default function Jobs() {
  const [jobs, setJobs]         = useState(SAMPLE_JOBS);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [toast, setToast]       = useState(null);
  const [form, setForm]         = useState({ title: "", description: "", location: "", required_skills: "" });

  // Try to load from backend; fall back to sample data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/jobs");
        if (res && res.ok) {
          const data = await res.json();
          if (data.length > 0) setJobs(data);
        }
      } catch { /* use sample data */ }
    };
    load();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.location.trim()) {
      showToast("Title and location are required", "error"); return;
    }
    const skillsArr = form.required_skills.split(",").map(s => s.trim()).filter(Boolean);
    const newJob = {
      id: Date.now(), ...form,
      required_skills: skillsArr,
      status: "open", applicants: 0,
      created_at: new Date().toISOString().split("T")[0],
    };
    // Try backend; fallback to local state
    try {
      const res = await authFetch("/jobs", {
        method: "POST",
        body: JSON.stringify({ ...form, required_skills: skillsArr }),
      });
      if (res && res.ok) {
        const saved = await res.json();
        setJobs(prev => [{ ...saved, applicants: 0 }, ...prev]);
      } else { setJobs(prev => [newJob, ...prev]); }
    } catch { setJobs(prev => [newJob, ...prev]); }
    setForm({ title: "", description: "", location: "", required_skills: "" });
    setShowForm(false);
    showToast("Job posted successfully!");
  };

  const toggleStatus = (id) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: j.status === "open" ? "closed" : "open" } : j));
    showToast("Job status updated");
  };

  const copyLink = (id) => {
    navigator.clipboard.writeText(`http://localhost:5173/apply/${id}`);
    showToast("Apply link copied to clipboard!");
  };

  const filtered = jobs.filter(j => {
    const ms = j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" || j.status === filter;
    return ms && mf;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "error" ? "#FEF2F2" : "#F0FDF4",
          color: toast.type === "error" ? "#991B1B" : "#166534",
          border: `1px solid ${toast.type === "error" ? "#FECACA" : "#BBF7D0"}`,
          borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>{toast.type === "error" ? "⚠️" : "✅"} {toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F1F5F9", padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/" style={{ fontSize: 13, color: "#6366F1", textDecoration: "none", fontWeight: 600 }}>← Dashboard</a>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px" }}>Job Postings</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{jobs.length} jobs total · {jobs.filter(j => j.status === "open").length} open</div>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background: "#6366F1", color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 20px", fontSize: 13,
          fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>+ Post New Job</button>
      </div>

      <div style={{ padding: "24px 32px" }}>
        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#94A3B8" }}>🔍</span>
            <input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", background: "#fff" }} />
          </div>
          {["all", "open", "closed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "10px 18px", border: "1px solid", borderRadius: 10, fontSize: 13,
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              borderColor: filter === f ? "#6366F1" : "#E2E8F0",
              background: filter === f ? "#EEF2FF" : "#fff",
              color: filter === f ? "#6366F1" : "#64748B",
              fontFamily: "'DM Sans', sans-serif",
            }}>{f}</button>
          ))}
        </div>

        {/* Job cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {filtered.map(job => (
            <div key={job.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #F1F5F9", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Top */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{job.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>📍 {job.location} &nbsp;·&nbsp; 📅 {job.created_at}</div>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0, marginLeft: 10,
                  background: job.status === "open" ? "#F0FDF4" : "#F1F5F9",
                  color: job.status === "open" ? "#166534" : "#64748B",
                  border: `1px solid ${job.status === "open" ? "#BBF7D0" : "#E2E8F0"}`,
                }}>{job.status === "open" ? "● Open" : "○ Closed"}</span>
              </div>

              {/* Description */}
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{job.description}</div>

              {/* Skills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {(job.required_skills || []).map(s => (
                  <span key={s} style={{ background: "#EEF2FF", color: "#4338CA", borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>{s}</span>
                ))}
              </div>

              {/* Stats + actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #F8FAFC", paddingTop: 12 }}>
                <div style={{ fontSize: 13, color: "#6366F1", fontWeight: 700 }}>👥 {job.applicants || 0} applicants</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <button onClick={() => copyLink(job.id)} title="Copy apply link" style={btnStyle("#EEF2FF", "#4338CA")}>🔗 Copy Link</button>
                  <button onClick={() => toggleStatus(job.id)} style={btnStyle(job.status === "open" ? "#FEF2F2" : "#F0FDF4", job.status === "open" ? "#991B1B" : "#166534")}>
                    {job.status === "open" ? "Close" : "Reopen"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#94A3B8", fontSize: 15 }}>No jobs found</div>
          )}
        </div>
      </div>

      {/* Create job modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Post New Job</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Job Title", "title", "e.g. Frontend Developer"], ["Location", "location", "e.g. Remote, Hyderabad"]].map(([label, key, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                  <input placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Description</label>
                <textarea placeholder="What will this person do?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Required Skills <span style={{ color: "#94A3B8", fontWeight: 400 }}>(comma separated)</span></label>
                <input placeholder="React, JavaScript, CSS" value={form.required_skills} onChange={e => setForm(f => ({ ...f, required_skills: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "11px", border: "1.5px solid #E2E8F0", borderRadius: 10, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#64748B" }}>Cancel</button>
              <button onClick={handleCreate} style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, background: "#6366F1", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Post Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = (bg, color) => ({
  padding: "5px 12px", border: "none", borderRadius: 7,
  background: bg, color, fontSize: 12, fontWeight: 600,
  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
});