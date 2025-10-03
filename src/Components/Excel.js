import React, {  useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Excel.css";
import "./Login.css";
import "./Signup.css";
 

// ---------------------- LOGIN COMPONENT ----------------------


function Login() {
  const [mode, setMode] = useState("login"); // login | signup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    gst: "",
    city: "",
    country: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [forgotValue, setForgotValue] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null); 
  
  // null: no modal, 0: forgot form, 1: otp, 2: reset password

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ====== LOGIN ======
const handleSubmit = async (e) => {
e.preventDefault();

  try {
    const res = await axios.post(
      "https://product-backend-2-6atb.onrender.com/login",
      {
        email: formData.email.trim().toLowerCase(), // match backend
        password: formData.password,
      }
    );

    if (res.data.success) {
      alert("Login successful!");
      localStorage.setItem("token", res.data.token); // optional: save JWT
      // Navigation handled elsewhere (e.g., react-router's navigate)
    } else {
      alert(res.data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Full error:", err);

    if (err.response && err.response.data) {
      alert(err.response.data.message || "Server responded with an error");
    } else {
      alert("Network/server error. Please try again later.");
    }
  }
};




  // === Forgot password ===
  const handleForgotPassword = async () => {
    if (!forgotValue || forgotValue.trim() === "") {
      alert("Please enter your email or mobile number");
      return;
    }

    try {
      let payload = {};
      if (forgotValue.includes("@")) {
        payload = { email: forgotValue };
      } else {
        payload = { mobileNumber: forgotValue };
      }

      const res = await axios.post(
        "https://product-backend-2-6atb.onrender.com/forgot-password",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        alert("OTP sent successfully!");
        setStep(1); // move to OTP modal
      } else {
        alert(res.data.message || "Reset failed");
      }
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Server error");
    }
  };

  // ====== Verify OTP ======
  const handleVerifyOtp = async () => {
    try {
      if (!resetOtp) return alert("Please enter OTP");

      const res = await axios.post(
        "https://product-backend-2-6atb.onrender.com/verify-otp",
        { otp: resetOtp.toString() },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        alert("OTP verified successfully!");
        setStep(2); // Move to reset password modal
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error verifying OTP");
    }
  };

  // ====== Reset Password ======
  
    const handleResetPassword = async (e) => {
    if (e) e.preventDefault();

    try {
      // ✅ Validation
      if (!newPassword || !confirmPassword)
        return alert("Please fill both password fields");
      if (newPassword !== confirmPassword)
        return alert("Passwords do not match");

      setLoading(true);

      // Build payload dynamically (only include fields that exist)
      const payload = { newPassword, confirmPassword };

      // include otp if we have one (some backends expect it)
      if (resetOtp) payload.otp = resetOtp;

      // include identifier if provided (some backends require email/mobile in reset)
      if (forgotValue) {
        if (forgotValue.includes("@")) payload.email = forgotValue.trim().toLowerCase();
        else payload.mobileNumber = forgotValue.trim();
      }

      const res = await axios.post(
        "https://product-backend-2-6atb.onrender.com/reset-password",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.success) {
        alert(res.data.message || "Password reset successful!");
        // reset state
        setStep(null);
        setNewPassword("");
        setConfirmPassword("");
        setResetOtp("");
        setForgotValue("");
        setShowSuccessModal(true);
      } else {
        // backend returned success:false
        alert(res.data?.message || "Unable to reset password.");
      }
    } catch (error) {
      // show server-provided error message when available
      console.error("Reset error:", error.response?.data || error.message);
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error resetting password";
      alert("Error resetting password: " + serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // ====== Resend OTP ======
  const handleResend = async () => {
    try {
      const res = await axios.post(
        "https://product-backend-2-6atb.onrender.com/resend-otp",
        { value: forgotValue }
      );

      if (res.data.success) {
        alert("OTP resent successfully");
      } else {
        alert(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="loginpage-container">
      <div className="loginpage-box">
        <div className="loginpage-left">Meesho</div>
        <div className="loginpage-right">
          <h2>{mode === "login" ? "Login" : "Sign up"}</h2>
          <div className="underline" />

          {mode === "login" && (
            <form onSubmit={handleSubmit} className="loginpage-form">
              <div className="field full">
                <label className="field-label">E-mail ID</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field full">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <input
                    className="input-design"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <p className="forgot-link">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(0); // open forgot modal
                  }}
                >
                  Forgot Password?
                </a>
              </p>
              <div className="field full">
                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* STEP 0: Forgot Password Modal */}
      {step === 0 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Forgot Password</h3>
            <label>Email or Mobile Number</label>
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={forgotValue}
              onChange={(e) => setForgotValue(e.target.value)}
            />
            <button className="btn-primary" onClick={handleForgotPassword}>
              Send OTP
            </button>
            <button className="close-btn" onClick={() => setStep(null)}>
              ✖ Close
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Enter OTP Modal */}
      {step === 1 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value)}
            />
            <button className="btn-primary" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            <p className="resend-text">
              Didn't get OTP?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleResend();
                }}
              >
                Resend
              </a>
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Reset Password Modal */}
      {step === 2 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3  className="forgot">Reset Password</h3>

            <label>New Password</label>
            <div className="input-wrap">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPassword((s) => !s)}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword((s) => !s)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="btn-primary" onClick={handleResetPassword}>
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Success!</h3>
            <p className="forgot">Congratulations! You have been successfully authenticated</p>
            <button
              className="btn-primary"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


//-------------------------signup component--------------------------

 



function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gst: "",
    city: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("showOtpBox changed:", showOtpBox);
  }, [showOtpBox]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const validateForm = () => {
    if (!formData.firstName) return "First Name is required";
    if (!formData.lastName) return "Last Name is required";
    if (!formData.email) return "Email is required";
    if (!formData.phone) return "Phone number is required";
    if (!formData.city) return "City is required";
    if (!formData.country) return "Country is required";
    if (!formData.password) return "Password is required";
    if (!formData.confirmPassword) return "Confirm Password is required";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const err = validateForm();
    if (err) {
      setErrorMsg(err);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobileNumber: formData.phone,
      gstNumber: formData.gst,
      city: formData.city,
      country: formData.country,
      createPassword: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      console.log("Signup request payload:", payload);
      const res = await axios.post(
        "https://product-backend-2-6atb.onrender.com/signup",
        payload
      );

      console.log("Signup HTTP status:", res.status);
      console.log("Signup response body:", res.data);

      // Flexible success detection:
      const body = res.data || {};
      const successDetected =
        body.success === true ||
        body.status === true ||
        body.status === "ok" ||
        body.otpSent === true ||
        body.verified === true ||
        (typeof body.message === "string" && (body.message.toLowerCase().includes("otp") || body.message.toLowerCase().includes("sent") || body.message.toLowerCase().includes("success"))) ||
        res.status === 200 ||
        res.status === 201;

      if (successDetected) {
        setEmail(formData.email); // keep email for verify
        setShowOtpBox(true); // <-- OTP box should appear
        setErrorMsg("");
        alert("Signup successful — OTP sent. Please enter OTP.");
      } else {
        const message = body.message || "Signup failed. Check console/network.";
        setErrorMsg(message);
        console.warn("Signup not treated as success:", res.data);
      }
    } catch (err) {
      console.error("Signup request error:", err);
      const details = err.response?.data?.message || err.message || "Server/network error";
      setErrorMsg(details);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMsg("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const payload = { email, mobileNumber: formData.phone, otp };

    try {
      console.log("Verify OTP payload:", payload);
      const res = await axios.post(
        "https://product-backend-2-6atb.onrender.com/verify-otp",
        payload
      );

      console.log("OTP verify HTTP status:", res.status);
      console.log("OTP verify response body:", res.data);

      const body = res.data || {};
      const msg = (body.message || "").toString().toLowerCase();

      const successDetected =
        body.success === true ||
        body.status === true ||
        body.status === "ok" ||
        body.verified === true ||
        msg.includes("verified") ||
        msg.includes("success") ||
        res.status === 200 ||
        res.status === 201;

      if (successDetected) {
        if (body.token) localStorage.setItem("token", body.token);
        alert("OTP Verified! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        setErrorMsg(body.message || "Invalid OTP. Try again.");
        console.warn("OTP verification not treated as success:", res.data);
      }
    } catch (err) {
      console.error("OTP verify request error:", err);
      const details = err.response?.data?.message || err.message || "OTP verification failed";
      setErrorMsg(details);
    } finally {
      setLoading(false);
    }
  };

  // QUICK TEST helper: uncomment to force show OTP and check UI
  // const forceShowOtpBox = () => setShowOtpBox(true);

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        {errorMsg && <div style={{ color: "red", marginBottom: 10 }}>{errorMsg}</div>}

        {!showOtpBox ? (
          <form onSubmit={handleSignup} className="signup-form">
            <div className="field half">
              <label>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>

            <div className="field half">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="field full">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="field full">
              <label>Phone *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="field full">
              <label>GST Number</label>
              <input type="text" name="gst" value={formData.gst} onChange={handleChange} />
            </div>

            <div className="field half">
              <label>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="field half">
              <label>Country *</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </div>

            <div className="field full password-field">
              <label>Password *</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="field full password-field">
              <label>Confirm Password *</label>
              <div className="password-wrapper">
                <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="field full">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Please wait..." : "Sign Up"}
              </button>
            </div>

            <p className="login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        ) : (
          <div className="otp-box">
            <h3>Enter OTP sent to {email}</h3>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div style={{ marginTop: 10 }}>
              <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
            <div style={{ marginTop: 8 }}>
              Didn't receive OTP? Check your spam or try again after some time.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------- DASHBOARD COMPONENT ----------------------
function Dashboard() {
  const [file, setFile] = useState(null);
  const [subOrderNo, setSubOrderNo] = useState("");
  const [filterResult, setFilterResult] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState({
    all: 0,
    rto: 0,
    door_step_exchanged: 0,
    delivered: 0,
    cancelled: 0,
    ready_to_ship: 0,
    shipped: 0,
    other: 0,
    totalSupplierListedPrice: 0,
    totalSupplierDiscountedPrice: 0,
    sellInMonth: 0,
    totalProfit: 0,
    deliveredSupplierDiscountedPriceTotal: 0,
    totalDoorStepExchanger: 0,
  });
  const [profitPercent, setProfitPercent] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showFilteredView, setShowFilteredView] = useState(false);
  

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Toggle menu when clicking Shivayom
  const handleToggle = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = () => {
    fetch("https://product-backend-2-6atb.onrender.com/download-pdf", {
      method: "GET",
      headers: { Accept: "application/pdf" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to download");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "dashboard-report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Download error:", err);
        alert("Failed to download PDF. Please try again.");
      });
  };

  const validateFile = (file) => {
    return (
      file &&
      (file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"))
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid CSV or Excel file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    } else {
      alert("Only .csv or .xlsx files are supported");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFilter = async () => {
    if (!subOrderNo) {
      alert("Please enter a Sub Order No.");
      return;
    }
    try {
      const res = await axios.get(
        `https://product-backend-2-6atb.onrender.com/filter/${subOrderNo}`
      );
      setFilterResult(res.data);
      const calcProfit = 500 - res.data.discountedPrice;
      const calcProfitPercent = (calcProfit / 500) * 100;
      setProfitPercent(calcProfitPercent.toFixed(2));
      setShowFilteredView(true);
    } catch (err) {
      console.error("Filter failed", err);
      alert("No matching sub order found");
    }
  };

  const handleSubmitAll = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const uploadRes = await axios.post(
        "https://product-backend-2-6atb.onrender.com/upload",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = uploadRes.data;
      const totalListed = result.totals?.totalSupplierListedPrice || 0;
      const totalDiscounted = result.totals?.totalSupplierDiscountedPrice || 0;
      const totalProfit = result.totals?.totalProfit || 0;
      const deliveredTotalDiscounted =
        result.totals?.deliveredSupplierDiscountedPriceTotal || 0;
      const totalDoorStepExchanger =
        result.totals?.totalDoorStepExchanger || 0;
      const sellInMonthProducts = result.totals?.sellInMonthProducts || 0;

      const updatedData = {
        all: result.all?.length || 0,
        rto: result.rto?.length || 0,
        door_step_exchanged: result.door_step_exchanged?.length || 0,
        delivered: result.delivered?.length || 0,
        cancelled: result.cancelled?.length || 0,
        ready_to_ship: result.ready_to_ship?.length || 0,
        shipped: result.shipped?.length || 0,
        other: result.other?.length || 0,
        totalSupplierListedPrice: totalListed,
        totalSupplierDiscountedPrice: totalDiscounted,
        sellInMonth: sellInMonthProducts,
        totalProfit,
        deliveredSupplierDiscountedPriceTotal: deliveredTotalDiscounted,
        totalDoorStepExchanger,
      };

      setData(updatedData);

      const calcProfitPercent =
        sellInMonthProducts > 0
          ? (totalProfit / (sellInMonthProducts * 500)) * 100
          : 0;
      setProfitPercent(calcProfitPercent.toFixed(2));

      if (result.profitByDate) {
        let graphArr = [];
        if (!Array.isArray(result.profitByDate)) {
          graphArr = Object.entries(result.profitByDate).map(
            ([date, profit]) => ({
              date,
              profit,
            })
          );
        } else {
          graphArr = result.profitByDate;
        }
        setGraphData(graphArr);
      }
    } catch (err) {
      console.error("Submit all failed", err);
      alert("Failed to process & store data");
    }
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div
          className="navbar-logo"
          onClick={() => {
            setShowFilteredView(false);
            setProfitPercent(0);
            setSubOrderNo("");
            setFilterResult(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ cursor: "pointer" }}
        >
          Meesho
        </div>

        <div className="navbar-search">
          <IoSearch  className="search"/>
          <input
            type="search"
            placeholder="Add here Sub Order No"
            value={subOrderNo}
            onChange={(e) => setSubOrderNo(e.target.value)}
          />
         
        </div>

             
         <div>
          <button className="filter-btn" onClick={handleFilter}>
            Filter
          </button>
          {showFilteredView && (
            <button
              className="filter-btn"
              onClick={() => {
                setShowFilteredView(false);
                setProfitPercent(0);
                setSubOrderNo("");
                setFilterResult(null);
              }}
            >
              Back
            </button>
          )}
       </div>

   

     <div className="logo-heading" ref={menuRef}>
      <div onClick={handleToggle} className="logo-container">
        <img src="/Ellipse 2.png" className="shivay" alt="logo" />
        <h1 className="heading1">Shivayom</h1>
      </div>

      {showMenu && (
        <div className="dropdown">
          <Link to="/signup" className="dropdown-item">
            Signup
          </Link>
          <Link to="/login" className="dropdown-item">
            Login
          </Link>
        </div>
      )}
    </div>
        </nav>


      <div className="dashboard-container">
      <h1 className="heading">Product Status Dashboard</h1>
      {!showFilteredView ? (
        <div className="adjust-box">
        <div className="status-boxes">

      <div className="box all">
      <div className="box-content">
      All<br />
    <span>{data.all}</span>
     </div>
    <div className="background-logo">
    <img src="/Vector.png" className="box-symbol" alt="cart" />
    </div>
    </div>

          <div className="box rto">
           <div className="box-content"> 
            RTO<br />
            <span>{data.rto}</span>
            </div>
            <div className="background-logo">
           <img src="/Group.png" className="box-symbol" alt="cart" />
           </div>
          </div>


          <div className="box door_step_exchanged">
           <div className="box-content">
            Door Step Exchanged<br />
            <span>{data.door_step_exchanged}</span>
            <br />
            <small style={{ fontSize: "25px", color: "#222" }}>
              {data.totalDoorStepExchanger.toLocaleString()}
            </small>
            </div>
            <div className="background-logo">
           <img src="/gir.png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box delivered">
            <div className="box-content">
            Delivered<br />
            <span>{data.delivered}</span>
            <br />
            <small style={{ fontSize: "25px", color: "#222" }}>
              ₹{data.deliveredSupplierDiscountedPriceTotal.toLocaleString()}
            </small>
            </div>
            <div className="background-logo">
           <img src="/Vector (2).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box cancelled">
            <div className="box-content">
            Cancelled<br />
            <span>{data.cancelled}</span>
            </div>
            <div className="background-logo">
           <img src="/Group (1).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box ready_to_ship">
            <div className="box-content">
            Pending<br />
            <span>{data.ready_to_ship}</span>
            </div>
           <div className="background-logo">
           <img src="/pending.png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box shipped">
            <div className="box-content">
            Shipped<br />
            <span>{data.shipped}</span>
            </div>
           <div className="background-logo">
           <img src="/Group (2).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Other<br />
            <span>{data.other}</span>
            </div>
            <div className="background-logo">
           <img src="/other.png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Supplier Listed Total Price<br />
            <span>{data.totalSupplierListedPrice.toLocaleString()}</span>
          </div>
           <div className="background-logo">
           <img src="/Group (3).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Supplier Discounted Total Price<br />
            <span>{data.totalSupplierDiscountedPrice.toLocaleString()}</span>
            </div>
            <div className="background-logo">
           <img src="/Group (4).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Total Profit<br />
            <span>{data.totalProfit.toLocaleString()}</span>
            </div>
            <div className="background-logo">
           <img src="/total profit.png" className="box-img" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Profit %<br />
            <span>{profitPercent}%</span>
          </div>
            <div className="background-logo">
           <img src="/Group (5).png" className="box-img" alt="cart" />
           </div>
          </div>
        </div>
        </div>
      ) : (
        filterResult && (
          <div className="status-boxes">
            <div className="box other">
              Supplier Listed Price<br />
              <span>{filterResult.listedPrice.toLocaleString()}</span>
            </div>
            <div className="box other">
              Supplier Discounted Price<br />
              <span>{filterResult.discountedPrice.toLocaleString()}</span>
            </div>
            <div className="box other">
              Profit (per product)<br />
              <span>{(500 - filterResult.discountedPrice).toLocaleString()}</span>
            </div>
            <div className="box other">
              Profit %<br />
              <span>{profitPercent}%</span>
            </div>
          </div>
        )
      )} 

      

    {/* Button to toggle graph */}
<div style={{ margin: "20px 0" }}>
  <button
    className="graph-toggle-btn"
    onClick={() => setShowGraph(!showGraph)}
  >
    {showGraph ? "Hide Profit Graph" : "Show Profit Graph"}
  </button>
</div>

{/* Graph */}
{showGraph && graphData.length > 0 && (
  <div className="graph-container" style={{ width: "100%", height: "400px" }}>
    <h2 className="graph-title">📈 Profit Trend (Per Date)</h2>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={graphData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="#ddd" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "black" }} />
        <YAxis tick={{ fontSize: 12, fill: "black" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          labelStyle={{ fontWeight: "bold", color: "#333" }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#fff" // line color for visibility on gradient background
          strokeWidth={3}
          dot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#B00087" }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}



      {/* File Upload */}
      <div className="square-box">
         <h1 className="head">Upload File</h1>
      <div
        className={`upload-section ${dragActive ? "drag-active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        >
       
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileChange}
        /> 
        <img src="/Group (6).png" className="cloud-icon" alt="upload" />
        <p className="drag">Drag and drop your CSV or Excel file here</p>
        <p className="drop">Or Browser</p>
        {file && <p className="filename">Selected File: {file.name}</p>}
        <button className="upload-btn">Upload</button>
      </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleSubmitAll}
          disabled={!file}
          style={{
            backgroundImage: "linear-gradient(90deg, #B00087, #E8AED9)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            marginRight: "10px",
          }}
        >
          Submit All (Upload & Save)
        </button>
        <button
          onClick={handleDownload}
          style={{
            backgroundImage: "linear-gradient(90deg, #B00087, #E8AED9)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
    </div>
  );
}

function App() {
const isLoggedIn = localStorage.getItem("user");
  return (
<Router>
      <Routes>
        {/* Default page -> Signup */}
        <Route
          path="/"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
