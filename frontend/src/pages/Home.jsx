import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../api/api';
import Icon from '../components/Icon';

const fallback = [
  ['Backend Developer (Intern)', 'MNC Bank', '$300 - $500/mo', 'Internship', 'Remote'],
  ['IT Support Specialist', 'TrueTech Solutions', '$400 - $700/mo', 'Full-time', 'On-site'],
  ['Junior Software Engineer', 'Amazon (Cambodia)', '$600 - $900/mo', 'Full-time', 'On-site']
];

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(fallback);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get('/jobs').then(r => setJobs((r.data.data || r.data).slice(0, 3))).catch(() => {});
    api.get('/my-applications').then(r => setApps(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="page-content">
      {/* Hero Banner: Clean layout with no .exe, darker text, and correct title hierarchy */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: "20px", 
        border: "1px solid #e2e8f0", 
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)", 
        padding: "32px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "6px", 
            background: "#f1f5f9", 
            padding: "4px 12px", 
            borderRadius: "20px", 
            border: "1px solid #e2e8f0",
            marginBottom: "10px"
          }}>
            <span style={{ fontSize: "0.8rem" }}>🌸</span>
            <span style={{ color: "#4f46e5", fontWeight: "700", letterSpacing: "0.08em", fontSize: "0.7rem" }}>
              MNC RESUME STUDIO
            </span>
          </div>

          {/* Main Big Title */}
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a", marginTop: "4px", marginBottom: "4px" }}>
            Build your future, one application at a time.
          </h1>

          {/* Smaller Secondary Title / Greeting with Darker Readable Text */}
          <p style={{ color: "#334155", fontSize: "0.95rem", fontWeight: "500", margin: 0 }}>
            Welcome to Resume Studio, {user?.name?.split(' ')[0] || 'Sithyma'} 👋
          </p>
        </div>
        
        {/* Clean Flat Status Card (No 3D pin, compact layout) */}
        <div style={{ 
          background: "#f8fafc", 
          border: "1px solid #e2e8f0", 
          padding: "18px 22px", 
          borderRadius: "16px", 
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)", 
          minWidth: "220px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em" }}>PORTAL STATUS</span>
            <span style={{ fontSize: "0.9rem" }}>🛡️</span>
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>ATS Resume Ready ⚡</div>
          <div style={{ fontSize: "0.78rem", color: "#334155", fontWeight: "500", marginTop: "2px" }}>Fully optimized &amp; secure</div>
        </div>
      </div>

      <section className="dashboard-cards">
        <div className="card progress-card">
          <div className="ring"><span>80%</span></div>
          <div>
            <b>Resume completion</b>
            <p>Your profile is looking great. Add experience to reach 100%.</p>
            <Link className="text-green" to="/resume">Continue resume →</Link>
          </div>
        </div>
        <Link className="card quick-card" to="/jobs">
          <span className="quick-icon"><Icon name="search"/></span>
          <b>Find Jobs</b>
          <p>Discover roles that match your skills.</p>
        </Link>
        <Link className="card quick-card" to="/applications">
          <span className="quick-icon"><Icon name="file"/></span>
          <b>My Applications</b>
          <p>Track your application progress.</p>
        </Link>
        <Link className="card quick-card" to="/resume">
          <span className="quick-icon"><Icon name="edit"/></span>
          <b>Build Resume</b>
          <p>Create a resume employers notice.</p>
        </Link>
      </section>

      <section className="section">
        <div className="section-title">
          <div>
            <h2>Recommended Jobs</h2>
            <span>Fresh opportunities for you</span>
          </div>
          <Link to="/jobs">View all →</Link>
        </div>
        <div className="mini-job-grid">
          {jobs.map((j, i) => (
            <Link className="card mini-job" to="/jobs" key={j.id || i}>
              <div className={`company-logo logo-${i % 4}`}>{(j.company_name || 'M')[0]}</div>
              <div>
                <b>{j.title}</b>
                <span>{j.company_name}</span>
                <small>{j.location || 'Phnom Penh, Cambodia'} · {j.employment_type || 'Full-time'}</small>
              </div>
              <strong>{j.salary || '$ —'}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <div>
            <h2>Recent Applications</h2>
            <span>Keep an eye on your progress</span>
          </div>
          <Link to="/applications">View all →</Link>
        </div>
        <div className="card table-card">
          {apps.length ? (
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id}>
                    <td>{a.job?.title}</td>
                    <td>{a.job?.company_name}</td>
                    <td><span className={`status ${a.status}`}>{a.status.replace('_', ' ')}</span></td>
                    <td>{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty">No applications yet. <Link to="/jobs">Find your first job →</Link></div>
          )}
        </div>
      </section>

      <div className="page-motto">
        <div className="leaf-art small"><i></i><i></i><i></i></div>
        Small steps. Big future. 🌿
      </div>
    </div>
  );
}