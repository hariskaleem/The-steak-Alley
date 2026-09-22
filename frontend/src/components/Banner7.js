import React from "react";

const Banner7 = ({ backgroundClass, title }) => {
  return (
    <section id="home" className={`${backgroundClass} py-5`}>
      <div className="container">
        <div className="row min-vh-100 align-items-center">
          <div className="col-sm-12 text-center text-white text-md-start">
            <h2 className="text-white text-center mb-4">{title}</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner7;