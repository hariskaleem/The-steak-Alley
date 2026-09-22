import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ setIsCartOpen, setIsPanelOpen, cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const getUserInitial = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.firstName?.charAt(0)?.toUpperCase() || "U";
    } catch {
      return "U";
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header_wrapper">
      <nav className={`chop-navbar ${scrolled ? "chop-navbar--scrolled" : ""}`}>
        <div className="chop-navbar__inner">
          <Link className="chop-brand" to="/">
            <span className="chop-brand__mark">The Steak Alley</span>
            <span className="chop-brand__divider" aria-hidden="true"></span>
            <span className="chop-brand__label">Grilled to Perfection</span>
          </Link>

          <button
            className="chop-toggler"
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation">
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Desktop nav */}
          <div className="chop-nav-collapse" id="navbarNav">
            <ul className="chop-links">
              <li>
                <NavLink className="chop-link" to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className="chop-link" to="/menu">
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink className="chop-link" to="/aboutus">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink className="chop-link" to="/contactus">
                  Contact Us
                </NavLink>
              </li>
            </ul>
            <div className="chop-actions">
              <button
                className="chop-icon-btn chop-cart-btn"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ""}`}>
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && <span className="chop-cart-count">{cartCount}</span>}
              </button>
              {isLoggedIn ? (
                <button
                  className="chop-icon-btn chop-user-btn"
                  title="My Account"
                  aria-label="Open customer panel"
                  onClick={() => setIsPanelOpen(true)}>
                  {getUserInitial()}
                </button>
              ) : (
                <Link to="/login" className="chop-icon-btn" aria-label="Log in">
                  <i className="fa-solid fa-right-to-bracket"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="chop-hairline"></div>
      </nav>

      {/* Mobile drawer backdrop */}
      {isMenuOpen && <div className="chop-drawer-backdrop" onClick={closeMenu} />}

      {/* Mobile slide-in drawer */}
      <div className={`chop-drawer${isMenuOpen ? " chop-drawer--open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="chop-drawer__header">
          <span className="chop-brand__mark" style={{ fontSize: 18 }}>
            The Steak Alley
          </span>
          <button className="chop-drawer__close" onClick={closeMenu} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <ul className="chop-drawer__links">
          <li>
            <NavLink className="chop-drawer__link" to="/" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="chop-drawer__link" to="/menu" onClick={closeMenu}>
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink className="chop-drawer__link" to="/aboutus" onClick={closeMenu}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink className="chop-drawer__link" to="/contactus" onClick={closeMenu}>
              Contact Us
            </NavLink>
          </li>
        </ul>
        <div className="chop-drawer__actions">
          <button
            className="chop-icon-btn chop-cart-btn"
            onClick={() => {
              setIsCartOpen(true);
              closeMenu();
            }}
            aria-label="Open cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && <span className="chop-cart-count">{cartCount}</span>}
          </button>
          {isLoggedIn ? (
            <button
              className="chop-icon-btn chop-user-btn"
              onClick={() => {
                setIsPanelOpen(true);
                closeMenu();
              }}>
              {getUserInitial()}
            </button>
          ) : (
            <Link to="/login" className="chop-icon-btn" onClick={closeMenu} aria-label="Log in">
              <i className="fa-solid fa-right-to-bracket"></i>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
