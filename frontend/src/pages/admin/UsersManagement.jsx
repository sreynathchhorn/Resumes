import { useEffect, useState } from 'react';
import api from '../../api/api';
import Icon from '../../components/Icon';

const date = value => value ? new Date(value).toLocaleString() : 'Never';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { const r = await api.get('/admin/users'); setUsers(Array.isArray(r.data) ? r.data : []); }
    catch (e) { setError(e.response?.data?.message || 'Could not load users.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async id => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/admin/users/${id}`); await load(); }
    catch (e) { setError(e.response?.data?.message || 'Unable to delete user.'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/admin/users/${id}/status`, { status }); await load(); }
    catch (e) { setError(e.response?.data?.message || 'Unable to update user status.'); }
  };

  const list = users.filter(u => `${u.name || ''} ${u.email || ''}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="page-content">
    <section className="hero-banner"><div><span className="eyebrow">ADMIN · USERS</span><h1>Users Management</h1><p>See registered users, roles, login time and logout time.</p></div><div className="hero-leaf"> 🧑‍💻 </div></section>
    {error && <div className="error-box">{error}</div>}
    <div className="card admin-table">
      <div className="table-toolbar"><div className="search-field"><Icon name="search" size={15}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users"/></div><span>{users.length} users</span></div>
      {loading ? <div className="loading-card">Loading users…</div> : <div className="table-scroll"><table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Registered</th><th>Last Login</th><th>Last Logout</th><th>Action</th></tr></thead><tbody>
        {list.length ? list.map(u => <tr key={u.id}><td><b>{u.name}</b><small>{u.email}</small></td><td><span className={`role ${u.role}`}>{u.role}</span></td><td><select className="status-select" value={u.status || 'active'} disabled={u.role === 'admin'} onChange={e => updateStatus(u.id, e.target.value)}><option value="active">Active</option><option value="suspended">Suspended</option></select></td><td>{date(u.created_at)}</td><td>{date(u.last_login_at)}</td><td>{date(u.last_logout_at)}</td><td><button title="Delete user" className="icon-danger" onClick={() => remove(u.id)}><Icon name="trash" size={15}/></button></td></tr>) : <tr><td colSpan="7">No users found.</td></tr>}
      </tbody></table></div>}
    </div>
  </div>;
}
