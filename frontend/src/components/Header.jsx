import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import Icon from "./Icon";
import "./Header.css";

import logoImg from "../assets/logo.PNG"; 

export default function Header({ onMenu }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const signout = async () => {
    try {
      await api.post("/logout");
    } catch {}

    logout();
    nav("/login");
  };

  const homePath =
    user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="topbar">

      {/* LEFT SIDE */}
      <div className="header-brand-area">

        {/* Mobile Menu */}
        <button
          type="button"
          className="icon-button mobile-only"
          onClick={onMenu}
        >
          <Icon name="menu" />
        </button>

        {/* Brand Link containing both logos */}
        <Link
          to={homePath}
          className="header-brand"
        >
          <img 
            src={logoImg} 
            alt="MNC Logo" 
            className="script-logo-img" 
            style={{ height: "42px", width: "auto" }}
          />

          <div className="brand-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="brand-symbol" style={{ fontSize: "1.2rem", color: "#6366f1" }}>✿</span>
            <span className="brand-text" style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}>
              <strong style={{ fontWeight: "800", color: "#000000" }}>MNC</strong>
              <b style={{ fontWeight: "700", marginLeft: "4px", color: "#000000" }}>Resume Studio</b>
            </span>
          </div>
        </Link>

      </div>

      {/* RIGHT SIDE */}
      <div className="top-actions">
        {/* Notifications */}
        <button
          type="button"
          className="icon-button notification-button"
        >
          <Icon name="bell" size={17} />
          <em></em>
        </button>

        {/* Profile */}
        <div className="profile-wrap">
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setOpen(!open)}
          >
            <span className="avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>

            <strong className="desktop-name">
              {user?.name || "User"}
            </strong>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="profile-dropdown">
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin"
                    : "/profile"
                }
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <button onClick={signout}>
                <Icon name="logout" size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}