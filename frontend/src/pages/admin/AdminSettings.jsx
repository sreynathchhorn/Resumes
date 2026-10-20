import { useState } from 'react';
import Icon from '../../components/Icon';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'MNC Resume Studio',
    emailNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
  });

  const updateSetting = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="page-content">
      <section className="hero-banner admin-banner">
        <div>
          <span className="eyebrow">ADMIN · SETTINGS</span>
          <h1>Admin Settings</h1>
          <p>
            Manage your portal preferences and system settings.
          </p>
        </div>

        <div className="admin-shield">
          <Icon name="settings" size={32} />
        </div>
      </section>

      <div className="admin-settings-grid">

        {/* General Settings */}
        <section className="card admin-setting-card">
          <div className="setting-heading">
            <div className="setting-icon purple">
              <Icon name="settings" size={20} />
            </div>

            <div>
              <h2>General Settings</h2>
              <p>Basic information about your application portal.</p>
            </div>
          </div>

          <div className="setting-form">
            <label>
              Portal Name

              <input
                type="text"
                value={settings.siteName}
                onChange={e =>
                  updateSetting('siteName', e.target.value)
                }
              />
            </label>

            <button className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="card admin-setting-card">
          <div className="setting-heading">
            <div className="setting-icon blue">
              <Icon name="activity" size={20} />
            </div>

            <div>
              <h2>Notifications</h2>
              <p>Control administrator notification preferences.</p>
            </div>
          </div>

          <div className="setting-option">
            <div>
              <b>Email Notifications</b>
              <span>Receive important system notifications.</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e =>
                  updateSetting(
                    'emailNotifications',
                    e.target.checked
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* User Registration */}
        <section className="card admin-setting-card">
          <div className="setting-heading">
            <div className="setting-icon green">
              <Icon name="users" size={20} />
            </div>

            <div>
              <h2>User Registration</h2>
              <p>Control whether new candidates can register.</p>
            </div>
          </div>

          <div className="setting-option">
            <div>
              <b>Allow New Registration</b>
              <span>
                Candidates can create new accounts.
              </span>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={e =>
                  updateSetting(
                    'allowRegistration',
                    e.target.checked
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Maintenance */}
        <section className="card admin-setting-card">
          <div className="setting-heading">
            <div className="setting-icon orange">
              <Icon name="shield" size={20} />
            </div>

            <div>
              <h2>System Control</h2>
              <p>Control the availability of the portal.</p>
            </div>
          </div>

          <div className="setting-option">
            <div>
              <b>Maintenance Mode</b>
              <span>
                Temporarily disable normal portal access.
              </span>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e =>
                  updateSetting(
                    'maintenanceMode',
                    e.target.checked
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

      </div>
    </div>
  );
}