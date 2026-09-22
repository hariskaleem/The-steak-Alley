import React from "react";
import Button2 from "./Button2";

const Map = () => {
  return (
    <section className="map_wrapper py-5">
      <div style={{ backgroundColor: "#0d1e2b", paddingBottom: "40px" }}>
        <div className="row align-items-start map-row">
          <div className="col-lg-7 col-md-12" style={{ marginTop: "50px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d13609.20146773975!2d74.3704765!3d31.4884267!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1787338929757!5m2!1sen!2s"
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="The Steak Alley Location"></iframe>
          </div>
          <div
            className="col-lg-5 col-md-12 ps-lg-5 mt-4"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              className="map-info-img"
              style={{
                width: "250px",
                borderTopLeftRadius: "250px",
                borderTopRightRadius: "250px",
              }}
              src="/images/dinner-table-with-foods-soft-drinks-restaurant (1).jpg"
              alt=""
            />
            <p className="text-white text-center map-text" style={{ marginTop: "20px" }}>
              123 Steak Alley Street, New York
            </p>
            <p className="text-white text-center map-text">M. reservations@example.com</p>
            <div className="map-info-btn-wrapper" style={{ marginTop: "24px" }}>
              <Button2 text="Read More" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
