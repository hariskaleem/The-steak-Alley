import React from "react";
import Button2 from "./Button2";

const Banner = () => {
  return (
    <section id="home" className="banner_wrapper py-5">
      <div className="container">
        <div className="row min-vh-100 align-items-center">
          <div className="col-sm-12 text-center text-white text-md-start">
            <h1 className="text-white mb-4">Welcome to The Steak Alley</h1>
            <h4 className="text-white mb-5">"Where Every Cut Tells a Story."</h4>
            <div className="mt-4">
              <Button2 text="Our Menu"  />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
