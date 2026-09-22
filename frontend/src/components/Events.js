import React from "react";
import Button2 from "./Button2";

const Events = () => {
  return (
    <section id="about" className="about_wrapper">
      <div className="container mt-5">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5   text-lg-start ">
            <div className="my-3 my-lg-0">
              <h2 className="text-white">Hosting Events</h2>
              <p className="text-white">
                Bring your next celebration to The Steak Alley. Our team can arrange a welcoming setting, generous
                sharing menus, and attentive service for birthdays, dinners, business gatherings, and more.
              </p>
              <div className="mt-4">
                <Button2 text="Read More" />
              </div>
            </div>
          </div>
          <div className="col-lg-7 mb-4 mb-lg-0">
            <img
              src="\images\small-group-happy-friends-drinking-beer-while-waiter-is-serving-them-snack-tavern (1).jpg"
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
  );
};

export default Events;
