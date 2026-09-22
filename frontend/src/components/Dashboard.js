import React, { useEffect, useState } from "react";
import { getAdminStats, getAdminOrders } from "../api";

const STATUS_CLASS = {
  Confirmed:   "status-confirmed",
  Preparing:   "status-preparing",
  "On the way": "status-on-the-way",
  Delivered:   "status-served",
  Cancelled:   "status-cancelled",
};

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ totalOrders: null, totalCustomers: null, todayRevenue: null, totalRevenue: null, menuItemCount: null });
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setLiveOrders((ordersData.orders || []).slice(0, 4));
      })
      .catch(() => setStats({ totalOrders: "—", totalCustomers: "—", todayRevenue: "—", totalRevenue: "—", menuItemCount: "—" }))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val) => (loading ? "..." : val ?? "—");
  const fmtCurrency = (val) =>
    loading ? "..." : `Rs ${(val ?? 0).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const STATS = [
    { label: "Total revenue", value: fmtCurrency(stats.totalRevenue) },
    { label: "Today's revenue", value: fmtCurrency(stats.todayRevenue) },
    { label: "Orders", value: fmt(stats.totalOrders) },
    { label: "Menu items", value: fmt(stats.menuItemCount) },
    { label: "Total customers", value: fmt(stats.totalCustomers) },
  ];

  return (
    <>
      <div className="admin-stat-grid">
        {STATS.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-section-header">
        <span>Live orders</span>
        <button type="button" className="admin-link-btn" onClick={() => onNavigate?.("orders")}>
          View all
        </button>
      </div>

      <div className="admin-order-list">
        {liveOrders.length === 0 && !loading && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>No orders yet.</p>
        )}
        {liveOrders.map((order) => (
          <div className="admin-order-row" key={order._id || order.id}>
            <div className="admin-order-info">
              <span className="admin-order-id">{order.id}</span>
              <span className="admin-order-detail">{order.customer} · {order.items}</span>
            </div>
            <span className={`admin-status-pill ${STATUS_CLASS[order.status] || "status-preparing"}`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}