import React from "react";
import "./Sponsers.css";

const sponsors = [
  { name: "Bistro", icon: "fa-solid fa-utensils" },
  { name: "Cola", icon: "fa-solid fa-bottle-droplet" },
  { name: "Lava", icon: "fa-solid fa-fire-flame-curved" },
  { name: "Fine", icon: "fa-solid fa-star" },
  { name: "Prawns", icon: "fa-solid fa-shrimp" },
  { name: "Slice", icon: "fa-solid fa-pizza-slice" },
];

// Duplicate for seamless infinite loop
const track = [...sponsors, ...sponsors, ...sponsors];

const Sponsers = () => {
  return (
    <section className="sponsor-strip">
      {/* fade edges */}
      <div className="sponsor-fade-left" />
      <div className="sponsor-fade-right" />

      <div className="sponsor-track-wrapper">
        <div className="sponsor-track">
          {track.map((s, i) => (
            <div className="sponsor-logo" key={i}>
              <i className={s.icon} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsers;