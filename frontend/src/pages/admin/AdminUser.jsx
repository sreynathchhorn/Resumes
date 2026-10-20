import { useEffect, useState } from 'react';
import api from '../../api/api';
import Icon from '../../components/Icon';

const formatDate = value => value ? new Date(value).toLocaleString() : '—';

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, recent_activity: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/admin/dashboard')
      .then(r => { if (active) setData(r.data || { stats: {}, recent_activity: [] }); })
      .catch(e => { if (active) setError(e.response?.data?.message || 'Could not load the admin dashboard.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const s = data.stats || {};
  const cards = [
    ['users', s.users ?? '—', 'Total Users'],
    ['plus', s.new_users_today ?? '—', 'New Today'],
    ['briefcase', s.jobs ?? '—', 'Total Jobs'],
    ['file', s.applications ?? '—', 'Applications'],
    ['clock', s.pending_applications ?? '—', 'Needs Review'],
    ['check', s.interviews ?? '—', 'Interviews'],
  ];

  return <div className="page-content">
    <section className="hero-banner admin-banner">
      <div><span className="eyebrow">ADMIN PORTAL</span><h1>Welcome to the control center.</h1><p>Monitor users, jobs, applications, and activity from one place.</p></div>
      <div className="admin-shield"><Icon name="shield" size={32}/></div>
    </section>

    {error && <div className="error-box">{error}</div>}
    {loading ? <div className="card loading-card">Loading dashboard…</div> : <>
      <div className="admin-stats">
        {cards.map(([icon, value, label]) => <div className="card stat" key={label}><Icon name={icon}/><b>{value}</b><span>{label}</span></div>)}
      </div>
      <section className="card admin-table">
        <div className="section-title"><div><h2>Recent Activity</h2><span>Registrations, logins, logouts and important actions.</span></div></div>
        <ActivityTable rows={data.recent_activity}/>
      </section>
    </>}
  </div>;
}

export function ActivityTable({ rows = [] }) {
  return <div className="table-scroll"><table><thead><tr><th>User</th><th>Activity</th><th>Description</th><th>Time</th></tr></thead><tbody>
    {rows.length ? rows.map(r => <tr key={r.id}><td><b>{r.user?.name || 'System'}</b><small>{r.user?.email || ''}</small></td><td><span className="status applied">{String(r.action || 'activity').replaceAll('_', ' ')}</span></td><td>{r.description || '—'}</td><td>{formatDate(r.created_at)}</td></tr>) : <tr><td colSpan="4">No activity yet.</td></tr>}
  </tbody></table></div>;
}
