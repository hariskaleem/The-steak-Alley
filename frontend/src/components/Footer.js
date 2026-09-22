import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div>
      <div className="mt-3">
        <footer className="chop-footer text-center text-lg-start">
          <div className="container p-4">
            <div className="row mt-4">
              <div className="col-lg-4 col-md-12 mb-4 mb-md-0 text-center chop-footer__col">
                <h5 className="chop-footer__heading mb-4">Contact Us</h5>
                <p className="chop-footer__text">
                  T. +12 344 0567899
                  <br />
                  M. fidalgo@example.com
                </p>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-center chop-footer__col">
                <h5 className="chop-footer__heading mb-4 pb-1">Address</h5>
                <p className="chop-footer__text">
                  Piazza Della Signoria,
                  <br /> 12 21562 . Firenze . Italy
                </p>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-center">
                <h5 className="chop-footer__heading mb-4">Opening Hours</h5>

                <p className="chop-footer__text">
                  Everyday : From 12.30 To 23.00
                  <br />
                  Kitchen Closes At 22.00
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-3 mb-4 d-flex align-items-center justify-content-center">
            <hr className="chop-footer__rule" />
            <h2 className="chop-footer__brand">The Steak Alley</h2>
            <hr className="chop-footer__rule" />
          </div>

          <div className="chop-footer__bar d-flex justify-content-between align-items-center p-2">
            <div className="d-flex gap-4 align-items-center">
              <p className="mb-0 chop-footer__social" style={{ marginLeft: "40px" }}>
                Pinterest
              </p>
              <i className="fa-solid fa-diamond mt-1 chop-footer__diamond"></i>
              <p className="mb-0 chop-footer__social">Instagram</p>
              <i className="fa-solid fa-diamond mt-1 chop-footer__diamond"></i>
              <p className="mb-0 chop-footer__social">Facebook</p>
            </div>
            <p className="mb-0 chop-footer__copyright">© 2024 Copyright: The Steak Alley, All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
