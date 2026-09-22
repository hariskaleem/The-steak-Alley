import React, { useEffect, useState } from "react";
import { getAdminOrders } from "../api";

const FILTERS = ["All", "Confirmed", "Preparing", "On the way", "Delivered", "Cancelled"];

const STATUS_CLASS = {
  Confirmed:    "status-confirmed",
  Preparing:    "status-preparing",
  "On the way": "status-on-the-way",
  Delivered:    "status-served",
  Cancelled:    "status-cancelled",
};

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    getAdminOrders()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <div className="admin-filter-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`admin-filter-chip${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="admin-table-empty">Loading orders…</td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={5} className="admin-table-empty">{error}</td>
              </tr>
            )}

            {!loading && !error && filteredOrders.map((order) => (
              <tr key={order._id || order.id}>
                <td className="admin-table-mono">{order.id}</td>
                <td>{order.customer}</td>
                <td className="admin-table-muted">{order.items}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`admin-status-pill ${STATUS_CLASS[order.status] || "status-preparing"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && !error && filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No orders match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}