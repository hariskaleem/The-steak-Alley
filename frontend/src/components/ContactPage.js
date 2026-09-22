import React from "react";
import Banner7 from "./Banner7";
import Banner5 from "./Banner5";
import Button2 from "./Button2";
import "./FormCard.css";

const ContactPage = () => {
  return (
    <div>
      <Banner7 backgroundClass="banner_wrapper4" title="Contact Us" />
      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
        <div className="container">
          <div className="row justify-content-center align-items-center contact-row">
            <div className="col-lg-6 col-md-12 contact-map-col" style={{ marginTop: "50px" }}>
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
            <div className="col-lg-6 col-md-10 col-sm-12 mx-auto" style={{ marginTop: "50px" }}>
              <div className="formcard2">
                <div className="border2" />
                <div className="content2">
                  <div className="fheading1">
                    <h2 style={{ color: "#bd9f67" }} className="text-center">
                      Write To Us
                    </h2>
                  </div>

                  <div className="forminput">
                    <label htmlFor="contactName" className="form-label">
                      Name
                    </label>
                    <input type="text" className="form-control" id="contactName" placeholder="Name" />
                    <label htmlFor="contactEmail" className="form-label">
                      Email address
                    </label>
                    <input type="email" className="form-control" id="contactEmail" placeholder="name@example.com" />
                    <label htmlFor="contactMessage" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      placeholder="Write To Us"
                      id="contactMessage"
                      rows="3"></textarea>
                    <Button2 text="Send Message" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Banner5 />
    </div>
  );
};

export default ContactPage;
