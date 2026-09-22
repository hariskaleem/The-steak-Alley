import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingCart.css";

const ShoppingCart = ({ isOpen, onClose, cart, updateQuantity }) => {
  const navigate = useNavigate();

  // Calculate subtotal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Calculate subtotal
  const subtotal = cart ? cart.reduce((sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity, 0) : 0;

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h4>Your Cart</h4>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {!cart || cart.length === 0 ? (
            <p>No items in cart yet.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  className="product"
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                    borderBottom: "1px solid #eee",
                    paddingBottom: 12,
                  }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8, marginRight: 16 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        background: "#FFF6EE",
                        borderRadius: 8,
                        marginRight: 16,
                      }}
                    />
                  )}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ fontWeight: "bold", marginBottom: 8 }}>{item.name}</span>
                    <div className="quantity" style={{ display: "flex", alignItems: "center" }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{
                          border: "none",
                          background: "none",
                          fontSize: 18,
                          width: 32,
                          height: 32,
                          color: "#ffffffff",
                          cursor: "pointer",
                        }}>
                        -
                      </button>
                      <label style={{ margin: "0 8px" }}>{item.quantity}</label>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          border: "none",
                          background: "none",
                          fontSize: 18,
                          width: 32,
                          height: 32,
                          color: "#ffffffff",
                          cursor: "pointer",
                        }}>
                        +
                      </button>
                    </div>
                  </div>
                  <label className="price small" style={{ marginLeft: 16, marginTop: "30px" }}>
                    Rs {(Number(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </label>
                </div>
              ))}
              {/* Subtotal and shipping */}
              <div className="cart-summary">
                <div>
                  <span>Subtotal:</span>
                  <span>Rs {subtotal.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span>Shipping:</span>
                  <span>Rs 500</span>
                </div>
                <div>
                  <span>Total:</span>
                  <span>Rs {(subtotal + 500).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Footer */}
        {cart && cart.length > 0 && (
          <div className="cart-footer">
            <button
              className="checkout-btn"
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
            >
              <span>Proceed to Checkout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <p className="cart-secure-note">🔒 Secure & encrypted checkout</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
