import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button2 from "./Button2";
import { authRegister } from "../api";
import "./SignUpCard.css";

const SignUpCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const data = await authRegister(formData);

      // Success — save JWT token & user info, then redirect
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      setSuccessMsg(data.message || `Account created! Welcome, ${data.user.firstName}!`);
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      if (err.status === 409 || err.status === 400) {
        setError(err.message || "Registration failed. Please try again.");
      } else {
        setError("Cannot connect to server. Please make sure the backend is running.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 20px",
    }}>
      <div className="signupcard2">
        <div className="border4" />
        <div className="content2">
          <div className="sheading1">
            <h2 style={{ color: "#bd9f67" }} className="text-center">
              Register
            </h2>
          </div>

          {successMsg && (
            <div
              style={{
                background: "linear-gradient(135deg, #1a3a1a, #2a5a2a)",
                border: "1px solid #4caf50",
                borderLeft: "4px solid #4caf50",
                color: "#a5d6a7",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                animation: "fadeInDown 0.4s ease",
              }}
              role="alert">
              <i className="fa-solid fa-circle-check" style={{ color: "#4caf50", fontSize: "18px" }}></i>
              {successMsg}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "linear-gradient(135deg, #3a1a1a, #5a2a2a)",
                border: "1px solid #f44336",
                borderLeft: "4px solid #f44336",
                color: "#ef9a9a",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
              }}
              role="alert">
              <i className="fa-solid fa-circle-xmark" style={{ color: "#f44336", fontSize: "18px" }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="signinput">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label className="form-label" htmlFor="phone">
                Phone number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                placeholder="password"
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <div className="signup" style={{ marginTop: "30px" }}>
                <Button2 text={loading ? "Signing Up..." : "Sign Up"} type="submit" disabled={loading} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default SignUpCard;

