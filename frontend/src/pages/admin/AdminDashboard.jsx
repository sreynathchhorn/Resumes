
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import Icon from '../../components/Icon';

const formatDate = (value) =>
  value ? new Date(value).toLocaleString() : '—';

const activityTypes = [
  'login',
  'logout',
  'register',
  'application',
  'job',
  'profile',
  'resume',
];

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: {},
    recent_activity: [],
    weekly_activity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and activity filter
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');

  useEffect(() => {
    let active = true;

    api
      .get('/admin/dashboard')
      .then((response) => {
        if (active) {
          setData(
            response.data || {
              stats: {},
              recent_activity: [],
            }
          );
        }
      })
      .catch((error) => {
        if (active) {
          setError(
            error.response?.data?.message ||
              'Could not load the admin dashboard.'
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = data.stats || {};
  const weeklyActivity = Array.isArray(data.weekly_activity)
    ? data.weekly_activity
    : [];
  const weeklyTotal = weeklyActivity.reduce(
    (total, item) => total + Number(item.count || 0),
    0
  );
  const weeklyPeak = weeklyActivity.reduce(
    (peak, item) => Number(item.count || 0) > Number(peak.count || 0)
      ? item
      : peak,
    { day: '—', count: 0 }
  );
  const weeklyMax = Math.max(
    1,
    ...weeklyActivity.map((item) => Number(item.count || 0))
  );

  const cards = [
    ['users', stats.users ?? '—', 'Total Users'],
    ['plus', stats.new_users_today ?? '—', 'New Today'],
    ['briefcase', stats.jobs ?? '—', 'Total Jobs'],
    ['file', stats.applications ?? '—', 'Applications'],
    ['clock', stats.pending_applications ?? '—', 'Needs Review'],
    ['check', stats.interviews ?? '—', 'Interviews'],
  ];

  // FILTER RECENT ACTIVITY
  const activities = useMemo(() => {
    let result = data.recent_activity || [];

    if (activityFilter !== 'all') {
      result = result.filter((activity) =>
        String(activity.action || '')
          .toLowerCase()
          .includes(activityFilter)
      );
    }

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((activity) => {
        const userName = activity.user?.name || '';
        const userEmail = activity.user?.email || '';
        const action = activity.action || '';
        const description = activity.description || '';

        return [
          userName,
          userEmail,
          action,
          description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      });
    }

    return result;
  }, [data.recent_activity, activityFilter, search]);

  return (
    <div className="page-content">

      {/* ADMIN HEADER */}
      <section className="hero-banner admin-banner">
        <div>
          <span className="eyebrow">ADMIN PORTAL</span>

          <h1>Welcome to the control center.</h1>

          <p>
            Monitor users, jobs, applications,
            and activity from one place.
          </p>
        </div>

        <div className="admin-shield">
          <Icon name="shield" size={32} />
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="card loading-card">
          Loading dashboard…
        </div>
      ) : (
        <>
          {/* STATISTICS */}
          <div className="admin-stats">
            {cards.map(([icon, value, label]) => (
              <div className="card stat" key={label}>
                <Icon name={icon} />
                <b>{value}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* ACTIVITY OVERVIEW */}
          <section className="admin-activity-section">

            <div className="admin-activity-heading">
              <div>
                <span className="eyebrow">
                  PLATFORM ANALYTICS
                </span>

                <h2>Activity Overview</h2>

                <p>
                  Your platform engagement by day
                </p>
              </div>

              <span className="activity-sample-badge">
                Last 7 days
              </span>
            </div>

            <div className="admin-activity-grid">

              {/* WEEKLY CHART */}
              <div className="card admin-weekly-card">

                <div className="weekly-card-heading">
                  <div>
                    <span className="weekly-eyebrow">
                      WEEKLY ACTIVITY
                    </span>

                    <h3>
                      Platform Activity
                    </h3>
                  </div>

                  <span className="weekly-chart-icon">
                    <Icon name="activity" size={21} />
                  </span>
                </div>

                <div
                  className="weekly-chart"
                  role="img"
                  aria-label="Weekly platform activity for the last seven days."
                >
                  {weeklyActivity.map((item) => (
                    <div
                      className="weekly-chart-column"
                      key={item.day}
                    >
                      <span className="weekly-chart-count">
                        {item.count}
                      </span>

                      <div className="weekly-bar-track">
                        <div
                          className={`weekly-bar ${
                            item.day === weeklyPeak.day && item.count > 0
                              ? 'weekly-bar-highlight'
                              : ''
                          }`}
                          style={{
                            height: `${(Number(item.count || 0) / weeklyMax) * 100}%`,
                          }}
                        />
                      </div>

                      <span className="weekly-chart-day">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="weekly-chart-legend">
                  <span className="legend-dot" />
                  Daily activity
                </div>

                <div className="weekly-total">
                  <div>
                    <span>Interactions this week</span>
                    <strong>{weeklyTotal} times</strong>
                  </div>

                  <span className="weekly-growth">
                    Live data
                  </span>
                </div>
              </div>

              {/* ACTIVITY SUMMARY */}
              <div className="card admin-activity-summary">

                <div className="summary-icon">
                  <Icon name="activity" size={23} />
                </div>

                <span className="summary-label">
                  ACTIVE STREAK
                </span>

                <div className="summary-streak">
                  <strong>2</strong>
                  <span>🔥 days</span>
                </div>

                <p>
                  Consecutive active days
                </p>

                <div className="summary-divider" />

                <div className="summary-detail">
                  <span>Daily peak</span>
                  <strong>{weeklyPeak.count} interactions</strong>
                </div>

                <div className="summary-detail">
                  <span>Busiest day</span>
                  <strong>{weeklyPeak.day}</strong>
                </div>

                <p className="summary-disclaimer">
                  Based on recorded platform activity from the
                  last seven days.
                </p>
              </div>

            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="admin-quick-actions">

            <Link
              to="/admin/users"
              className="admin-quick-card"
            >
              <div className="quick-icon">
                <Icon name="users" size={20} />
              </div>

              <div>
                <b>Manage Users</b>
                <span>
                  View and manage registered users
                </span>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              to="/admin/jobs"
              className="admin-quick-card"
            >
              <div className="quick-icon">
                <Icon name="briefcase" size={20} />
              </div>

              <div>
                <b>Manage Jobs</b>
                <span>
                  Create, edit and remove jobs
                </span>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              to="/admin/applications"
              className="admin-quick-card"
            >
              <div className="quick-icon">
                <Icon name="file" size={20} />
              </div>

              <div>
                <b>Review Applications</b>
                <span>
                  Review candidates and statuses
                </span>
              </div>

              <strong>→</strong>
            </Link>

          </section>

          {/* RECENT ACTIVITY */}
          <section className="card admin-table">

            <div className="section-title">
              <div>
                <h2>Recent Activity</h2>

                <span>
                  Registrations, logins, logouts
                  and important actions.
                </span>
              </div>
            </div>

            {/* ACTIVITY TOOLBAR */}
            <div className="dashboard-activity-toolbar">

              <div className="search-field dashboard-search">
                <span className="search-icon">🔍</span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search activity, user..."
                />

                {search && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearch('')}
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="filter-row admin-filter">

                <button
                  type="button"
                  className={
                    activityFilter === 'all' ? 'active' : ''
                  }
                  onClick={() => setActivityFilter('all')}
                >
                  All
                </button>

                {activityTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={
                      activityFilter === type ? 'active' : ''
                    }
                    onClick={() => setActivityFilter(type)}
                  >
                    {type}
                  </button>
                ))}

              </div>

              <span className="activity-count">
                {activities.length} activities
              </span>

            </div>

            <ActivityTable rows={activities} />

          </section>
        </>
      )}
    </div>
  );
}

/* ACTIVITY TABLE */
export function ActivityTable({ rows = [] }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Activity</th>
            <th>Description</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((activity) => (
              <tr key={activity.id}>
                <td>
                  <b>
                    {activity.user?.name || 'System'}
                  </b>

                  <small>
                    {activity.user?.email || ''}
                  </small>
                </td>

                <td>
                  <span className="status applied">
                    {String(
                      activity.action || 'activity'
                    ).replaceAll('_', ' ')}
                  </span>
                </td>

                <td>
                  {activity.description || '—'}
                </td>

                <td>
                  {formatDate(activity.created_at)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">
                No activity found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
