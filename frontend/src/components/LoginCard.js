
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button2 from "./Button2";
import "./LoginCard.css";
import { authLogin } from "../api";

const LoginCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
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
      const data = await authLogin(formData);

      // Success — save JWT token & user info, then redirect
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      setSuccessMsg(data.message || `Login successful! Welcome back, ${data.user.firstName}!`);
      setTimeout(() => {
        navigate(data.user.isAdmin ? "/admin" : "/");
      }, 2000);
    } catch (err) {
      if (err.status === 401 || err.status === 400) {
        setError(err.message || "Wrong Credentials! Please check your email and password.");
      } else {
        setError("Cannot connect to server. Please make sure the backend is running.");
      }
      console.error("Login error:", err);
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
      <div className="logincard2">
        <div className="border3" />
        <div className="content2">
          <div className="lheading1">
            <h2 style={{ color: "#bd9f67" }} className="text-center">
              Login
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
            <div className="logininput">
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
              <div className="signin" style={{ marginTop: "30px" }}>
                <Button2 text={loading ? "Signing In..." : "Sign In"} type="submit" disabled={loading} />
                <p style={{ marginTop: "15px" }}>
                  Don't have an account?{" "}
                  <Link to="/signup" className="span" style={{ color: "#bd9f67" }}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
