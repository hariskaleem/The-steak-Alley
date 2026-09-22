import React from "react";
import Button2 from "./Button2";

const About = () => {
  return (
    <section id="about" className="about_wrapper">
      <div className="container mt-3">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <img
              src="\images\restaurant-corridor-with-small-two-people-tables.jpg"
              className="img-fluid"
              alt="About Us"
              style={{ maxHeight: "575px", objectFit: "cover", width: "100%", borderTopLeftRadius: "250px" }}
            />
          </div>
          <div className="col-lg-7 ps-lg-5 text-lg-start">
            <div className="my-3 my-lg-0">
              <h2 className="text-white about-heading">Our goals &amp; history</h2>
              <p className="text-white about-para">
                The Steak Alley began with a simple goal: serve beautifully grilled steaks in a place that feels warm,
                welcoming, and worth returning to. From our carefully selected cuts to our house-made sauces, every
                detail reflects our love of honest food and memorable hospitality.
              </p>
              <div className="mt-4 about-cta">
                <Button2 text="Read More" />
              </div>

              {/* New row for side by side content */}
              <div className="row align-items-center about-feature-row" style={{ marginTop: "48px" }}>
                <div className="col-lg-6 col-md-6 text-center about-feature-img-col">
                  <img
                    className="img-fluid about-feature-img"
                    style={{ width: "400px", height: "323px", objectFit: "cover" }}
                    src="/images/juicy-steak-medium-rare-beef-with-spices-grilled-vegetables.jpg"
                    alt="About feature"
                  />
                </div>
                <div className="col-lg-6 col-md-6 text-center text-lg-start" style={{ marginTop: "20px" }}>
                  <h3 className="text-white about-hours-heading">Opening hours</h3>
                  <p className="text-white about-hours-para">
                    Mon – thu: 10 am – 01 am
                    <br />
                    Fri – sun: 10 am – 020 am
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
