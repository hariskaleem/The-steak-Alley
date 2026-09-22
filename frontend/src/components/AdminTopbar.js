import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";

export default function AdminTopbar({ title, subtitle }) {
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  const userInitials = storedUser
    ? `${(storedUser.firstName || "")[0] || ""}${(storedUser.lastName || "")[0] || ""}`.toUpperCase() || "AD"
    : "AD";
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <div className="admin-topbar">
      <div>
        <h1 className="admin-topbar-title">{title}</h1>
        {subtitle && <p className="admin-topbar-subtitle">{subtitle}</p>}
      </div>

      <div className="admin-topbar-actions">
        <div className="admin-search">
          <Search size={15} strokeWidth={1.8} />
          <input type="text" placeholder="Search orders, menu items..." />
        </div>

        <button type="button" className="admin-icon-btn" aria-label="Notifications">
          <Bell size={17} strokeWidth={1.8} />
        </button>

        <div className="admin-profile" ref={profileRef}>
          <button
            type="button"
            className="admin-profile-trigger"
            onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            aria-label="Open admin account menu">
            <span className="admin-avatar">{userInitials}</span>
            <ChevronDown size={14} strokeWidth={1.8} />
          </button>

          {isProfileOpen && (
            <div className="admin-profile-menu" role="menu">
              <button type="button" className="admin-logout-btn" onClick={handleLogout} role="menuitem">
                <LogOut size={15} strokeWidth={1.8} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
