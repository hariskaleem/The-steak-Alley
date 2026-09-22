import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  const [useFixed, setUseFixed] = useState(false);

  useEffect(() => {
    const update = () => setUseFixed(window.innerWidth >= 768); // disable fixed on small screens
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const overlayOpacity = 0.4;

  const sectionStyle = (img) => ({
    backgroundImage: `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url('${img}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: useFixed ? "fixed" : "scroll",
    padding: "40px 16px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    minHeight: "160px",
  });

  return (
    <div>
      <div className="row justify-content-center text-center ">
        <h4 style={{ marginTop: "70px", marginBottom: "40px", color: "gray" }}>From Our Menu</h4>

        <div
          className="container menu-category-section"
          style={sectionStyle("/images/marika-sartori-fMeSG8DVDU8-unsplash.jpg")}>
          <Link to="/menu?category=Starters" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              STARTERS
            </h2>
          </Link>
        </div>

        <div
          className="container menu-category-section"
          style={sectionStyle("/images/grilled-beef-steak-dark-wooden-surface.jpg")}>
          <Link to="/menu?category=Mains" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              MAINS
            </h2>
          </Link>
        </div>

        <div
          className="container menu-category-section"
          style={sectionStyle("/images/alex-haney-dnGPjbo1nj0-unsplash (1).jpg")}>
          <Link to="/menu?category=Sides" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              SIDES
            </h2>
          </Link>
        </div>

        <div
          className="container menu-category-section"
          style={sectionStyle("/images/chocolate-fondue-with-icecream-ball.jpg")}>
          <Link to="/menu?category=Desserts" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              DESSERTS
            </h2>
          </Link>
        </div>

        <div className="container menu-category-section" style={sectionStyle("/images/cocktail.jpg")}>
          <Link to="/menu?category=Drinks" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              DRINKS
            </h2>
          </Link>
        </div>

        <div
          className="container menu-category-section"
          style={sectionStyle("/images/victoria-shes-XhJsHDEn5Xo-unsplash (1).jpg")}>
          <Link to="/menu?category=Dips" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              DIPS
            </h2>
          </Link>
        </div>

        <div
          className="container menu-category-section"
          style={sectionStyle(
            "/images/sliced-grilled-steak-wooden-board-bell-pepper-potato-eggplant-salt-top-view.jpg",
          )}>
          <Link to="/menu" className="text-decoration-none">
            <h2 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              VIEW FULL MENU
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
