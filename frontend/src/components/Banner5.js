import React, { useState } from "react";
import Button2 from "./Button2";
import { subscribeToNewsletter } from "../api";

const Banner4 = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const data = await subscribeToNewsletter(email);
      setStatus({ type: "success", message: data.message });
      setEmail("");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="home" className="banner_wrapper5 py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-sm-12 text-center text-white">
            <h2 className="text-center mb-4" style={{ color: "#bd9f67" }}>
              Sign Up To Our Newsletter
            </h2>
            <p className="text-white text-center mb-4">
              Subscribe to receive the latest news, announcements, and special offers
            </p>

            {/* Flex container for input and button */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                maxWidth: "750px",
                margin: "0 auto",
                padding: "0 12px",
              }}>
              <input
                type="email"
                className="form-control"
                id="email1"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                style={{
                  flex: "1 1 0",
                  minWidth: "0",
                  height: "45px",
                }}
              />
              <Button2 text={loading ? "Subscribing..." : "Subscribe"} type="submit" disabled={loading} />
            </form>

            {status.message && (
              <p
                role="status"
                style={{
                  color: status.type === "success" ? "#9bd6a8" : "#f0a0a0",
                  margin: "12px auto 0",
                  fontSize: "14px",
                }}>
                {status.message}
              </p>
            )}

            <div className="d-flex justify-content-center align-items-center p-3 mt-1">
              <div className="d-flex gap-3 flex-nowrap justify-content-center align-items-center">
                <p className="mb-0 text-white">Pinterest</p>
                <i className="fa-solid fa-diamond" style={{ color: "#bd9f67", fontSize: "10px" }}></i>
                <p className="mb-0 text-white">Instagram</p>
                <i className="fa-solid fa-diamond" style={{ color: "#bd9f67", fontSize: "10px" }}></i>
                <p className="mb-0 text-white">Facebook</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner4;
