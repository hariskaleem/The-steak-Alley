import React, { useState, useEffect } from "react";
import {
  UserCog,
  Clock,
  Bell,
  Shield,
  Save,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Plus,
  KeyRound,
  X,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { getAdmins, createAdmin, changeAdminPassword } from "../api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const defaultHours = DAYS.map((day) => ({
  day,
  open: day === "Sunday" ? false : true,
  from: "09:00",
  to: "22:00",
}));

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <span className="settings-card-icon">
          <Icon size={16} strokeWidth={1.8} />
        </span>
        <div>
          <h3 className="settings-card-title">{title}</h3>
          {subtitle && <p className="settings-card-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="settings-card-body">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      className={`settings-toggle-btn${on ? " on" : ""}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}>
      {on ? <ToggleRight size={22} strokeWidth={1.8} /> : <ToggleLeft size={22} strokeWidth={1.8} />}
    </button>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="settings-pw-wrap">
      <input
        className="admin-form-input"
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "min 6 characters"}
        style={{ paddingRight: "38px" }}
      />
      <button type="button" className="settings-pw-eye" onClick={() => setShow((s) => !s)} tabIndex={-1}>
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

function AdminManagement() {
  const me = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [createStatus, setCreateStatus] = useState({ loading: false, error: "", success: "" });
  const [pwTarget, setPwTarget] = useState(null);
  const [newPw, setNewPw] = useState("");
  const [pwStatus, setPwStatus] = useState({ loading: false, error: "", success: "" });

  const loadAdmins = () => {
    setLoading(true);
    setError("");
    getAdmins()
      .then((d) => setAdmins(d.admins || []))
      .catch((e) => setError(e.message || "Failed to load admins"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateStatus({ loading: true, error: "", success: "" });
    try {
      await createAdmin(createForm);
      setCreateStatus({ loading: false, error: "", success: "Admin created successfully!" });
      setCreateForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
      setShowCreate(false);
      loadAdmins();
    } catch (err) {
      setCreateStatus({ loading: false, error: err.message || "Failed to create admin", success: "" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPw || newPw.length < 6) {
      setPwStatus({ loading: false, error: "Password must be at least 6 characters.", success: "" });
      return;
    }
    setPwStatus({ loading: true, error: "", success: "" });
    try {
      await changeAdminPassword(pwTarget._id, newPw);
      setPwStatus({ loading: false, error: "", success: "Password updated!" });
      setNewPw("");
      setTimeout(() => {
        setPwTarget(null);
        setPwStatus({ loading: false, error: "", success: "" });
      }, 1500);
    } catch (err) {
      setPwStatus({ loading: false, error: err.message || "Failed to update password", success: "" });
    }
  };

  return (
    <div className="admin-mgmt-root">
      <div className="admin-mgmt-header">
        <p className="settings-section-label" style={{ margin: 0 }}>
          All Admins
        </p>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => {
            setShowCreate((s) => !s);
            setCreateStatus({ loading: false, error: "", success: "" });
          }}>
          <Plus size={14} />
          {showCreate ? "Cancel" : "New Admin"}
        </button>
      </div>

      {loading && (
        <div className="admin-mgmt-loading">
          <Loader size={16} className="admin-mgmt-spin" /> Loading admins…
        </div>
      )}
      {error && <p className="admin-mgmt-error">{error}</p>}

      {!loading && !error && (
        <div className="admin-mgmt-list">
          {admins.map((a) => {
            const isMe = me && (me.id === a._id || me._id === a._id);
            const isPwTarget = pwTarget && pwTarget._id === a._id;
            return (
              <div key={a._id} className={`admin-mgmt-row${isPwTarget ? " active" : ""}`}>
                <div className="admin-mgmt-avatar">{(a.firstName?.[0] || "A").toUpperCase()}</div>
                <div className="admin-mgmt-info">
                  <p className="admin-mgmt-name">
                    {a.firstName} {a.lastName}
                    {isMe && <span className="admin-mgmt-you-badge">You</span>}
                  </p>
                  <p className="admin-mgmt-email">{a.email}</p>
                </div>
                <button
                  type="button"
                  className={`admin-mgmt-pw-btn${isPwTarget ? " active" : ""}`}
                  onClick={() => {
                    setPwTarget(isPwTarget ? null : a);
                    setNewPw("");
                    setPwStatus({ loading: false, error: "", success: "" });
                  }}>
                  <KeyRound size={14} strokeWidth={2} />
                  {isPwTarget ? "Cancel" : "Change Password"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {pwTarget && (
        <form className="admin-mgmt-panel" onSubmit={handleChangePassword}>
          <div className="admin-mgmt-panel-title">
            <KeyRound size={14} />
            Change password for{" "}
            <strong>
              {pwTarget.firstName} {pwTarget.lastName}
            </strong>
            <button type="button" className="admin-mgmt-panel-close" onClick={() => setPwTarget(null)}>
              <X size={14} />
            </button>
          </div>
          <div className="admin-mgmt-panel-body">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">New Password</label>
              <PasswordInput value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters" />
            </div>
            <button
              type="submit"
              className="settings-save-btn"
              disabled={pwStatus.loading}
              style={{ alignSelf: "flex-end" }}>
              {pwStatus.loading ? <Loader size={14} className="admin-mgmt-spin" /> : <Save size={14} />} Update
            </button>
          </div>
          {pwStatus.error && (
            <p className="admin-mgmt-error" style={{ marginTop: "8px" }}>
              {pwStatus.error}
            </p>
          )}
          {pwStatus.success && (
            <p className="admin-mgmt-success" style={{ marginTop: "8px" }}>
              <CheckCircle size={13} /> {pwStatus.success}
            </p>
          )}
        </form>
      )}

      {showCreate && (
        <form className="admin-mgmt-panel" onSubmit={handleCreate}>
          <div className="admin-mgmt-panel-title">
            <UserCheck size={14} /> Create New Admin
            <button type="button" className="admin-mgmt-panel-close" onClick={() => setShowCreate(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="settings-grid-2" style={{ marginTop: "1rem" }}>
            <div className="admin-form-group">
              <label className="admin-form-label">First Name</label>
              <input
                className="admin-form-input"
                value={createForm.firstName}
                onChange={(e) => setCreateForm((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="John"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Last Name</label>
              <input
                className="admin-form-input"
                value={createForm.lastName}
                onChange={(e) => setCreateForm((p) => ({ ...p, lastName: e.target.value }))}
                placeholder="Doe"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input
                className="admin-form-input"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@thesteakalley.com"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone</label>
              <input
                className="admin-form-input"
                value={createForm.phone}
                onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 555 000 0000"
                required
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Password</label>
              <PasswordInput
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>
          </div>
          {createStatus.error && (
            <p className="admin-mgmt-error" style={{ marginTop: "8px" }}>
              {createStatus.error}
            </p>
          )}
          {createStatus.success && (
            <p className="admin-mgmt-success" style={{ marginTop: "8px" }}>
              <CheckCircle size={13} /> {createStatus.success}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button type="submit" className="settings-save-btn" disabled={createStatus.loading}>
              {createStatus.loading ? <Loader size={14} className="admin-mgmt-spin" /> : <Plus size={14} />} Create
              Admin
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const savedHours = (() => {
    try {
      return JSON.parse(localStorage.getItem("sh_hours")) || defaultHours;
    } catch {
      return defaultHours;
    }
  })();
  const savedNotif = (() => {
    try {
      return JSON.parse(localStorage.getItem("sh_notif")) || null;
    } catch {
      return null;
    }
  })();
  const savedSystem = (() => {
    try {
      return JSON.parse(localStorage.getItem("sh_system")) || null;
    } catch {
      return null;
    }
  })();

  const [hours, setHours] = useState(savedHours);
  const [notif, setNotif] = useState(
    savedNotif || { newOrder: true, lowStock: true, dailyReport: false, staffLogin: false, customerReview: true },
  );
  const [system, setSystem] = useState(
    savedSystem || { maintenanceMode: false, acceptOnlineOrders: true, autoConfirmOrders: false },
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("sh_hours", JSON.stringify(hours));
    localStorage.setItem("sh_notif", JSON.stringify(notif));
    localStorage.setItem("sh_system", JSON.stringify(system));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const updateHour = (i, key, val) => setHours((prev) => prev.map((h, idx) => (idx === i ? { ...h, [key]: val } : h)));
  const toggleNotif = (key) => setNotif((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleSystem = (key) => setSystem((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="settings-root">
      <SectionCard icon={UserCog} title="Admin Management" subtitle="Create admins and manage passwords">
        <AdminManagement />
      </SectionCard>

      <SectionCard icon={Clock} title="Operating Hours" subtitle="Set your open and close times per day">
        <div className="settings-hours-list">
          {hours.map((h, i) => (
            <div key={h.day} className="settings-hour-row">
              <button
                type="button"
                className={`settings-day-toggle${h.open ? " on" : ""}`}
                onClick={() => updateHour(i, "open", !h.open)}>
                <span className="settings-day-dot" />
                {h.day}
              </button>
              {h.open ? (
                <div className="settings-hour-times">
                  <input
                    type="time"
                    className="admin-form-input settings-time-input"
                    value={h.from}
                    onChange={(e) => updateHour(i, "from", e.target.value)}
                  />
                  <span className="settings-hour-sep">to</span>
                  <input
                    type="time"
                    className="admin-form-input settings-time-input"
                    value={h.to}
                    onChange={(e) => updateHour(i, "to", e.target.value)}
                  />
                </div>
              ) : (
                <span className="settings-closed-label">Closed</span>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications" subtitle="Choose which events send you an alert">
        <div className="settings-toggle-list">
          {[
            { key: "newOrder", label: "New Orders", hint: "Alert when a customer places an order" },
            { key: "lowStock", label: "Low Stock Warning", hint: "Alert when a menu item runs low" },
            { key: "dailyReport", label: "Daily Summary Report", hint: "Email a sales summary at midnight" },
            { key: "staffLogin", label: "Staff Logins", hint: "Alert when a staff member signs in" },
            { key: "customerReview", label: "Customer Reviews", hint: "Alert when a new review is submitted" },
          ].map(({ key, label, hint }) => (
            <div key={key} className="settings-toggle-row">
              <div>
                <p className="settings-toggle-label">{label}</p>
                <p className="settings-toggle-hint">{hint}</p>
              </div>
              <Toggle on={notif[key]} onChange={() => toggleNotif(key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Shield} title="System" subtitle="Control core platform behaviour">
        <div className="settings-toggle-list">
          <div className="settings-toggle-row">
            <div>
              <p className="settings-toggle-label">Accept Online Orders</p>
              <p className="settings-toggle-hint">Customers can place orders through the website</p>
            </div>
            <Toggle on={system.acceptOnlineOrders} onChange={() => toggleSystem("acceptOnlineOrders")} />
          </div>
          <div className="settings-toggle-row">
            <div>
              <p className="settings-toggle-label">Auto-Confirm Orders</p>
              <p className="settings-toggle-hint">Orders skip manual review and go straight to preparing</p>
            </div>
            <Toggle on={system.autoConfirmOrders} onChange={() => toggleSystem("autoConfirmOrders")} />
          </div>
        </div>
        <div className="settings-danger-zone">
          <div className="settings-danger-header">
            <AlertTriangle size={13} strokeWidth={2} />
            <span>Danger Zone</span>
          </div>
          <div className="settings-toggle-row settings-danger-row">
            <div>
              <p className="settings-toggle-label" style={{ color: "#fc8181" }}>
                Maintenance Mode
              </p>
              <p className="settings-toggle-hint">Hides the site from customers</p>
            </div>
            <Toggle on={system.maintenanceMode} onChange={() => toggleSystem("maintenanceMode")} />
          </div>
        </div>
      </SectionCard>

      <div className="settings-save-bar">
        <p className="settings-save-hint">Save changes to operating hours, notifications &amp; system settings</p>
        <button type="button" className={`settings-save-btn${saved ? " saved" : ""}`} onClick={handleSave}>
          <Save size={14} strokeWidth={2} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
