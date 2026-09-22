import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserPlus,
  Search,
  X,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { getStaff, addStaff, updateStaff, deleteStaff } from "../api";

/* ─── Constants ─────────────────────────────────────────────── */
const ROLES = ["Chef", "Waiter", "Manager", "Cashier", "Host", "Cleaner", "Security", "Other"];
const SHIFTS = ["Morning", "Evening", "Night"];
const STATUSES = ["Active", "On Leave", "Terminated"];

const ROLE_COLORS = {
  Chef:     { bg: "rgba(189,159,103,0.15)", color: "#bd9f67" },
  Manager:  { bg: "rgba(99,179,237,0.15)",  color: "#63b3ed" },
  Waiter:   { bg: "rgba(104,211,145,0.15)", color: "#68d391" },
  Cashier:  { bg: "rgba(183,148,246,0.15)", color: "#b794f6" },
  Host:     { bg: "rgba(246,173,85,0.15)",  color: "#f6ad55" },
  Cleaner:  { bg: "rgba(129,200,197,0.15)", color: "#81c8c5" },
  Security: { bg: "rgba(252,129,129,0.15)", color: "#fc8181" },
  Other:    { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

const SHIFT_ICONS = { Morning: "🌅", Evening: "🌆", Night: "🌙" };

const STATUS_CONFIG = {
  "Active":     { icon: CheckCircle, color: "#68d391" },
  "On Leave":   { icon: Clock,       color: "#f6ad55" },
  "Terminated": { icon: XCircle,     color: "#fc8181" },
};

const EMPTY_FORM = {
  name: "", role: "Waiter", email: "", phone: "",
  salary: "", shift: "Morning", status: "Active",
  joinDate: new Date().toISOString().split("T")[0], notes: "",
};

function getInitials(name = "") {
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
}

function avatarColor(name = "") {
  const palette = [
    "#bd9f67","#63b3ed","#68d391","#b794f6",
    "#f6ad55","#81c8c5","#fc8181","#a3bffa",
  ];
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

/* ─── Sub-components ─────────────────────────────────────────── */

function StatCard({ label, value, sub }) {
  return (
    <div className="staff-stat-card">
      <div className="staff-stat-label">{label}</div>
      <div className="staff-stat-value">{value}</div>
      {sub && <div className="staff-stat-sub">{sub}</div>}
    </div>
  );
}

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.Other;
  return (
    <span className="staff-role-badge" style={{ background: c.bg, color: c.color }}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Active"];
  const Icon = cfg.icon;
  return (
    <span className="staff-status-badge" style={{ color: cfg.color }}>
      <Icon size={12} strokeWidth={2} /> {status}
    </span>
  );
}

function StaffCard({ member, onEdit, onDelete }) {
  const initials = getInitials(member.name);
  const aColor   = avatarColor(member.name);

  return (
    <div className="staff-card">
      <div className="staff-card-top">
        <div className="staff-card-avatar" style={{ background: aColor + "22", color: aColor, border: `1.5px solid ${aColor}55` }}>
          {initials}
        </div>
        <div className="staff-card-actions">
          <button className="admin-icon-btn small" title="Edit" onClick={() => onEdit(member)}>
            <Edit2 size={13} />
          </button>
          <button className="admin-icon-btn small staff-delete-btn" title="Delete" onClick={() => onDelete(member)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="staff-card-name">{member.name}</div>
      <div className="staff-card-meta">
        <RoleBadge role={member.role} />
        <StatusBadge status={member.status} />
      </div>

      <div className="staff-card-details">
        <div className="staff-detail-row">
          <span className="staff-detail-label">Shift</span>
          <span className="staff-detail-val">{SHIFT_ICONS[member.shift]} {member.shift}</span>
        </div>
        {member.salary > 0 && (
          <div className="staff-detail-row">
            <span className="staff-detail-label">Salary</span>
            <span className="staff-detail-val">Rs {Number(member.salary).toLocaleString("en-PK")}</span>
          </div>
        )}
        {member.phone && (
          <div className="staff-detail-row">
            <span className="staff-detail-label">Phone</span>
            <span className="staff-detail-val">{member.phone}</span>
          </div>
        )}
        {member.joinDate && (
          <div className="staff-detail-row">
            <span className="staff-detail-label">Joined</span>
            <span className="staff-detail-val">
              {new Date(member.joinDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        )}
      </div>

      {member.notes && (
        <div className="staff-card-notes">{member.notes}</div>
      )}
    </div>
  );
}

function StaffModal({ open, title, form, onChange, onSubmit, onClose, loading }) {
  if (!open) return null;

  const field = (label, name, type = "text", placeholder = "") => (
    <div className="staff-field">
      <label className="staff-field-label">{label}</label>
      <input
        type={type}
        className="staff-field-input"
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );

  const select = (label, name, options) => (
    <div className="staff-field">
      <label className="staff-field-label">{label}</label>
      <div className="staff-select-wrap">
        <select
          className="staff-field-select"
          value={form[name]}
          onChange={(e) => onChange(name, e.target.value)}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="staff-select-chevron" />
      </div>
    </div>
  );

  return (
    <div className="staff-modal-backdrop" onClick={onClose}>
      <div className="staff-modal" onClick={(e) => e.stopPropagation()}>
        <div className="staff-modal-header">
          <h2 className="staff-modal-title">{title}</h2>
          <button className="admin-icon-btn small" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="staff-modal-body">
          <div className="staff-form-grid">
            {field("Full Name *", "name", "text", "e.g. Ahmed Khan")}
            {select("Role *", "role", ROLES)}
            {field("Email", "email", "email", "email@example.com")}
            {field("Phone", "phone", "tel", "+92 300 0000000")}
            {field("Salary (Rs)", "salary", "number", "0")}
            {select("Shift", "shift", SHIFTS)}
            {select("Status", "status", STATUSES)}
            {field("Join Date", "joinDate", "date")}
          </div>
          <div className="staff-field staff-field--full">
            <label className="staff-field-label">Notes</label>
            <textarea
              className="staff-field-textarea"
              placeholder="Any additional notes…"
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="staff-modal-footer">
          <button className="staff-btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="staff-btn-primary" onClick={onSubmit} disabled={loading}>
            {loading ? "Saving…" : "Save Staff Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, member, onConfirm, onClose, loading }) {
  if (!open || !member) return null;
  return (
    <div className="staff-modal-backdrop" onClick={onClose}>
      <div className="staff-modal staff-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="staff-modal-header">
          <h2 className="staff-modal-title">Remove Staff Member</h2>
          <button className="admin-icon-btn small" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="staff-modal-body">
          <p className="staff-confirm-text">
            Are you sure you want to remove <strong>{member.name}</strong> from the team? This action cannot be undone.
          </p>
        </div>
        <div className="staff-modal-footer">
          <button className="staff-btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="staff-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */

export default function StaffManagement() {
  const [staff, setStaff]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showAdd, setShowAdd]         = useState(false);
  const [showEdit, setShowEdit]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [selected, setSelected]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState("");

  /* ── Fetch ── */
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStaff();
      setStaff(data.staff || []);
    } catch (err) {
      setError(err.message || "Failed to load staff.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  /* ── Toast helper ── */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── Form helpers ── */
  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => { setForm(EMPTY_FORM); setShowAdd(true); };

  const openEdit = (member) => {
    setSelected(member);
    setForm({
      name:     member.name     || "",
      role:     member.role     || "Waiter",
      email:    member.email    || "",
      phone:    member.phone    || "",
      salary:   member.salary   ?? "",
      shift:    member.shift    || "Morning",
      status:   member.status   || "Active",
      joinDate: member.joinDate ? member.joinDate.split("T")[0] : "",
      notes:    member.notes    || "",
    });
    setShowEdit(true);
  };

  const openDelete = (member) => { setSelected(member); setShowDelete(true); };

  /* ── CRUD ── */
  const handleAdd = async () => {
    if (!form.name.trim()) { showToast("⚠️ Name is required."); return; }
    if (!form.role)        { showToast("⚠️ Role is required."); return; }
    try {
      setSaving(true);
      await addStaff({ ...form, salary: form.salary === "" ? 0 : Number(form.salary) });
      setShowAdd(false);
      await fetchStaff();
      showToast("✅ Staff member added successfully.");
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!form.name.trim()) { showToast("⚠️ Name is required."); return; }
    try {
      setSaving(true);
      await updateStaff(selected._id, { ...form, salary: form.salary === "" ? 0 : Number(form.salary) });
      setShowEdit(false);
      await fetchStaff();
      showToast("✅ Staff member updated.");
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteStaff(selected._id);
      setShowDelete(false);
      await fetchStaff();
      showToast("✅ Staff member removed.");
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  /* ── Derived stats ── */
  const total      = staff.length;
  const active     = staff.filter((s) => s.status === "Active").length;
  const onLeave    = staff.filter((s) => s.status === "On Leave").length;
  const terminated = staff.filter((s) => s.status === "Terminated").length;

  /* ── Filtered list ── */
  const visible = staff.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q);
    const matchRole   = roleFilter === "All" || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  /* ── Render ── */
  return (
    <div className="staff-root">
      {/* Toast */}
      {toast && <div className="staff-toast">{toast}</div>}

      {/* Stats */}
      <div className="staff-stats-row">
        <StatCard label="Total Staff"  value={total}      sub="All roles" />
        <StatCard label="Active"       value={active}     sub="Working now" />
        <StatCard label="On Leave"     value={onLeave}    sub="Temporary absence" />
        <StatCard label="Terminated"   value={terminated} sub="No longer active" />
      </div>

      {/* Toolbar */}
      <div className="staff-toolbar">
        <div className="staff-filters">
          <div className="admin-search staff-search">
            <Search size={14} />
            <input
              placeholder="Search by name, role, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="staff-role-filter">
            {["All", ...ROLES].map((r) => (
              <button
                key={r}
                className={`staff-filter-chip${roleFilter === r ? " active" : ""}`}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button className="staff-btn-primary staff-add-btn" onClick={openAdd}>
          <UserPlus size={15} />
          Add Staff
        </button>
      </div>

      {/* Content */}
      {loading && (
        <div className="staff-empty">
          <div className="staff-spinner" />
          <p>Loading staff…</p>
        </div>
      )}

      {!loading && error && (
        <div className="staff-empty staff-error">
          <p>{error}</p>
          <button className="staff-btn-secondary" onClick={fetchStaff}>Retry</button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="staff-empty">
          <Users size={48} strokeWidth={1} color="rgba(255,255,255,0.15)" />
          <p>{search || roleFilter !== "All" ? "No staff match your filters." : "No staff members yet. Add your first team member!"}</p>
          {(!search && roleFilter === "All") && (
            <button className="staff-btn-primary" onClick={openAdd}>
              <UserPlus size={14} /> Add Staff Member
            </button>
          )}
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="staff-grid">
          {visible.map((m) => (
            <StaffCard key={m._id} member={m} onEdit={openEdit} onDelete={openDelete} />
          ))}
        </div>
      )}

      {/* Modals */}
      <StaffModal
        open={showAdd}
        title="Add New Staff Member"
        form={form}
        onChange={handleChange}
        onSubmit={handleAdd}
        onClose={() => setShowAdd(false)}
        loading={saving}
      />
      <StaffModal
        open={showEdit}
        title="Edit Staff Member"
        form={form}
        onChange={handleChange}
        onSubmit={handleEdit}
        onClose={() => setShowEdit(false)}
        loading={saving}
      />
      <DeleteConfirmModal
        open={showDelete}
        member={selected}
        onConfirm={handleDelete}
        onClose={() => setShowDelete(false)}
        loading={saving}
      />
    </div>
  );
}
