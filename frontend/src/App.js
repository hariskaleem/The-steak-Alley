import "./App.css";
import "./components/Responsive.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MenuPage from "./components/MenuPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignupPage";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ShoppingCart from "./components/ShoppingCart";
import CustomerPanel from "./components/CustomerPanel";
import CheckoutPage from "./components/CheckoutPage";
import AdminLayout from "./components/Adminlayout";
import RequireAdmin from "./components/RequireAdmin";
import { authMe, getCart, syncCart } from "./api";

function AppContent({
  cart,
  isCartOpen,
  isPanelOpen,
  setIsCartOpen,
  setIsPanelOpen,
  addToCart,
  updateQuantity,
  clearCart,
}) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <Navbar
          setIsCartOpen={setIsCartOpen}
          setIsPanelOpen={setIsPanelOpen}
          cartCount={cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0)}
        />
      )}
      <ScrollToTop />
      {!isAdminRoute && (
        <>
          <ShoppingCart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            updateQuantity={updateQuantity}
          />
          <CustomerPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        />
        <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [_user, setUser] = useState(null); // eslint-disable-line no-unused-vars
  const syncTimer = useRef(null);

  /* ── Restore session silently on mount ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    authMe()
      .then((data) => {
        const u = data.user;
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        // Load cart from DB
        return getCart();
      })
      .then((data) => {
        if (data && data.items) setCart(data.items);
      })
      .catch(() => {
        // Token invalid / expired — clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
  }, []);

  /* ── Listen for login/logout events dispatched by auth components ── */
  useEffect(() => {
    const onAuthChange = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
        // Reload cart from DB
        getCart()
          .then((data) => {
            if (data && data.items) setCart(data.items);
          })
          .catch(() => {});
      } else {
        setUser(null);
        setCart([]);
      }
    };
    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  /* ── Debounced cart sync to DB ── */
  const debouncedSync = useCallback((items) => {
    if (!localStorage.getItem("token")) return; // only sync when logged in
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      syncCart(items).catch(() => {}); // silent fail — UX stays intact
    }, 600);
  }, []);

  /* ── Add item to cart ── */
  const addToCart = (product) => {
    setCart((prevCart) => {
      const found = prevCart.find((item) => item.id === product.id);
      let next;
      if (found) {
        next = prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        next = [...prevCart, { ...product, quantity: 1 }];
      }
      debouncedSync(next);
      return next;
    });
  };

  /* ── Update quantity (from cart sidebar or checkout) ── */
  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      const next = prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0);
      debouncedSync(next);
      return next;
    });
  };

  /* ── Clear entire cart (after order placed) ── */
  const clearCart = () => {
    setCart([]);
    if (localStorage.getItem("token")) {
      syncCart([]).catch(() => {});
    }
  };

  return (
    <Router>
      <AppContent
        cart={cart}
        isCartOpen={isCartOpen}
        isPanelOpen={isPanelOpen}
        setIsCartOpen={setIsCartOpen}
        setIsPanelOpen={setIsPanelOpen}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
    </Router>
  );
}

export default App;
