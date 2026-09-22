import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerPanel.css";
import { getProfile, updateAddresses, updatePayments, getOrders } from "../api";

/* ─── Constants ─────────────────────────────────────── */
const BLANK_ADDRESS = { label: "", street: "", city: "", state: "", zip: "", country: "" };
const BLANK_PAYMENT = { cardholder: "", number: "", expiry: "", type: "visa" };

const CARD_ICONS = {
  visa:       "fa-cc-visa",
  mastercard: "fa-cc-mastercard",
  amex:       "fa-cc-amex",
  discover:   "fa-cc-discover",
};

const STATUS_COLORS = {
  confirmed:    "#bd9f67",
  preparing:    "#f59e0b",
  on_the_way:   "#3b82f6",
  delivered:    "#22c55e",
  cancelled:    "#ef4444",
};

const STATUS_LABELS = {
  confirmed:  "Confirmed",
  preparing:  "Preparing",
  on_the_way: "On the Way",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};

/* ─── Component ───────────────────────────────────────── */
const CustomerPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab]     = useState("dashboard");
  const [user, setUser]               = useState(null);
  const navigate                      = useNavigate();
  const panelRef                      = useRef(null);

  /* ── Addresses state ── */
  const [addresses, setAddresses]       = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editAddrIdx, setEditAddrIdx]   = useState(null);
  const [addrForm, setAddrForm]         = useState(BLANK_ADDRESS);
  const [addrError, setAddrError]       = useState("");
  const [addrSaving, setAddrSaving]     = useState(false);

  /* ── Payments state ── */
  const [payments, setPayments]         = useState([]);
  const [showPayForm, setShowPayForm]   = useState(false);
  const [editPayIdx, setEditPayIdx]     = useState(null);
  const [payForm, setPayForm]           = useState(BLANK_PAYMENT);
  const [payError, setPayError]         = useState("");
  const [paySaving, setPaySaving]       = useState(false);

  /* ── Orders state ── */
  const [orders, setOrders]             = useState([]);
  const [totalOrders, setTotalOrders]   = useState(0);
  const [totalSpent, setTotalSpent]     = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* ── Load user ── */
  useEffect(() => {
    const loadUser = () => {
      try { setUser(JSON.parse(localStorage.getItem("user"))); }
      catch { setUser(null); }
    };
    loadUser();
    window.addEventListener("authChange", loadUser);
    return () => window.removeEventListener("authChange", loadUser);
  }, [isOpen]);

  /* ── Load profile from DB when panel opens ── */
  useEffect(() => {
    if (!isOpen || !localStorage.getItem("token")) return;

    getProfile()
      .then((data) => {
        setAddresses(data.user.addresses || []);
        setPayments(data.user.paymentMethods || []);
      })
      .catch(() => {});
  }, [isOpen]);

  /* ── Load orders when Orders tab is opened ── */
  useEffect(() => {
    if (activeTab !== "orders" && activeTab !== "dashboard") return;
    if (!localStorage.getItem("token")) return;

    setOrdersLoading(true);
    getOrders()
      .then((data) => {
        setOrders(data.orders || []);
        setTotalOrders(data.totalOrders || 0);
        setTotalSpent(data.totalSpent || 0);
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [activeTab, isOpen]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* ── Auth ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    onClose();
    navigate("/");
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  /* ════════════════════════════════════════════════
     ADDRESS HANDLERS
     ════════════════════════════════════════════════ */
  const openNewAddr = () => {
    setEditAddrIdx(null);
    setAddrForm(BLANK_ADDRESS);
    setAddrError("");
    setShowAddrForm(true);
  };

  const openEditAddr = (idx) => {
    setEditAddrIdx(idx);
    setAddrForm({ ...addresses[idx] });
    setAddrError("");
    setShowAddrForm(true);
  };

  const saveAddress = async () => {
    const { label, street, city, state, zip, country } = addrForm;
    if (!street || !city || !state || !zip || !country) {
      setAddrError("Please fill in all required fields.");
      return;
    }
    const updated = [...addresses];
    const entry = { label: label || "Home", street, city, state, zip, country };
    if (editAddrIdx !== null) updated[editAddrIdx] = entry;
    else updated.push(entry);

    setAddrSaving(true);
    try {
      const res = await updateAddresses(updated);
      setAddresses(res.addresses);
      setShowAddrForm(false);
      setAddrError("");
    } catch {
      setAddrError("Failed to save. Please try again.");
    } finally {
      setAddrSaving(false);
    }
  };

  const deleteAddress = async (idx) => {
    const updated = addresses.filter((_, i) => i !== idx);
    try {
      const res = await updateAddresses(updated);
      setAddresses(res.addresses);
    } catch {}
  };

  /* ════════════════════════════════════════════════
     PAYMENT HANDLERS
     ════════════════════════════════════════════════ */
  const formatCardDisplay = (raw = "") =>
    raw.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

  const maskCard = (last4 = "") => "**** **** **** " + (last4 || "****");

  const openNewPay = () => {
    setEditPayIdx(null);
    setPayForm(BLANK_PAYMENT);
    setPayError("");
    setShowPayForm(true);
  };

  const openEditPay = (idx) => {
    setEditPayIdx(idx);
    setPayForm({ ...payments[idx], number: "" });
    setPayError("");
    setShowPayForm(true);
  };

  const savePay = async () => {
    const { cardholder, number, expiry, type } = payForm;
    if (!cardholder || !number || !expiry) {
      setPayError("Please fill in all required fields.");
      return;
    }
    const digits = number.replace(/\D/g, "");
    if (digits.length < 12) { setPayError("Enter a valid card number."); return; }
    const [m, y] = (expiry || "").split("/");
    if (!m || !y || m < 1 || m > 12) { setPayError("Enter a valid expiry (MM/YY)."); return; }

    const updated = [...payments];
    const entry = { cardholder, last4: digits.slice(-4), expiry, type };
    if (editPayIdx !== null) updated[editPayIdx] = entry;
    else updated.push(entry);

    setPaySaving(true);
    try {
      const res = await updatePayments(updated);
      setPayments(res.paymentMethods);
      setShowPayForm(false);
      setPayError("");
    } catch {
      setPayError("Failed to save. Please try again.");
    } finally {
      setPaySaving(false);
    }
  };

  const deletePay = async (idx) => {
    const updated = payments.filter((_, i) => i !== idx);
    try {
      const res = await updatePayments(updated);
      setPayments(res.paymentMethods);
    } catch {}
  };

  /* ── Format expiry input MM/YY ── */
  const handleExpiryChange = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    const formatted = clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
    setPayForm((p) => ({ ...p, expiry: formatted }));
  };

  /* ── Format date for display ── */
  const fmtDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  /* ════════════════════════════════════════════════
     TABS
     ════════════════════════════════════════════════ */
  const tabs = [
    { id: "dashboard", icon: "fa-gauge-high",  label: "Dashboard" },
    { id: "orders",    icon: "fa-receipt",      label: "Order History" },
    { id: "addresses", icon: "fa-location-dot", label: "Addresses" },
    { id: "payments",  icon: "fa-credit-card",  label: "Payments" },
  ];

  /* ════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════ */
  return (
    <>
      {/* Backdrop */}
      <div className={`cp-backdrop ${isOpen ? "cp-backdrop--visible" : ""}`} />

      {/* Panel */}
      <aside
        ref={panelRef}
        className={`cp-panel ${isOpen ? "cp-panel--open" : ""}`}
        aria-label="Customer Panel"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div className="cp-header">
          <div className="cp-avatar">
            <span className="cp-avatar__initials">{getInitials()}</span>
            <span className="cp-avatar__ring" />
          </div>
          <div className="cp-header__info">
            <p className="cp-header__name">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </p>
            <p className="cp-header__email">{user?.email || ""}</p>
          </div>
          <button className="cp-close-btn" onClick={onClose} aria-label="Close panel">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* ── Tabs ── */}
        <nav className="cp-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`cp-tab ${activeTab === tab.id ? "cp-tab--active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAddrForm(false);
                setShowPayForm(false);
              }}
            >
              <i className={`fa-solid ${tab.icon} cp-tab__icon`} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <span className="cp-tab__indicator" />}
            </button>
          ))}
        </nav>

        {/* ── Body ── */}
        <div className="cp-body">

          {/* ══ DASHBOARD ══ */}
          {activeTab === "dashboard" && (
            <div className="cp-section">
              <div className="cp-stats">
                <div className="cp-stat-card">
                  <i className="fa-solid fa-bag-shopping cp-stat-card__icon" />
                  <p className="cp-stat-card__value">{totalOrders}</p>
                  <p className="cp-stat-card__label">Total Orders</p>
                </div>
                <div className="cp-stat-card">
                  <i className="fa-solid fa-star cp-stat-card__icon" />
                  <p className="cp-stat-card__value">{totalOrders * 10}</p>
                  <p className="cp-stat-card__label">Loyalty Points</p>
                </div>
                <div className="cp-stat-card">
                  <i className="fa-solid fa-wallet cp-stat-card__icon" />
                  <p className="cp-stat-card__value">${totalSpent.toFixed(2)}</p>
                  <p className="cp-stat-card__label">Total Spent</p>
                </div>
              </div>

              {/* Recent Orders preview */}
              {orders.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Recent Orders
                  </p>
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="cp-saved-card" style={{ marginBottom: 10 }}>
                      <div className="cp-saved-card__body">
                        <p className="cp-saved-card__label">
                          <i className="fa-solid fa-receipt" /> {order.orderNumber}
                        </p>
                        <p className="cp-saved-card__detail">{fmtDate(order.createdAt)} — {order.items?.length} item(s)</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#bd9f67", fontWeight: 700, fontSize: 14 }}>${order.total?.toFixed(2)}</p>
                        <p style={{ fontSize: 11, color: STATUS_COLORS[order.status] || "#bd9f67" }}>
                          {STATUS_LABELS[order.status] || order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ORDERS ══ */}
          {activeTab === "orders" && (
            <div className="cp-section">
              <h3 className="cp-section__title">Order <span>History</span></h3>

              {ordersLoading && (
                <div className="cp-empty">
                  <i className="fa-solid fa-spinner fa-spin cp-empty__icon" />
                  <p className="cp-empty__text">Loading orders…</p>
                </div>
              )}

              {!ordersLoading && orders.length === 0 && (
                <div className="cp-empty">
                  <i className="fa-solid fa-receipt cp-empty__icon" />
                  <p className="cp-empty__text">No orders yet</p>
                  <p className="cp-empty__sub">Your past orders will appear here once you place one.</p>
                </div>
              )}

              {!ordersLoading && orders.map((order) => (
                <div key={order._id} className="cp-saved-card" style={{ marginBottom: 14, flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 8 }}>
                    <p className="cp-saved-card__label">
                      <i className="fa-solid fa-receipt" /> {order.orderNumber}
                    </p>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99,
                      background: "rgba(255,255,255,0.07)",
                      color: STATUS_COLORS[order.status] || "#bd9f67",
                      border: `1px solid ${STATUS_COLORS[order.status] || "#bd9f67"}44`,
                    }}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="cp-saved-card__detail">{fmtDate(order.createdAt)}</p>
                  <div style={{ width: "100%", marginTop: 8 }}>
                    {order.items?.map((item, i) => (
                      <p key={i} className="cp-saved-card__detail" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(Number(item.price?.replace("$", "") || 0) * item.quantity).toFixed(2)}</span>
                      </p>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 8, width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Total</span>
                    <span style={{ color: "#bd9f67", fontWeight: 700, fontSize: 15 }}>${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ ADDRESSES ══ */}
          {activeTab === "addresses" && (
            <div className="cp-section">
              <div className="cp-section-header">
                <h3 className="cp-section__title">Saved <span>Addresses</span></h3>
                {!showAddrForm && (
                  <button className="cp-icon-add-btn" onClick={openNewAddr} title="Add address">
                    <i className="fa-solid fa-plus" />
                  </button>
                )}
              </div>

              {/* Saved address cards */}
              {addresses.length > 0 && !showAddrForm && (
                <div className="cp-card-list">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="cp-saved-card">
                      <div className="cp-saved-card__body">
                        <p className="cp-saved-card__label">
                          <i className="fa-solid fa-location-dot" /> {addr.label}
                        </p>
                        <p className="cp-saved-card__detail">{addr.street}</p>
                        <p className="cp-saved-card__detail">
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                        <p className="cp-saved-card__detail">{addr.country}</p>
                      </div>
                      <div className="cp-saved-card__actions">
                        <button
                          className="cp-saved-card__btn cp-saved-card__btn--edit"
                          onClick={() => openEditAddr(idx)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          className="cp-saved-card__btn cp-saved-card__btn--delete"
                          onClick={() => deleteAddress(idx)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {addresses.length === 0 && !showAddrForm && (
                <div className="cp-empty">
                  <i className="fa-solid fa-location-dot cp-empty__icon" />
                  <p className="cp-empty__text">No addresses saved</p>
                  <p className="cp-empty__sub">Add a delivery address for faster checkout.</p>
                </div>
              )}

              {/* Add / Edit form */}
              {showAddrForm && (
                <div className="cp-form-card">
                  <p className="cp-form-card__title">
                    {editAddrIdx !== null ? "Edit Address" : "New Address"}
                  </p>

                  {addrError && <p className="cp-form-error">{addrError}</p>}

                  <div className="cp-field">
                    <label>Label (e.g. Home, Work)</label>
                    <input
                      type="text"
                      placeholder="Home"
                      value={addrForm.label}
                      onChange={(e) => setAddrForm((p) => ({ ...p, label: e.target.value }))}
                    />
                  </div>
                  <div className="cp-field">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      value={addrForm.street}
                      onChange={(e) => setAddrForm((p) => ({ ...p, street: e.target.value }))}
                    />
                  </div>
                  <div className="cp-field-row">
                    <div className="cp-field">
                      <label>City *</label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={addrForm.city}
                        onChange={(e) => setAddrForm((p) => ({ ...p, city: e.target.value }))}
                      />
                    </div>
                    <div className="cp-field">
                      <label>State / Province *</label>
                      <input
                        type="text"
                        placeholder="NY"
                        value={addrForm.state}
                        onChange={(e) => setAddrForm((p) => ({ ...p, state: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="cp-field-row">
                    <div className="cp-field">
                      <label>ZIP / Postal Code *</label>
                      <input
                        type="text"
                        placeholder="10001"
                        value={addrForm.zip}
                        onChange={(e) => setAddrForm((p) => ({ ...p, zip: e.target.value }))}
                      />
                    </div>
                    <div className="cp-field">
                      <label>Country *</label>
                      <input
                        type="text"
                        placeholder="USA"
                        value={addrForm.country}
                        onChange={(e) => setAddrForm((p) => ({ ...p, country: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="cp-form-actions">
                    <button className="cp-form-btn cp-form-btn--cancel" onClick={() => setShowAddrForm(false)}>
                      Cancel
                    </button>
                    <button className="cp-form-btn cp-form-btn--save" onClick={saveAddress} disabled={addrSaving}>
                      <i className="fa-solid fa-check" /> {addrSaving ? "Saving…" : "Save Address"}
                    </button>
                  </div>
                </div>
              )}

              {/* Add button (when addresses exist and form is hidden) */}
              {addresses.length > 0 && !showAddrForm && (
                <button className="cp-add-btn" onClick={openNewAddr}>
                  <i className="fa-solid fa-plus" /> Add New Address
                </button>
              )}
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {activeTab === "payments" && (
            <div className="cp-section">
              <div className="cp-section-header">
                <h3 className="cp-section__title">Payment <span>Methods</span></h3>
                {!showPayForm && (
                  <button className="cp-icon-add-btn" onClick={openNewPay} title="Add payment method">
                    <i className="fa-solid fa-plus" />
                  </button>
                )}
              </div>

              {/* Saved payment cards */}
              {payments.length > 0 && !showPayForm && (
                <div className="cp-card-list">
                  {payments.map((pay, idx) => (
                    <div key={idx} className="cp-saved-card cp-saved-card--pay">
                      <div className="cp-saved-card__body">
                        <p className="cp-saved-card__label">
                          <i className={`fa-brands ${CARD_ICONS[pay.type] || "fa-credit-card"}`} />
                          {" "}{maskCard(pay.last4)}
                        </p>
                        <p className="cp-saved-card__detail">{pay.cardholder}</p>
                        <p className="cp-saved-card__detail">Expires {pay.expiry}</p>
                      </div>
                      <div className="cp-saved-card__actions">
                        <button
                          className="cp-saved-card__btn cp-saved-card__btn--edit"
                          onClick={() => openEditPay(idx)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          className="cp-saved-card__btn cp-saved-card__btn--delete"
                          onClick={() => deletePay(idx)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {payments.length === 0 && !showPayForm && (
                <div className="cp-empty">
                  <i className="fa-solid fa-credit-card cp-empty__icon" />
                  <p className="cp-empty__text">No payment methods saved</p>
                  <p className="cp-empty__sub">Save a card for quick and easy checkout.</p>
                </div>
              )}

              {/* Add / Edit form */}
              {showPayForm && (
                <div className="cp-form-card">
                  <p className="cp-form-card__title">
                    {editPayIdx !== null ? "Edit Card" : "New Payment Method"}
                  </p>

                  {payError && <p className="cp-form-error">{payError}</p>}

                  <div className="cp-field">
                    <label>Card Type</label>
                    <select
                      value={payForm.type}
                      onChange={(e) => setPayForm((p) => ({ ...p, type: e.target.value }))}
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">Amex</option>
                      <option value="discover">Discover</option>
                    </select>
                  </div>
                  <div className="cp-field">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={payForm.cardholder}
                      onChange={(e) => setPayForm((p) => ({ ...p, cardholder: e.target.value }))}
                    />
                  </div>
                  <div className="cp-field">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={formatCardDisplay(payForm.number)}
                      onChange={(e) =>
                        setPayForm((p) => ({
                          ...p,
                          number: e.target.value.replace(/\D/g, "").slice(0, 16),
                        }))
                      }
                    />
                  </div>
                  <div className="cp-field-row">
                    <div className="cp-field">
                      <label>Expiry *</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={payForm.expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                      />
                    </div>
                    <div className="cp-field">
                      <label>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={payForm.cvv || ""}
                        onChange={(e) =>
                          setPayForm((p) => ({
                            ...p,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="cp-form-actions">
                    <button className="cp-form-btn cp-form-btn--cancel" onClick={() => setShowPayForm(false)}>
                      Cancel
                    </button>
                    <button className="cp-form-btn cp-form-btn--save" onClick={savePay} disabled={paySaving}>
                      <i className="fa-solid fa-check" /> {paySaving ? "Saving…" : "Save Card"}
                    </button>
                  </div>
                </div>
              )}

              {/* Add button (when cards exist and form is hidden) */}
              {payments.length > 0 && !showPayForm && (
                <button className="cp-add-btn" onClick={openNewPay}>
                  <i className="fa-solid fa-plus" /> Add Payment Method
                </button>
              )}
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="cp-footer">
          <button className="cp-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CustomerPanel;
