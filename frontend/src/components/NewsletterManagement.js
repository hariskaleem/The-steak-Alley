import React, { useEffect, useMemo, useState } from "react";
import { Download, Mail, RefreshCw, Search, Trash2, Users } from "lucide-react";
import { deleteNewsletterSubscriber, getNewsletterSubscribers } from "../api";
import "./NewsletterManagement.css";

const FILTERS = ["All", "This month"];

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });

const isThisMonth = (date) => {
  const value = new Date(date);
  const now = new Date();
  return value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear();
};

const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNewsletterSubscribers();
      setSubscribers(data.subscribers || []);
    } catch (loadError) {
      setError(loadError.message || "Could not load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const visibleSubscribers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return subscribers.filter((subscriber) => {
      const matchesSearch = !normalizedSearch || subscriber.email.toLowerCase().includes(normalizedSearch);
      const matchesFilter = filter === "All" || isThisMonth(subscriber.createdAt);
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, subscribers]);

  const handleDelete = async (subscriber) => {
    if (!window.confirm(`Remove ${subscriber.email} from the newsletter?`)) return;

    try {
      await deleteNewsletterSubscriber(subscriber._id);
      setSubscribers((current) => current.filter((item) => item._id !== subscriber._id));
    } catch (deleteError) {
      setError(deleteError.message || "Could not remove subscriber.");
    }
  };

  const exportSubscribers = () => {
    const rows = [
      ["Email", "Subscribed on"],
      ...visibleSubscribers.map((subscriber) => [subscriber.email, formatDate(subscriber.createdAt)]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const thisMonthCount = subscribers.filter((subscriber) => isThisMonth(subscriber.createdAt)).length;

  return (
    <div className="newsletter-admin">
      <div className="admin-section-header newsletter-admin__header">
        <div>
          <span>Newsletter audience</span>
          <p className="newsletter-admin__intro">Manage subscribers and keep your mailing list tidy.</p>
        </div>
        <div className="newsletter-admin__actions">
          <button
            type="button"
            className="admin-icon-btn"
            onClick={loadSubscribers}
            title="Refresh subscribers"
            aria-label="Refresh subscribers">
            <RefreshCw size={15} className={loading ? "newsletter-spin" : ""} />
          </button>
          <button
            type="button"
            className="admin-add-btn"
            onClick={exportSubscribers}
            disabled={!visibleSubscribers.length}>
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="newsletter-stat-grid">
        <div className="newsletter-stat-card">
          <span>
            <Users size={15} /> Total subscribers
          </span>
          <strong>{subscribers.length}</strong>
        </div>
        <div className="newsletter-stat-card">
          <span>
            <UserPlusIcon /> New this month
          </span>
          <strong>{thisMonthCount}</strong>
        </div>
        <div className="newsletter-stat-card">
          <span>
            <Mail size={15} /> List status
          </span>
          <strong className="newsletter-stat-card__status">Healthy</strong>
        </div>
      </div>

      <div className="newsletter-toolbar">
        <label className="newsletter-search">
          <Search size={15} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by email" />
        </label>
        <div className="admin-filter-row newsletter-filters">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              className={`admin-filter-chip${filter === option ? " active" : ""}`}
              onClick={() => setFilter(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="newsletter-admin__error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table newsletter-table">
          <thead>
            <tr>
              <th>Email address</th>
              <th>Subscribed</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="admin-table-empty">
                  Loading subscribers…
                </td>
              </tr>
            ) : visibleSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="admin-table-empty">
                  No subscribers match your filters.
                </td>
              </tr>
            ) : (
              visibleSubscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td className="newsletter-email">
                    <Mail size={14} /> {subscriber.email}
                  </td>
                  <td className="admin-table-muted">{formatDate(subscriber.createdAt)}</td>
                  <td>
                    <span className="newsletter-status">Subscribed</span>
                  </td>
                  <td className="newsletter-table__actions">
                    <button
                      type="button"
                      className="admin-icon-btn small newsletter-delete"
                      onClick={() => handleDelete(subscriber)}
                      title="Remove subscriber"
                      aria-label={`Remove ${subscriber.email}`}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserPlusIcon() {
  return <Users size={15} />;
}
