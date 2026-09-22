import React, { useState } from "react";

const slides = [
  {
    quote:
      "\u201cThe steak was perfectly grilled, the sides were full of flavor, and the service made the whole evening feel special.\u201d",
    name: "Arya Stark",
    role: "Chef",
  },
  {
    quote:
      "\u201cA relaxed atmosphere, thoughtful cooking, and a steak I am still talking about. The Steak Alley is a true favorite.\u201d",
    name: "Jon Snow",
    role: "Head Chef",
  },
  {
    quote:
      "\u201cFrom the first course to dessert, every detail felt considered. It is the kind of restaurant you gladly return to.\u201d",
    name: "Daenerys T.",
    role: "Food Critic",
  },
];

const btnStyle = {
  background: "transparent",
  border: "1px solid rgba(189,159,103,0.4)",
  borderRadius: "50%",
  width: "44px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#bd9f67",
  fontSize: "18px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  flexShrink: 0,
};

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const s = slides[current];

  return (
    <div
      className="carousel-wrapper"
      style={{
        backgroundColor: "#0d1e2b",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: "60px",
      }}>
      {/* Title */}
      <div className="container text-center" style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#bd9f67" }}>They Say About Us</h1>
      </div>

      {/* Quote */}
      <div style={{ maxWidth: "680px", width: "100%", padding: "0 16px" }}>
        <h3 className="text-center text-white" style={{ lineHeight: "1.7", fontStyle: "italic", marginBottom: "20px" }}>
          {s.quote}
        </h3>
        <div className="d-flex justify-content-center align-items-center gap-2" style={{ fontSize: "16px" }}>
          <span style={{ color: "#bd9f67" }}>/</span>
          <span className="text-white">By {s.name}</span>
          <span style={{ color: "#bd9f67" }}>/</span>
          <span className="text-white">{s.role}</span>
        </div>
      </div>

      {/* Navigation — arrows + small dots — always below text */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "32px" }}>
        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          style={btnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(189,159,103,0.15)";
            e.currentTarget.style.borderColor = "#bd9f67";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(189,159,103,0.4)";
          }}>
          <i className="fa-solid fa-chevron-left" />
        </button>

        {/* Dot indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? "14px" : "6px",
                height: "6px",
                borderRadius: "100px",
                border: "none",
                background: i === current ? "#bd9f67" : "rgba(189,159,103,0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
                minWidth: 0,
                minHeight: 0,
              }}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next testimonial"
          style={btnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(189,159,103,0.15)";
            e.currentTarget.style.borderColor = "#bd9f67";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(189,159,103,0.4)";
          }}>
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
