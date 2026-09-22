import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Banner7 from "./Banner7";
import { getMenuItems } from "../api";
import "./MenuItem.css";
import "./MenuPage.css";

const CATEGORY_ORDER = ["Starters", "Mains", "Sides", "Desserts", "Drinks", "Dips"];

// ── Single menu card ──────────────────────────────────────────────────────────
function MenuCard({ item, addToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const feedbackTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  const handleAdd = () => {
    addToCart({ id: item._id, name: item.name, price: item.price, image: item.imageUrl || "" });
    setIsAdded(true);
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <div className="chop-card">
      <div className="chop-card__image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} style={{ objectPosition: item.imagePosition || "50% 50%" }} />
        ) : (
          <div className="chop-card__img-placeholder">
            <i className="fa-solid fa-utensils" />
          </div>
        )}
      </div>
      <div className="chop-card__body">
        <div className="chop-card__title">{item.name}</div>
        {item.ingredients && item.ingredients.length > 0 && (
          <div className="chop-card__ingredients-wrap">
            <span className="chop-card__ingredients-label">Ingredients</span>
            <div className="chop-card__ingredients">
              {item.ingredients.map((ing, i) => (
                <span className="chop-card__ingredient-pill" key={i}>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="chop-card__row">
          <span className="chop-card__price">Rs {Number(item.price).toLocaleString("en-PK")}</span>
          <button
            className={`chop-card__btn${isAdded ? " chop-card__btn--added" : ""}`}
            onClick={handleAdd}
            aria-live="polite">
            <i className={`fa-solid ${isAdded ? "fa-check" : "fa-cart-shopping"}`} />
            {isAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main MenuPage ─────────────────────────────────────────────────────────────
const ALL_KEY = "All";

const MenuPage = ({ addToCart }) => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActive] = useState(searchParams.get("category") || ALL_KEY);

  useEffect(() => {
    setActive(searchParams.get("category") || ALL_KEY);
  }, [searchParams]);

  // Fetch items from DB
  useEffect(() => {
    getMenuItems()
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);

  // Build list of categories that actually have available items
  const availableItems = items.filter((i) => i.available);
  const grouped = {};
  availableItems.forEach((i) => {
    if (!grouped[i.category]) grouped[i.category] = [];
    grouped[i.category].push(i);
  });
  const categories = [
    ALL_KEY,
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped)
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort(),
  ];

  // Resolve visible items — "All" shows everything sorted by CATEGORY_ORDER
  const safeActive = categories.includes(activeCategory) ? activeCategory : ALL_KEY;
  const allItemsSorted = [
    ...CATEGORY_ORDER.flatMap((c) => grouped[c] || []),
    ...availableItems.filter((i) => !CATEGORY_ORDER.includes(i.category)),
  ];
  const visibleItems = safeActive === ALL_KEY ? allItemsSorted : grouped[safeActive] || [];

  return (
    <div className="menu-page">
      {/* ── Hero banner ── */}
      <Banner7 backgroundClass="banner_wrapper2" title="Our Menu" />

      <h3 className="chop-quote" style={{ marginTop: "80px", marginBottom: "56px" }}>
        "From our grill to your plate — taste the tradition of great steak."
      </h3>

      {/* ── Pill tab bar ── */}
      <div className="menu-pill-bar">
        <div className="menu-pill-track">
          {categories.map((cat) => {
            const count = cat === ALL_KEY ? availableItems.length : grouped[cat]?.length;
            return (
              <button
                key={cat}
                className={`menu-pill${safeActive === cat ? " menu-pill--active" : ""}`}
                onClick={() => setActive(cat)}>
                {cat}
                <span className="menu-pill__count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div className="menu-grid-section container">
        {!loaded ? (
          <div className="menu-loading">
            <div className="menu-spinner" />
            <p>Loading menu…</p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="menu-empty">
            <p>No items in this category yet.</p>
          </div>
        ) : (
          <div className="menu-cards-grid">
            {visibleItems.map((item) => (
              <MenuCard key={item._id} item={item} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

      <h3 className="chop-quote" style={{ marginTop: "80px", marginBottom: "80px" }}>
        "Enjoy the taste that's done just right."
      </h3>
      <hr className="chop-quote__rule" />
    </div>
  );
};

export default MenuPage;
