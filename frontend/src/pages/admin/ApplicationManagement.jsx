
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api';

const statuses = [
  'applied',
  'under_review',
  'shortlisted',
  'interview',
  'accepted',
  'rejected',
];

const date = (value) =>
  value ? new Date(value).toLocaleString() : '—';

const getInterviewDate = (interview) => {
  if (!interview?.interview_date) return '';

  return String(interview.interview_date).slice(0, 10);
};

const getInterviewTime = (interview) => {
  if (interview?.interview_time) {
    return String(interview.interview_time).slice(0, 5);
  }

  if (interview?.interview_date) {
    const value = String(interview.interview_date);

    if (value.includes('T')) {
      return value.slice(11, 16);
    }

    if (value.includes(' ')) {
      return value.slice(11, 16);
    }
  }

  return '';
};

const emptyInterviewForm = {
  interview_date: '',
  interview_time: '',
  interview_format: 'online',
  notes: '',
};

export default function ApplicationManagement() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [schedulingApp, setSchedulingApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState(
    emptyInterviewForm
  );
  const [savingInterview, setSavingInterview] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [openingResume, setOpeningResume] = useState(null);

  // LOAD APPLICATIONS
  const load = async ({ clearError = true } = {}) => {
    setLoading(true);

    if (clearError) {
      setError('');
    }

    try {
      const response = await api.get('/admin/applications');

      setApps(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // UPDATE APPLICATION STATUS
  const changeStatus = async (application, status) => {
    setError('');
    setNotice('');
    setUpdatingStatus(application.id);

    try {
      await api.patch(`/applications/${application.id}`, {
        status,
      });

      setNotice('Application status updated successfully.');
      await load({ clearError: false });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not update application status.'
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // VIEW RESUME
  const viewResume = async (id) => {
    setError('');
    setOpeningResume(id);

    let url;

    try {
      const response = await api.get(
        `/applications/${id}/resume`,
        { responseType: 'blob' }
      );

      url = URL.createObjectURL(response.data);

      const newWindow = window.open(url, '_blank');

      if (!newWindow) {
        setNotice(
          'Resume loaded. Please allow pop-ups to view it.'
        );
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not open the resume.'
      );
    } finally {
      setOpeningResume(null);
    }
  };

  // OPEN INTERVIEW FORM
  const openInterviewForm = (application) => {
    const interview = application.interview;

    setSchedulingApp(application);
    setInterviewForm({
      interview_date: getInterviewDate(interview),
      interview_time: getInterviewTime(interview),
      interview_format:
        interview?.interview_format || 'online',
      notes: interview?.notes || '',
    });

    setError('');
    setNotice('');
  };

  const closeInterviewForm = () => {
    if (savingInterview) return;

    setSchedulingApp(null);
    setInterviewForm(emptyInterviewForm);
  };

  const updateInterviewField = (event) => {
    const { name, value } = event.target;

    setInterviewForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SCHEDULE INTERVIEW AND SEND EMAIL
  const saveInterview = async (event) => {
    event.preventDefault();

    if (!schedulingApp) return;

    setError('');
    setNotice('');
    setSavingInterview(true);

    try {
      const response = await api.post(
        `/admin/applications/${schedulingApp.id}/interview`,
        {
          interview_date: interviewForm.interview_date,
          interview_time: interviewForm.interview_time,
          interview_format: interviewForm.interview_format,
          notes: interviewForm.notes,
        }
      );

      setSchedulingApp(null);
      setInterviewForm(emptyInterviewForm);

      if (response.data?.email_sent) {
        setNotice(
          response.data?.message ||
            'Interview saved and invitation email sent successfully.'
        );
      } else {
        setNotice(
          response.data?.message ||
            'Interview saved. Please check the email status.'
        );
      }

      await load({ clearError: false });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Could not schedule the interview or send the email.';

      // A server/email error may occur AFTER the interview
      // was saved, so reload the list to show saved details.
      if ((err.response?.status || 0) >= 500) {
        await load({ clearError: false });
      }

      setError(message);
    } finally {
      setSavingInterview(false);
    }
  };

  // SEARCH + STATUS FILTER
  const list = useMemo(() => {
    let result = [...apps];

    if (filter !== 'all') {
      result = result.filter(
        (application) => application.status === filter
      );
    }

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((application) => {
        const applicantName = application.user?.name || '';
        const applicantEmail = application.user?.email || '';
        const jobTitle = application.job?.title || '';
        const company = application.job?.company_name || '';
        const status = application.status || '';

        return [
          applicantName,
          applicantEmail,
          jobTitle,
          company,
          status,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      });
    }

    return result;
  }, [apps, filter, search]);

  return (
    <div className="page-content">
      {/* PAGE HEADER */}
      <section className="hero-banner">
        <div>
          <span className="eyebrow">
            ADMIN · APPLICATIONS
          </span>

          <h1>Application Management</h1>

          <p>
            Review candidates, manage application progress,
            and schedule interviews.
          </p>
        </div>

        <div className="hero-leaf">📄</div>
      </section>

      {/* FEEDBACK */}
      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          style={{
            padding: '12px 16px',
            marginBottom: 16,
            borderRadius: 10,
            background: '#ecfdf5',
            color: '#166534',
            border: '1px solid #bbf7d0',
          }}
        >
          {notice}
        </div>
      )}

      {/* APPLICATION TABLE */}
      <div className="card admin-table">
        {/* TOOLBAR */}
        <div className="application-toolbar-v2">
          <div className="application-toolbar-top">
            <div className="application-toolbar-title">
              <div>
                <h2>Applications</h2>
                <p>
                  Manage and review submitted applications
                </p>
              </div>
            </div>

            <div className="application-count-v2">
              <strong>{list.length}</strong>
              <span>applications</span>
            </div>
          </div>

          {/* SEARCH */}
          <div className="application-search-row">
            <div className="search-field application-search-v2">
              <span className="search-icon">🔍</span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search applicant, job, company..."
                aria-label="Search applications"
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
          </div>

          {/* STATUS FILTERS */}
          <div className="application-filter-section">
            <span className="filter-label">
              Filter by status
            </span>

            <div className="application-filters-v2">
              {['all', ...statuses].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={filter === status ? 'active' : ''}
                  onClick={() => setFilter(status)}
                >
                  {status === 'all'
                    ? 'All'
                    : status.replaceAll('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOADING + TABLE */}
        {loading ? (
          <div className="loading-card">
            Loading applications…
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>Applied</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Interview</th>
                </tr>
              </thead>

              <tbody>
                {list.length > 0 ? (
                  list.map((application) => {
                    const interview = application.interview;
                    const emailSent = Boolean(
                      interview?.invitation_sent_at
                    );

                    return (
                      <tr key={application.id}>
                        <td>
                          <b>
                            {application.user?.name || 'Unknown'}
                          </b>

                          <small>
                            {application.user?.email || ''}
                          </small>
                        </td>

                        <td>
                          <b>
                            {application.job?.title ||
                              'Unknown job'}
                          </b>

                          <small>
                            {application.job?.company_name || ''}
                          </small>
                        </td>

                        <td>{date(application.created_at)}</td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            disabled={openingResume === application.id}
                            onClick={() =>
                              viewResume(application.id)
                            }
                          >
                            {openingResume === application.id
                              ? 'Opening…'
                              : 'View'}
                          </button>
                        </td>

                        <td>
                          <select
                            className="status-select"
                            value={application.status || 'applied'}
                            disabled={
                              updatingStatus === application.id
                            }
                            onChange={(event) =>
                              changeStatus(
                                application,
                                event.target.value
                              )
                            }
                            aria-label={`Status for application ${application.id}`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status.replaceAll('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          {interview ? (
                            <div
                              style={{
                                minWidth: 150,
                                fontSize: 13,
                                lineHeight: 1.6,
                              }}
                            >
                              <div>
                                <b>
                                  {getInterviewDate(interview)}
                                </b>
                              </div>

                              <div>
                                {getInterviewTime(interview)}
                                {' · '}
                                {interview.interview_format ===
                                'in_person'
                                  ? 'In-person'
                                  : 'Online'}
                              </div>

                              <div
                                style={{
                                  color: emailSent
                                    ? '#15803d'
                                    : '#b45309',
                                  fontWeight: 600,
                                }}
                              >
                                {emailSent
                                  ? '✓ Email sent'
                                  : 'Email not confirmed'}
                              </div>
                            </div>
                          ) : (
                            <span>Not scheduled</span>
                          )}

                          <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            style={{ marginTop: 8 }}
                            onClick={() =>
                              openInterviewForm(application)
                            }
                          >
                            {interview
                              ? emailSent
                                ? 'Edit Interview'
                                : 'Retry / Edit'
                              : 'Schedule Interview'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">
                      {search
                        ? `No applications found for "${search}".`
                        : 'No applications found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INTERVIEW FORM */}
      {schedulingApp && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !savingInterview
            ) {
              closeInterviewForm();
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            overflowY: 'auto',
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-form-title"
            className="card"
            style={{
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
              background: '#fff',
              borderRadius: 16,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div>
                <h2 id="interview-form-title">
                  {schedulingApp.interview
                    ? 'Update Interview'
                    : 'Schedule Interview'}
                </h2>

                <p>
                  Applicant:{' '}
                  <b>
                    {schedulingApp.user?.name || 'Unknown'}
                  </b>
                </p>

                <p>
                  Email: {schedulingApp.user?.email || 'Not available'}
                </p>

                <p>
                  Job: {schedulingApp.job?.title || 'Unknown job'}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={closeInterviewForm}
                disabled={savingInterview}
                aria-label="Close interview form"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveInterview}>
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="interview_date"
                  style={{ display: 'block', marginBottom: 6 }}
                >
                  Interview date *
                </label>

                <input
                  id="interview_date"
                  name="interview_date"
                  type="date"
                  value={interviewForm.interview_date}
                  min={new Date().toLocaleDateString('en-CA')}
                  onChange={updateInterviewField}
                  required
                  disabled={savingInterview}
                  style={{
                    width: '100%',
                    padding: 10,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="interview_time"
                  style={{ display: 'block', marginBottom: 6 }}
                >
                  Interview time *
                </label>

                <input
                  id="interview_time"
                  name="interview_time"
                  type="time"
                  value={interviewForm.interview_time}
                  onChange={updateInterviewField}
                  required
                  disabled={savingInterview}
                  style={{
                    width: '100%',
                    padding: 10,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="interview_format"
                  style={{ display: 'block', marginBottom: 6 }}
                >
                  Interview format *
                </label>

                <select
                  id="interview_format"
                  name="interview_format"
                  value={interviewForm.interview_format}
                  onChange={updateInterviewField}
                  required
                  disabled={savingInterview}
                  style={{
                    width: '100%',
                    padding: 10,
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="online">Online</option>
                  <option value="in_person">In-person</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="interview_notes"
                  style={{ display: 'block', marginBottom: 6 }}
                >
                  Notes / Interview details
                </label>

                <textarea
                  id="interview_notes"
                  name="notes"
                  rows="4"
                  maxLength="5000"
                  value={interviewForm.notes}
                  onChange={updateInterviewField}
                  placeholder="Meeting link, office address, documents to bring..."
                  disabled={savingInterview}
                  style={{
                    width: '100%',
                    padding: 10,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeInterviewForm}
                  disabled={savingInterview}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingInterview}
                >
                  {savingInterview
                    ? 'Saving and sending…'
                    : schedulingApp.interview
                      ? 'Save & Send Invitation'
                      : 'Schedule & Send Invitation'}
                </button>
              </div>

              <p
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  marginTop: 14,
                }}
              >
                Saving sends an invitation to the applicant's
                registered email. If sending fails after the
                interview is saved, reopen this form and retry.
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
