
import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import api from '../api/api';
import Icon from '../components/Icon';

const blank = {
  title: 'Information Technology Student',
  bio: '',
  phone: '',
  location: 'Phnom Penh, Cambodia',
  skills: 'C, Laravel, React, MySQL, Git',
  experience: '',
  education: 'Bachelor of Information Technology — Year 1',
  portfolio_url: '',
};

export default function MyResume() {
  const [form, setForm] = useState(blank);
  const [notice, setNotice] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Profile photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  // Reference to the resume preview for PDF generation
  const resumePaperRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // LOAD PROFILE
  useEffect(() => {
    let active = true;

    api
      .get('/profile')
      .then((r) => {
        if (!active) return;

        const profile = r.data?.profile || r.data || {};

        setForm({
          ...blank,
          ...profile,
          skills: profile.skills || '',
          bio: profile.bio || '',
          phone: profile.phone || '',
          location: profile.location || blank.location,
          experience: profile.experience || '',
          education: profile.education || '',
          portfolio_url: profile.portfolio_url || '',
          title: profile.title || blank.title,
        });

        const existingPhoto =
          profile.profile_photo_url ||
          profile.photo_url ||
          profile.avatar_url ||
          '';

        if (existingPhoto) {
          setPhotoPreview(existingPhoto);
        }
      })
      .catch(() => {
        // Keep default form if profile cannot be loaded.
      });

    return () => {
      active = false;
    };
  }, []);

  // CLEAN UP LOCAL PHOTO PREVIEW
  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // HANDLE INPUT
  const change = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // SELECT PROFILE PHOTO
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Please choose a valid image file.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice('Please choose an image smaller than 2 MB.');
      e.target.value = '';
      return;
    }

    setPhotoPreview((previous) => {
      if (previous.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }

      return URL.createObjectURL(file);
    });

    setPhotoFile(file);
    setNotice('Photo selected. Save your profile photo to keep it.');
  };

  // SKILLS
  const skills = (form.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      setNotice('Please enter a skill.');
      return;
    }

    const alreadyExists = skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setNotice('This skill has already been added.');
      return;
    }

    setForm((previous) => ({
      ...previous,
      skills: [...skills, skill].join(', '),
    }));

    setNewSkill('');
    setShowSkillInput(false);
    setNotice('');
  };

  const removeSkill = (skillToRemove) => {
    setForm((previous) => ({
      ...previous,
      skills: skills
        .filter((skill) => skill !== skillToRemove)
        .join(', '),
    }));
  };

  // SAVE RESUME
  const save = async () => {
    try {
      setNotice('');
      setPhotoLoading(true);

      const response = await api.put('/profile', {
        ...form,
        skills: form.skills || '',
      });

      const savedProfile =
        response.data?.profile || response.data || {};

      setForm((previous) => ({
        ...previous,
        ...savedProfile,
        skills: savedProfile.skills ?? previous.skills ?? '',
      }));

      if (photoFile) {
        setNotice(
          'Resume saved, but the photo still needs backend upload support.'
        );
      } else {
        setNotice('Resume saved successfully.');
      }
    } catch (e) {
      setNotice(
        e.response?.data?.message || 'Could not save resume.'
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  // DOWNLOAD RESUME AS PDF
  const downloadPDF = async () => {
    const element = resumePaperRef.current;

    if (!element) {
      setNotice('Could not find the resume preview.');
      return;
    }

    if (pdfLoading) return;

    try {
      setPdfLoading(true);
      setNotice('Preparing your resume PDF...');

      const safeName = (form.title || 'MNC-Resume')
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, '-');

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `${safeName || 'MNC-Resume'}.pdf`,
          image: {
            type: 'jpeg',
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
          pagebreak: {
            mode: ['css', 'legacy'],
          },
        })
        .from(element)
        .save();

      setNotice('Resume PDF downloaded successfully.');
    } catch (error) {
      console.error('PDF download error:', error);
      setNotice('Could not download the PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const photoElement = (className) =>
    photoPreview ? (
      <img
        src={photoPreview}
        alt="Profile"
        className={`${className} profile-photo-image`}
      />
    ) : null;

  return (
    <div className="page-content">
      {/* HERO */}
      <section className="hero-banner">
        <div className="resume-photo-wrapper">
          {photoPreview ? (
            photoElement('resume-avatar')
          ) : (
            <div className="resume-avatar">
              {form.title?.[0] || 'R'}
            </div>
          )}

          <label className="profile-photo-upload">
            <Icon name="camera" size={14} />
            <span>Upload Photo</span>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </label>
        </div>

        <div>
          <span className="eyebrow">MY RESUME</span>
          <h1>Build a resume that represents you.</h1>
          <p>
            Save your information once and keep it ready
            for every application.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={photoLoading}
        >
          {photoLoading ? 'Saving...' : 'Save Resume'}
        </button>
      </section>

      {/* NOTICE */}
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}

      {/* RESUME LAYOUT */}
      <div className="resume-layout">
        {/* LEFT - EDITOR */}
        <section className="card editor">
          <div className="section-title">
            <div>
              <h2>Resume Information</h2>
              <span>Keep your professional details updated.</span>
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <div className="form-grid">
            {[
              ['title', 'Professional Title'],
              ['phone', 'Phone'],
              ['location', 'Location'],
              ['portfolio_url', 'Portfolio URL'],
            ].map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  type="text"
                  name={name}
                  value={form[name] || ''}
                  onChange={change}
                  placeholder={label}
                />
              </label>
            ))}
          </div>

          {/* ABOUT ME */}
          <label>
            About Me
            <textarea
              name="bio"
              value={form.bio || ''}
              onChange={change}
              rows="4"
              placeholder="Write a short professional summary..."
            />
          </label>

          {/* EDUCATION */}
          <label>
            Education
            <textarea
              name="education"
              value={form.education || ''}
              onChange={change}
              rows="4"
              placeholder="Enter your education..."
            />
          </label>

          {/* SKILLS */}
          <div className="skills-editor">
            <div className="skills-editor-header">
              <div>
                <b>Skills</b>
                <small>
                  Add the skills you want to show on your resume.
                </small>
              </div>

              <button
                type="button"
                className="add-skills-btn"
                onClick={() => {
                  setShowSkillInput(true);
                  setNotice('');
                }}
              >
                + Add your skills
              </button>
            </div>

            <div className="skills-list">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span className="skill-item" key={skill}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="no-skills">
                  No skills added yet.
                </span>
              )}
            </div>

            {showSkillInput && (
              <div className="skill-add-box">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Example: JavaScript"
                  autoFocus
                />

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addSkill}
                >
                  Add Skill
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowSkillInput(false);
                    setNewSkill('');
                    setNotice('');
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* EXPERIENCE */}
          <label>
            Experience
            <textarea
              name="experience"
              value={form.experience || ''}
              onChange={change}
              rows="5"
              placeholder="Your experience, internships, projects..."
            />
          </label>

          {/* PROJECTS */}
          <div className="resume-extra">
            <div>
              <b>Projects</b>
              <p>
                Add school or personal projects to make
                your resume stronger.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setNotice('Project feature coming next.')}
            >
              + Add Project
            </button>
          </div>

          {/* CERTIFICATIONS */}
          <div className="resume-extra">
            <div>
              <b>Certifications</b>
              <p>
                Add relevant certificates and achievements.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setNotice('Certificate feature coming next.')
              }
            >
              + Add Certificate
            </button>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={photoLoading}
          >
            <Icon name="check" size={14} />
            {photoLoading ? 'Saving...' : 'Save Resume'}
          </button>
        </section>

        {/* RIGHT - PREVIEW */}
        <aside className="card preview">
          <div className="preview-head">
            <h2>Resume Preview</h2>

            <button
              type="button"
              className="icon-button"
              onClick={downloadPDF}
              disabled={pdfLoading}
              title="Download resume as PDF"
              aria-label="Download resume as PDF"
            >
              {pdfLoading ? (
                <span>...</span>
              ) : (
                <Icon name="download" size={16} />
              )}
            </button>
          </div>

          {/* RESUME PAPER - THIS ELEMENT IS EXPORTED TO PDF */}
          <div className="paper" ref={resumePaperRef}>
            <div className="paper-head">
              {photoPreview ? (
                photoElement('paper-avatar')
              ) : (
                <div className="paper-avatar">
                  {form.title?.[0] || 'R'}
                </div>
              )}

              <div>
                <h2>{form.title || 'Your Name'}</h2>
                <b>{form.location}</b>
                <small>
                  {form.phone}
                  {form.portfolio_url && ` · ${form.portfolio_url}`}
                </small>
              </div>
            </div>

            <div className="paper-section">
              <h4>PROFILE</h4>
              <p>
                {form.bio ||
                  'Your professional summary will appear here.'}
              </p>
            </div>

            <div className="paper-section">
              <h4>SKILLS</h4>
              <div className="skill-pills">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <span>Add your skills.</span>
                )}
              </div>
            </div>

            <div className="paper-section">
              <h4>EDUCATION</h4>
              <p>{form.education || 'Add your education.'}</p>
            </div>

            <div className="paper-section">
              <h4>EXPERIENCE</h4>
              <p>
                {form.experience ||
                  'Add your experience and projects.'}
              </p>
            </div>
          </div>

          <p className="preview-note">
            Your selected photo appears in this preview.
          </p>
        </aside>
      </div>
    </div>
  );
}
