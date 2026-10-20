import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Welcome() {
  const { logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      
      {/* Navbar Header with Logout button */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <Link to="/" style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🌸</span> MNC Resume Studio
        </Link>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button 
            onClick={logout} 
            style={{ background: "#ef4444", color: "#fff", padding: "8px 16px", borderRadius: "8px", border: "none", fontWeight: "650", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Public Hero Content Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 20px 30px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px" }}>
          
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "6px", 
            background: "#f1f5f9", 
            padding: "4px 12px", 
            borderRadius: "20px", 
            border: "1px solid #e2e8f0",
            marginBottom: "16px"
          }}>
            <span style={{ fontSize: "0.8rem" }}>🌸</span>
            <span style={{ color: "#4f46e5", fontWeight: "700", letterSpacing: "0.08em", fontSize: "0.7rem" }}>
              MNC RESUME STUDIO
            </span>
          </div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "12px", lineHeight: "1.2" }}>
            Build your future, one application at a time.
          </h1>

          <p style={{ color: "#334155", fontSize: "1.05rem", fontWeight: "500", lineHeight: "1.6", marginBottom: "32px" }}>
            Create a polished resume, discover opportunities, apply with confidence, and track your career journey.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "50px" }}>
            <Link to="/register" style={{ background: "#4f46e5", color: "#fff", padding: "12px 26px", borderRadius: "10px", fontWeight: "650", textDecoration: "none", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}>
              Get Started
            </Link>
            <Link to="/login" style={{ background: "#ffffff", color: "#334155", padding: "12px 26px", borderRadius: "10px", fontWeight: "650", textDecoration: "none", border: "1px solid #cbd5e1" }}>
              Sign In
            </Link>
          </div>

        </div>

        {/* Mini Feature Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", maxWidth: "800px", width: "100%", padding: "0 20px", marginBottom: "40px" }}>
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "left" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "8px" }}>⚡</div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>ATS Optimized</h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Resumes crafted to pass automated tracking systems easily.</p>
          </div>
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "left" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "8px" }}>🎯</div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Targeted Jobs</h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Discover internships and professional roles matching your skills.</p>
          </div>
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "left" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "8px" }}>📈</div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Track Progress</h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Monitor your application status and career growth in one place.</p>
          </div>
        </div>

      </div>

      {/* Cute Footer */}
      <footer style={{ padding: "20px", textAlign: "center", fontSize: "0.85rem", color: "#64748b", borderTop: "1px solid #e2e8f0", background: "#ffffff" }}>
        Small steps. Big future. 🌿 MNC Resume Studio
      </footer>

    </div>
  );
}