import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import Icon from '../components/Icon';

export default function Jobs() {
  const [params] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(
    params.get('search') || ''
  );

  const [location, setLocation] = useState(
    'All Locations'
  );

  const [type, setType] = useState(
    'All Types'
  );

  const [level, setLevel] = useState(
    'All Levels'
  );

  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modal, setModal] = useState(false);

  const [file, setFile] = useState(null);
  const [cover, setCover] = useState('');

  const [notice, setNotice] = useState('');

  /* =====================================================
     LOAD JOBS
  ===================================================== */

  useEffect(() => {
    setLoading(true);
    setError('');

    api
      .get('/jobs', {
        params: {
          search: search || undefined,
        },
      })
      .then((r) => {
        const data = r.data?.data || r.data || [];

        const jobList = Array.isArray(data)
          ? data
          : [];

        setJobs(jobList);

        setSelected(
          jobList.length > 0
            ? jobList[0]
            : null
        );
      })
      .catch((e) => {
        console.error(
          'LOAD JOBS ERROR:',
          e.response?.data || e
        );

        setError(
          e.response?.data?.message ||
            'Could not load jobs.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search]);

  /* =====================================================
     FILTER JOBS
  ===================================================== */

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const locationMatch =
        location === 'All Locations' ||
        job.location === location;

      const typeMatch =
        type === 'All Types' ||
        job.employment_type === type;

      const levelMatch =
        level === 'All Levels' ||
        job.level === level ||
        job.experience_level === level;

      return (
        locationMatch &&
        typeMatch &&
        levelMatch
      );
    });
  }, [
    jobs,
    location,
    type,
    level,
  ]);

  /* =====================================================
     SUBMIT APPLICATION
  ===================================================== */

  const apply = async (e) => {
    e.preventDefault();

    /* -----------------------------
       VALIDATION
    ----------------------------- */

    if (!selected) {
      alert(
        'Please select a job first.'
      );
      return;
    }

    if (!file) {
      alert(
        'Please upload your resume PDF.'
      );
      return;
    }

    if (file.type !== 'application/pdf') {
      alert(
        'Please upload a PDF file only.'
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        'Resume must be smaller than 2MB.'
      );
      return;
    }

    /* -----------------------------
       FORM DATA
    ----------------------------- */

    const formData = new FormData();

    formData.append(
      'job_id',
      selected.id
    );

    formData.append(
      'resume',
      file
    );

    formData.append(
      'cover_letter',
      cover
    );

    /* -----------------------------
       SEND APPLICATION
    ----------------------------- */

    try {
      console.log(
        'Submitting application...'
      );

      console.log(
        'Job ID:',
        selected.id
      );

      console.log(
        'Resume:',
        file
      );

      console.log(
        'Cover Letter:',
        cover
      );

      const response = await api.post(
        '/applications',
        formData
      );

      console.log(
        'APPLICATION SUCCESS:',
        response.data
      );

      /* -----------------------------
         SUCCESS ALERT
      ----------------------------- */

      alert(
        'Application submitted successfully!'
      );

      /* -----------------------------
         CLOSE MODAL
      ----------------------------- */

      setModal(false);

      /* -----------------------------
         CLEAR FORM
      ----------------------------- */

      setFile(null);
      setCover('');

    } catch (e) {
      console.error(
        'APPLICATION ERROR:',
        e.response?.data || e
      );

      const data =
        e.response?.data;

      /* -----------------------------
         LARAVEL VALIDATION ERRORS
      ----------------------------- */

      if (data?.errors) {
        const messages =
          Object.values(
            data.errors
          )
            .flat()
            .join('\n');

        alert(messages);

      } else {

        alert(
          data?.message ||
            'Could not submit application.'
        );
      }
    }
  };

  /* =====================================================
     OPEN APPLICATION MODAL
  ===================================================== */

  const openApplyModal = () => {
    setNotice('');

    setFile(null);

    setCover('');

    setModal(true);
  };

  /* =====================================================
     CLOSE APPLICATION MODAL
  ===================================================== */

  const closeModal = () => {
    setModal(false);

    setFile(null);

    setCover('');

    setNotice('');
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="page-content">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero-banner jobs-banner">

        <div>

          <span className="eyebrow">
            OPPORTUNITIES
          </span>

          <h1>
            Discover jobs that match
            your skills.
          </h1>

          <p>
            Find meaningful work and
            build the career you want.
          </p>

        </div>

        <div className="hero-image-text">
          MNC
        </div>

      </section>

      {/* =================================================
          SEARCH / FILTER BAR
      ================================================= */}

      <div className="job-search-bar card">

        {/* SEARCH */}

        <div className="search-field">

          <Icon name="search" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Job title, keyword, or company"
          />

        </div>

        {/* LOCATION */}

        <div className="select-field">

          <Icon name="activity" />

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          >

            <option>
              All Locations
            </option>

            {[
              ...new Set(
                jobs
                  .map(
                    (job) =>
                      job.location
                  )
                  .filter(Boolean)
              ),
            ].map((item) => (

              <option
                key={item}
                value={item}
              >
                {item}
              </option>

            ))}

          </select>

        </div>

        {/* TYPE */}

        <div className="select-field">

          <Icon name="briefcase" />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option>
              All Types
            </option>

            {[
              ...new Set(
                jobs
                  .map(
                    (job) =>
                      job.employment_type
                  )
                  .filter(Boolean)
              ),
            ].map((item) => (

              <option
                key={item}
                value={item}
              >
                {item}
              </option>

            ))}

          </select>

        </div>

        {/* LEVEL */}

        <div className="select-field">

          <Icon name="chart" />

          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
          >

            <option>
              All Levels
            </option>

            <option>
              Entry Level
            </option>

            <option>
              Mid Level
            </option>

          </select>

        </div>

        {/* SEARCH BUTTON */}

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            setSearch(search)
          }
        >
          Search
        </button>

      </div>

      {/* =================================================
          NOTICE
      ================================================= */}

      {notice && (

        <div className="notice">
          {notice}
        </div>

      )}

      {/* =================================================
          JOBS LAYOUT
      ================================================= */}

      <div className="jobs-layout">

        {/* =================================================
            JOB LIST
        ================================================= */}

        <section>

          <div className="list-heading">

            <h2>

              Available Jobs{' '}

              <small>
                ({filtered.length} jobs)
              </small>

            </h2>

            <button
              type="button"
              className="sort"
            >
              Sort by Newest⌄
            </button>

          </div>

          <div className="job-list">

            {/* LOADING */}

            {loading && (

              <div className="empty">
                Loading jobs...
              </div>

            )}

            {/* ERROR */}

            {!loading && error && (

              <div className="error-box">
                {error}
              </div>

            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              filtered.length === 0 && (

                <div className="empty">
                  No jobs found.
                </div>

              )}

            {/* JOBS */}

            {!loading &&
              !error &&
              filtered.length > 0 &&
              filtered.map(
                (job, index) => (

                  <button
                    type="button"
                    className={`card job-row ${
                      selected?.id === job.id
                        ? 'selected'
                        : ''
                    }`}
                    key={job.id}
                    onClick={() =>
                      setSelected(job)
                    }
                  >

                    {/* COMPANY LOGO */}

                    <div
                      className={`company-logo logo-${
                        index % 5
                      }`}
                    >
                      {(job.company_name ||
                        'M')[0]}
                    </div>

                    {/* JOB INFORMATION */}

                    <div className="job-row-main">

                      <div className="job-title-line">

                        <div>

                          <b>
                            {job.title}
                          </b>

                          <span>
                            {job.company_name}
                          </span>

                        </div>

                        <strong>
                          {job.salary ||
                            '$ —'}
                        </strong>

                      </div>

                      <div className="job-meta">

                        <span>
                          ⌖ {job.location}
                        </span>

                        <span>
                          ◷ {index + 2}{' '}
                          days ago
                        </span>

                      </div>

                      <div className="tags">

                        <span>
                          {job.employment_type}
                        </span>

                        <span>
                          {job.work_mode}
                        </span>

                      </div>

                    </div>

                    <Icon
                      name="bookmark"
                      size={16}
                    />

                  </button>

                )
              )}

          </div>

        </section>

        {/* =================================================
            JOB DETAILS
        ================================================= */}

        <aside className="card job-detail">

          {selected ? (

            <>

              {/* TOP */}

              <div className="detail-top">

                <button
                  type="button"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  ‹ Back to jobs
                </button>

                <span>
                  ♡ ↗
                </span>

              </div>

              {/* COMPANY */}

              <div className="detail-company">

                <div className="company-logo logo-0">

                  {(selected.company_name ||
                    'M')[0]}

                </div>

                <div>

                  <h2>
                    {selected.title}
                  </h2>

                  <b>
                    {selected.company_name}{' '}
                    ✓
                  </b>

                </div>

              </div>

              {/* META */}

              <div className="detail-meta">

                <span>
                  ⌖ {selected.location}
                </span>

                <span>
                  ◷ {selected.salary ||
                    '$ —'}
                </span>

              </div>

              {/* TAGS */}

              <div className="tags">

                <span>
                  {selected.employment_type}
                </span>

                <span>
                  {selected.work_mode}
                </span>

              </div>

              {/* DESCRIPTION */}

              <h3>
                Job Description
              </h3>

              <p>
                {selected.description ||
                  'No job description provided.'}
              </p>

              {/* RESPONSIBILITIES */}

              <h3>
                Key Responsibilities
              </h3>

              <ul>

                <li>
                  Support core team
                  objectives and daily tasks.
                </li>

                <li>
                  Collaborate with team
                  members to deliver results.
                </li>

              </ul>

              {/* FOOTER */}

              <div className="detail-footer">

                <span>

                  ◷ Posted

                  <br />

                  <b>
                    2 days ago
                  </b>

                </span>

                <span>

                  ▣ Deadline

                  <br />

                  <b>
                    Open
                  </b>

                </span>

                <span>

                  ◉ Views

                  <br />

                  <b>
                    1.2k
                  </b>

                </span>

              </div>

              {/* APPLY */}

              <button
                type="button"
                className="btn btn-primary full"
                onClick={
                  openApplyModal
                }
              >
                ✈ Apply Now
              </button>

              {/* SAVE */}

              <button
                type="button"
                className="btn btn-secondary full"
                onClick={() =>
                  alert(
                    'Job saved successfully!'
                  )
                }
              >
                ♡ Save Job
              </button>

              {/* VERIFIED */}

              <div className="verified">
                🛡 This job was verified
                by MNC Resume Studio
              </div>

            </>

          ) : (

            <div className="empty">
              Select a job to see details.
            </div>

          )}

        </aside>

      </div>

      {/* =================================================
          APPLICATION MODAL
      ================================================= */}

      {modal && (

        <div className="modal-backdrop">

          <form
            className="modal"
            onSubmit={apply}
          >

            {/* CLOSE */}

            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
            >
              ×
            </button>

            {/* TITLE */}

            <h2>
              Apply for{' '}
              {selected?.title}
            </h2>

            <p>
              Upload your resume as a
              PDF (max 2MB).
            </p>

            {/* RESUME */}

            <label>

              Resume

              <input
                type="file"
                accept="application/pdf,.pdf"
                required
                onChange={(e) => {

                  const selectedFile =
                    e.target.files?.[0] ||
                    null;

                  setFile(
                    selectedFile
                  );

                }}
              />

            </label>

            {/* COVER LETTER */}

            <label>

              Cover letter

              <textarea
                value={cover}
                onChange={(e) =>
                  setCover(
                    e.target.value
                  )
                }
                rows="5"
                placeholder="Tell the employer why you're a good fit..."
              />

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              className="btn btn-primary full"
            >
              Submit Application
            </button>

          </form>

        </div>

      )}

    </div>
  );
}