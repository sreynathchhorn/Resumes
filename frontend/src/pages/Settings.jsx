import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Icon from "../components/Icon";


export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState(true);
  const [saved, setSaved] = useState(false);

  const signout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      // Even if the API logout fails, clear local authentication.
    }

    logout();
    navigate("/login");
  };

  const savePreferences = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  return (
    <div className="settings-page">

      {/* Hero */}
      <section className="settings-hero">
        <span className="settings-eyebrow">
          ACCOUNT SETTINGS
        </span>

        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem", color: "#1f2937" }}>
          Make MNC Resume Studio work for you.
        </h1>

        <p style={{ fontSize: "0.95rem", color: "#4b5563" }}>
          Control notifications, privacy, and your account preferences.
        </p>
      </section>


      {/* Notifications */}
      <section className="settings-card">

        <div className="settings-card-header">
          <h2>Notifications</h2>
          <p>
            Choose which updates you would like to receive.
          </p>
        </div>

        <div className="settings-row">

          <div className="settings-row-icon">
            <Icon name="bell" size={17} />
          </div>

          <div className="settings-row-content">
            <b>Application updates</b>

            <p>
              Get notified when an application status changes.
            </p>
          </div>

          <button
            type="button"
            className={`switch ${notifications ? "on" : ""}`}
            onClick={() => setNotifications(!notifications)}
            aria-label="Toggle application notifications"
          >
            <span />
          </button>

        </div>


        <div className="settings-row">

          <div className="settings-row-icon">
            <Icon name="mail" size={17} />
          </div>

          <div className="settings-row-content">
            <b>Email recommendations</b>

            <p>
              Receive occasional job recommendations.
            </p>
          </div>

          <button
            type="button"
            className={`switch ${email ? "on" : ""}`}
            onClick={() => setEmail(!email)}
            aria-label="Toggle email recommendations"
          >
            <span />
          </button>

        </div>

      </section>


      {/* Privacy & Security */}
      <section className="settings-card">

        <div className="settings-card-header">
          <h2>Privacy &amp; Security</h2>
          <p>
            Manage your account security and profile visibility.
          </p>
        </div>


        <div className="settings-row">

          <div className="settings-row-icon">
            <Icon name="lock" size={17} />
          </div>

          <div className="settings-row-content">
            <b>Account security</b>

            <p>
              Your API requests are protected by Laravel Sanctum authentication.
            </p>
          </div>

          <button
            type="button"
            className="settings-review-btn"
          >
            Review
          </button>

        </div>


        <div className="settings-row">

          <div className="settings-row-icon">
            <Icon name="shield" size={17} />
          </div>

          <div className="settings-row-content">
            <b>Profile visibility</b>

            <p>
              Your profile is used to support your applications.
            </p>
          </div>

          <span className="settings-private">
            Private
          </span>

        </div>

      </section>


      {/* Account */}
      <section className="settings-card">

        <div className="settings-card-header">
          <h2>Account</h2>
          <p>
            Save your preferences or sign out of your account.
          </p>
        </div>

        <div className="settings-actions">

          <button
            type="button"
            className="settings-save-btn"
            onClick={savePreferences}
          >
            {saved ? "Saved ✓" : "Save Preferences"}
          </button>


          <button
            type="button"
            className="settings-logout-btn"
            onClick={signout}
          >
            <Icon name="logout" size={15} />
            Log out
          </button>

        </div>

      </section>


      <div className="settings-motto">
        Your privacy. Your profile. Your future. 🌿
      </div>

    </div>
  );
}