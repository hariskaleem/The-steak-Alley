import React from "react";
import "./MenuItem.css";

// ── Hardcoded fallback items (kept intact) ────────────────────────────────────
export const products = [
  { id: 1, name: "Dynamite Prawns", price: "$110", image: "/images/fried-shrimps-with-sauce-wooden-board (1).jpg",
    ingredients:["prawns","sauce","butter"]
  },
  
  {
    id: 2,
    name: "Chicken Cheese Balls",
    price: "$150",
    image: "/images/stuffed-chicken-balls-garnished-with-cream-sauce (1).jpg",
    ingredients:["chicken","cheese","cream"]
  },
  {
    id: 3,
    name: "Garlic Bread",
    price: "$80",
    image: "/images/baked-clam-with-garlic-butter-served-with-garlic-bread-dark-background (1).jpg",
    ingredients:["garlic","bread","butter"]
  },
  { id: 4, name: "Cheese Sticks", price: "$100", image: "/images/kanape-with-mix-salad-side-view (1).jpg",ingredients:["cheese","bread","butter"]},
  { id: 5, name: "Rib - Eye", price: "$100", image: "/images/top-view-steak-with-tomato-paper-steak-board (1).jpg",ingredients:["meat","butter","pepper"]},
  { id: 6, name: "T-BONE STEAK", price: "$120", image: "/images/delicious-meat-with-sauce-wooden-board (1).jpg",ingredients:["meat","butter","pepper"]},
  {
    id: 7,
    name: "Chicken Steak",
    price: "$90",
    image: "/images/top-view-grilled-chicken-steak-with-garnish-tomato-pepper-dark-wooden-table (1).jpg",
    ingredients:["chicken","pepper","tomato"]
  },
  {
    id: 8,
    name: "Morococcan Steak",
    price: "$150",
    image: "/images/grilled-chicken-breasts-with-vegetables (1).jpg",
    ingredients:["chicken","pepper","tomato"]
  },
  {
    id: 9,
    name: "Chocholate Cake",
    price: "$110",
    image: "/images/top-view-delicious-dessert-with-strawberries (1).jpg",
    ingredients:["chocolate","cream"]
  },
  {
    id: 10,
    name: "Mooss Cake",
    price: "$100",
    image: "/images/slice-chocolate-cake-wooden-board (1).jpg",
    ingredients:["chocolate","cream"]
  },
  {
    id: 11,
    name: "Cheesecake",
    price: "$150",
    image: "/images/side-view-cheesecake-with-chocolate-syrup-strawberry-mint-whipped-cream-cherry-black-tea (1).jpg",
    ingredients:["cheese","cream","chocolate","strawberry"]
  },
  {
    id: 12,
    name: "Kiwi Lemonade",
    price: "$80",
    image: "/images/kiwi-fruit-cocktail-martini-glass-garnished-with-apple-slices-bamboo-skewer (1).jpg",
    ingredients:["kiwi","lemon","water"]
  },
  {
    id: 13,
    name: "Orange Soda",
    price: "$90",
    image: "/images/orange-cocktail-topped-with-lime-slice (1).jpg",
    ingredients:["orange","lemon","water"]
  },
  {
    id: 14,
    name: "Strwawberry Lemonade",
    price: "$90",
    image: "/images/fruit-cocktail-with-fresh-strawberry (1).jpg",
    ingredients:["strawberry","lemon","water"]
  },
];

// ── Category → background image map ──────────────────────────────────────────
const CATEGORY_IMAGES = {
  Starters:  "/images/marika-sartori-fMeSG8DVDU8-unsplash.jpg",
  Mains:     "/images/grilled-beef-steak-dark-wooden-surface.jpg",
  Dips:      "/images/grilled-beef-steak-dark-wooden-surface.jpg",
  Sides:     "/images/marika-sartori-fMeSG8DVDU8-unsplash.jpg",
  Desserts:  "/images/chocolate-fondue-with-icecream-ball.jpg",
  Drinks:    "/images/cocktail.jpg",
};

const CATEGORY_FALLBACK = "/images/grilled-beef-steak-dark-wooden-surface.jpg";

// ── Hardcoded layout (used when no DB items are passed) ───────────────────────
const HARDCODED_GROUPS = [
  [1, 2, 3],
  [4],
  [5, 6, 7],
  [8],
  [9, 10, 11],
  [12, 13, 14],
];

const overlayOpacity = 0.5;

const sectionStyle = (img) => ({
  backgroundImage: `linear-gradient(rgba(13,11,10,${overlayOpacity}), rgba(13,11,10,${overlayOpacity})), url('${img}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  marginBottom: "50px",
  backgroundAttachment: "scroll",
  padding: "40px 16px",
  minHeight: "160px",
});

// ── DB-driven layout: items grouped by category ───────────────────────────────
function DbMenuLayout({ items, addToCart }) {
  const categoryOrder = ["Starters", "Mains", "Dips", "Sides", "Desserts", "Drinks"];

  // Group items by category preserving order
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  // Sort categories: known order first, then alphabetical remainder
  const categories = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !categoryOrder.includes(c)).sort(),
  ];

  return (
    <div style={{ marginTop: "50px" }}>
      {categories.map((category, catIndex) => (
        <React.Fragment key={category}>
          {/* Section divider (not before the very first — MenuPage already renders Starters header) */}
          {catIndex > 0 && (
            <div style={sectionStyle(CATEGORY_IMAGES[category] || CATEGORY_FALLBACK)}>
              <h2 className="chop-section-label">{category}</h2>
            </div>
          )}

          <div
            className="chop-cards-row container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "22px",
              marginBottom: "40px",
            }}
          >
            {grouped[category].filter((item) => item.available).map((item) => {
              const cardImg = item.imageUrl || CATEGORY_IMAGES[item.category] || CATEGORY_FALLBACK;
              return (
              <div className="chop-card" key={item._id}>
                <div className="chop-card__image">
                  <img
                    src={cardImg}
                    alt={item.name}
                    style={{ objectPosition: item.imagePosition || "50% 50%" }}
                  />
                </div>

                <div className="chop-card__body">
                  <div className="chop-card__title">{item.name}</div>

                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="chop-card__ingredients-wrap">
                      <span className="chop-card__ingredients-label">Ingredients</span>
                      <div className="chop-card__ingredients">
                        {item.ingredients.map((ing, i) => (
                          <span className="chop-card__ingredient-pill" key={i}>{ing}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="chop-card__row">
                    <span className="chop-card__price">
                      Rs {Number(item.price).toLocaleString("en-PK")}
                    </span>
                    <button
                      className="chop-card__btn"
                      onClick={() => addToCart({ id: item._id, name: item.name, price: item.price, image: cardImg })}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                      Add
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}

      <h3 className="chop-quote" style={{ marginTop: "80px", marginBottom: "80px" }}>
        "Enjoy the taste that's done just right."
      </h3>
      <hr className="chop-quote__rule" />
    </div>
  );
}

// ── Hardcoded layout (original, unchanged) ────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function HardcodedMenuLayout({ addToCart }) {
  return (
    <div style={{ marginTop: "50px" }}>
      {HARDCODED_GROUPS.map((group, index) => (
        <React.Fragment key={index}>
          <div
            className="chop-cards-row container"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${group.length}, 1fr)`,
              gap: "22px",
              marginBottom: "40px",
            }}>
            {products
              .filter((item) => group.includes(item.id))
              .map((item) => (
                <div className="chop-card " key={item.id}>
                  <div className="chop-card__image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="chop-card__body">
                    <div className="chop-card__title">{item.name}</div>
                    {item.ingredients && (
                      <div className="chop-card__ingredients-wrap">
                        <span className="chop-card__ingredients-label">Ingredients</span>
                        <div className="chop-card__ingredients">
                          {item.ingredients.map((ing, i) => (
                            <span className="chop-card__ingredient-pill" key={i}>{ing}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="chop-card__row">
                      <span className="chop-card__price">{item.price}</span>
                      <button className="chop-card__btn" onClick={() => addToCart(item)}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {group.includes(4) && (
            <div style={sectionStyle("/images/grilled-beef-steak-dark-wooden-surface.jpg")}>
              <h2 className="chop-section-label">Main Course</h2>
            </div>
          )}

          {group.includes(8) && (
            <div style={sectionStyle("/images/chocolate-fondue-with-icecream-ball.jpg")}>
              <h2 className="chop-section-label">Desserts</h2>
            </div>
          )}

          {group.includes(11) && (
            <div style={sectionStyle("/images/cocktail.jpg")}>
              <h2 className="chop-section-label">Drinks</h2>
            </div>
          )}
        </React.Fragment>
      ))}
      <h3 className="chop-quote" style={{ marginTop: "80px", marginBottom: "80px" }}>
        "Enjoy the taste that's done just right."
      </h3>
      <hr className="chop-quote__rule" />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
const Card = ({ addToCart, dbItems, dbLoaded }) => {
  // While the DB response hasn't arrived yet, render nothing (avoid flashing hardcoded items)
  if (!dbLoaded) return null;

  // DB items available → use DB-driven layout
  if (dbItems && dbItems.length > 0) {
    return <DbMenuLayout items={dbItems} addToCart={addToCart} />;
  }

  // DB loaded but empty → show nothing (admin hasn't added any dishes yet)
  return null;
};

export default Card;