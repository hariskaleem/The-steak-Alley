import React from "react";
import Banner7 from "./Banner7";
import About from "./About";
import Button2 from "./Button2";
import VideoBanner2 from "./VideoBanner2";
import Chefs from "./Chefs";
import Carousel from "./Carousel";

const AboutPage = () => {
  return (
    <div>
      <Banner7 backgroundClass="banner_wrapper3" title="About Us" />
      <About />
      <section
        id="about"
        className="about_wrapper"
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
        <div className="container mt-5">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-5 text-lg-start">
              <div className="my-3 my-lg-0">
                <h2 className="text-white">Our Food Philosophy</h2>
                <p className="text-white">
                  We let quality ingredients lead the way. Each steak is seasoned with care, grilled to the guest's
                  preference, and served with bold sides that bring the whole table together.
                </p>
                <p className="text-white">
                  Every plate is made to be shared, savored, and remembered long after the last bite.
                </p>
                <div className="mt-4">
                  <Button2 text="Read More" />
                </div>
              </div>
            </div>
            <div className="col-lg-7 mb-4 mb-lg-0">
              <img
                src="\images\grilled-beef-steak-with-fries-grilled-tomato-pepper-sauces (1).jpg"
                className="img-fluid"
                alt="About Us"
                style={{
                  maxHeight: "653px",
                  objectFit: "cover",
                  width: "100%",
                  borderTopLeftRadius: "250px",
                  borderBottomRightRadius: "250px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Book Your Event */}
      <div className="container mt-4 p-4">
        <div className="row mt-4">
          <h1 className="text-white text-center mb-4">Book Your Event</h1>
          <p className="text-center" style={{ marginBottom: "70px", color: "#bd9f67" }}>
            Celebrate life's best moments with generous plates, warm service, and a table made for gathering.
            <br /> From intimate dinners to lively receptions, we will help make your event truly special.
          </p>

          <div className="col-lg-4 col-md-12 mb-4 mb-md-0 text-center event-card-col event-card-col--border">
            <img
              className="event-img"
              style={{ width: "250px" }}
              src="/images/beautiful-christmas-interior-decoration (1).jpg"
              alt=""
            />
            <h5 className="text-uppercase mb-4 mt-4 text-white">CELEBRATIONS</h5>
            <p className="text-white">
              Friday, 21 Nov
              <br />
              Reservations 12Pm To 1.30Pm
            </p>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-center event-card-col event-card-col--border">
            <img
              className="event-img"
              style={{
                width: "250px",
                borderTopLeftRadius: "250px",
                borderTopRightRadius: "250px",
              }}
              src="/images/groom-holds-rustic-wedding-cake (1).jpg"
              alt=""
            />
            <h5 className="text-uppercase mb-4 mt-4 text-white">WEDDINGS</h5>
            <p className="text-white">
              Monday, 17 Nov
              <br />
              Reservations 1Pm To 3.30Pm
            </p>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-center event-card-col">
            <img
              className="event-img"
              style={{ width: "250px" }}
              src="/images/medium-shot-couple-having-lunch-luxury-restaurant (1).jpg"
              alt=""
            />
            <h5 className="text-uppercase mb-4 mt-4 text-white">CORPORATE</h5>
            <p className="text-white">
              Wednesday, 26 Nov
              <br />
              Reservations 3Pm To 5.30Pm
            </p>
          </div>
        </div>
      </div>

      <VideoBanner2 />
      <Chefs />
      <Carousel />
    </div>
  );
};

export default AboutPage;
