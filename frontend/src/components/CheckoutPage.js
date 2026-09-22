import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CheckoutPage.css";
import { createOrder } from "../api";

const PROMO_CODES = { STEAK10: 10, PREMIUM20: 20, FIRST15: 15 };

const CheckoutPage = ({ cart = [], clearCart }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [delivery, setDelivery] = useState("standard");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Pre-fill form from logged-in user
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const [form, setForm] = useState({
    firstName: storedUser.firstName || "",
    lastName:  storedUser.lastName  || "",
    email:     storedUser.email     || "",
    phone:     storedUser.phone     || "",
    address: "", city: "", state: "", zip: "", country: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  });

  // Re-fill if user logs in while on the page
  useEffect(() => {
    const onAuth = () => {
      try {
        const u = JSON.parse(localStorage.getItem("user")) || {};
        setForm((f) => ({
          ...f,
          firstName: f.firstName || u.firstName || "",
          lastName:  f.lastName  || u.lastName  || "",
          email:     f.email     || u.email     || "",
          phone:     f.phone     || u.phone     || "",
        }));
      } catch {}
    };
    window.addEventListener("authChange", onAuth);
    return () => window.removeEventListener("authChange", onAuth);
  }, []);

  const shippingCost = delivery === "express" ? 9.99 : delivery === "overnight" ? 19.99 : 4.99;
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const discount = promoApplied ? (subtotal * promoApplied) / 100 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied(PROMO_CODES[code]);
      setPromoError("");
    } else {
      setPromoApplied(null);
      setPromoError("Invalid promo code. Try STEAK10, PREMIUM20, or FIRST15.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const token = localStorage.getItem("token");

    const payload = {
      items: cart,
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      promoCode:      promoApplied ? promo.trim().toUpperCase() : "",
      deliveryMethod: delivery,
      deliveryAddress: {
        street:  form.address,
        city:    form.city,
        state:   form.state,
        zip:     form.zip,
        country: form.country,
      },
      paymentMethod,
      contactName:  `${form.firstName} ${form.lastName}`.trim(),
      contactEmail: form.email,
      contactPhone: form.phone,
    };

    try {
      if (token) {
        // Logged-in: persist to DB
        const data = await createOrder(payload);
        setOrderNumber(data.order.orderNumber);
      } else {
        // Guest: simulate (no DB persistence)
        await new Promise((r) => setTimeout(r, 1800));
        setOrderNumber("#SH-" + Math.random().toString(36).substring(2, 8).toUpperCase());
      }
      setOrderPlaced(true);
      if (clearCart) clearCart();
    } catch (err) {
      setSubmitError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-checkout">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious steaks to your cart before checking out.</p>
            <Link to="/menu" className="go-menu-btn">Browse Our Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* ── Order Confirmation Modal ── */}
      {orderPlaced && (
        <div className="order-confirm-overlay">
          <div className="order-confirm-modal">
            <div className="confirm-icon">🥩</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your order. We're preparing your premium steaks right now.</p>
            <p className="order-number">Order {orderNumber}</p>
            <p>A confirmation has been sent to your email. Expected delivery: 30–45 minutes.</p>
            <br />
            <Link to="/" className="confirm-back-btn">Back to Home</Link>
          </div>
        </div>
      )}

      <div className="checkout-container">
        {/* ── Title ── */}
        <div className="checkout-title-section">
          <h1>Secure <span>Checkout</span></h1>
          <p>Complete your order in just a few steps</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            {/* ══ LEFT COLUMN ══ */}
            <div>
              {/* Contact Information */}
              <div className="checkout-card">
                <div className="card-section-title">
                  <div className="section-icon">👤</div>
                  <div>
                    <h2>Contact Information</h2>
                    <p>We'll use this for order updates</p>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" placeholder="John"
                      value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" placeholder="Doe"
                      value={form.lastName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" placeholder="john@example.com"
                      value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000"
                      value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="checkout-card">
                <div className="card-section-title">
                  <div className="section-icon">📍</div>
                  <div>
                    <h2>Delivery Address</h2>
                    <p>Where should we deliver your order?</p>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="address">Street Address</label>
                    <input id="address" name="address" type="text" placeholder="123 Main Street, Apt 4B"
                      value={form.address} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" type="text" placeholder="New York"
                      value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State / Province</label>
                    <input id="state" name="state" type="text" placeholder="NY"
                      value={form.state} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zip">ZIP / Postal Code</label>
                    <input id="zip" name="zip" type="text" placeholder="10001"
                      value={form.zip} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <div className="select-wrapper">
                      <select id="country" name="country" value={form.country}
                        onChange={handleChange} required>
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="PK">Pakistan</option>
                        <option value="AE">UAE</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="checkout-card">
                <div className="card-section-title">
                  <div className="section-icon">🚚</div>
                  <div>
                    <h2>Delivery Method</h2>
                    <p>Choose how fast you want your food</p>
                  </div>
                </div>
                <div className="delivery-options">
                  <div
                    className={`delivery-option ${delivery === "standard" ? "selected" : ""}`}
                    onClick={() => setDelivery("standard")}
                    role="radio" aria-checked={delivery === "standard"} tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setDelivery("standard")}
                  >
                    <div className="delivery-radio" />
                    <div className="delivery-info">
                      <h4>Standard</h4>
                      <p>30–45 min</p>
                    </div>
                    <span className="delivery-price">$4.99</span>
                  </div>
                  <div
                    className={`delivery-option ${delivery === "express" ? "selected" : ""}`}
                    onClick={() => setDelivery("express")}
                    role="radio" aria-checked={delivery === "express"} tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setDelivery("express")}
                  >
                    <div className="delivery-radio" />
                    <div className="delivery-info">
                      <h4>Express</h4>
                      <p>15–20 min</p>
                    </div>
                    <span className="delivery-price">$9.99</span>
                  </div>
                  <div
                    className={`delivery-option ${delivery === "overnight" ? "selected" : ""}`}
                    onClick={() => setDelivery("overnight")}
                    role="radio" aria-checked={delivery === "overnight"} tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setDelivery("overnight")}
                  >
                    <div className="delivery-radio" />
                    <div className="delivery-info">
                      <h4>Priority</h4>
                      <p>Under 10 min</p>
                    </div>
                    <span className="delivery-price">$19.99</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="checkout-card">
                <div className="card-section-title">
                  <div className="section-icon">💳</div>
                  <div>
                    <h2>Payment</h2>
                    <p>All transactions are secure and encrypted</p>
                  </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="payment-tabs">
                  <button type="button"
                    className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                    id="pay-tab-card">
                    <span className="pay-icon">💳</span>
                    Credit / Debit
                  </button>
                  <button type="button"
                    className={`payment-tab ${paymentMethod === "paypal" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("paypal")}
                    id="pay-tab-paypal">
                    <span className="pay-icon">🅿️</span>
                    PayPal
                  </button>
                  <button type="button"
                    className={`payment-tab ${paymentMethod === "cash" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cash")}
                    id="pay-tab-cash">
                    <span className="pay-icon">💵</span>
                    Cash on Delivery
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label htmlFor="cardNumber">Card Number</label>
                      <div className="card-input-wrapper">
                        <input id="cardNumber" name="cardNumber" type="text"
                          placeholder="1234 5678 9012 3456" maxLength="19"
                          value={form.cardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                            const fmt = v.replace(/(.{4})/g, "$1 ").trim();
                            setForm((f) => ({ ...f, cardNumber: fmt }));
                          }}
                          required={paymentMethod === "card"} />
                        <div className="card-icons">🏦</div>
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="cardName">Cardholder Name</label>
                      <input id="cardName" name="cardName" type="text" placeholder="John Doe"
                        value={form.cardName} onChange={handleChange}
                        required={paymentMethod === "card"} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="expiry">Expiry Date</label>
                      <input id="expiry" name="expiry" type="text" placeholder="MM / YY"
                        maxLength="7"
                        value={form.expiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const fmt = v.length > 2 ? v.slice(0, 2) + " / " + v.slice(2) : v;
                          setForm((f) => ({ ...f, expiry: fmt }));
                        }}
                        required={paymentMethod === "card"} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input id="cvv" name="cvv" type="password" placeholder="•••"
                        maxLength="4"
                        value={form.cvv}
                        onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "") }))}
                        required={paymentMethod === "card"} />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                    You will be redirected to PayPal to complete your payment securely.
                  </div>
                )}
                {paymentMethod === "cash" && (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                    Pay cash upon delivery. Please have exact change ready for the driver.
                  </div>
                )}
              </div>

              {/* Promo Code */}
              <div className="checkout-card">
                <div className="card-section-title">
                  <div className="section-icon">🎁</div>
                  <div>
                    <h2>Promo Code</h2>
                    <p>Have a discount code? Apply it here</p>
                  </div>
                </div>
                <div className="promo-row">
                  <input
                    type="text"
                    id="promo-input"
                    placeholder="Enter promo code (e.g. STEAK10)"
                    value={promo}
                    onChange={(e) => { setPromo(e.target.value); setPromoError(""); }}
                  />
                  <button type="button" className="promo-apply-btn" onClick={applyPromo} id="promo-apply-btn">
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="promo-success">
                    ✅ Promo applied! You're saving {promoApplied}% on your order.
                  </div>
                )}
                {promoError && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#f97878", fontFamily: "Poppins, sans-serif" }}>
                    ❌ {promoError}
                  </div>
                )}
              </div>
            </div>

            {/* ══ RIGHT COLUMN — Order Summary ══ */}
            <div>
              <div className="order-summary-card">
                <div className="summary-title">
                  🧾 Order Summary
                </div>

                {/* Items */}
                <div className="summary-items">
                  {cart.map((item) => (
                    <div className="summary-item" key={item.id}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="summary-item-placeholder">🥩</div>
                      )}
                      <div className="summary-item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div className="summary-item-price">
                        Rs {(Number(item.price) * item.quantity).toLocaleString("en-PK")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="summary-breakdown">
                  <div className="breakdown-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="breakdown-row discount">
                      <span>Discount ({promoApplied}%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="breakdown-row">
                    <span>Delivery</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>

                {/* Submit error */}
                {submitError && (
                  <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f97878", fontSize: 13 }}>
                    ❌ {submitError}
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="place-order-btn"
                  id="place-order-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing…</>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Security Badges */}
                <div className="secure-badges">
                  <div className="secure-badge">🔒 SSL Encrypted</div>
                  <div className="secure-badge">✅ PCI Compliant</div>
                  <div className="secure-badge">🛡️ Fraud Protected</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
