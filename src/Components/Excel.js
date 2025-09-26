import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

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
 

// ---------------------- LOGIN COMPONENT ----------------------
function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "otp"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gst: "",
    city: "",
    country: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // signup / login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
      
          const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.phone,
          gstNumber: formData.gst,
          city: formData.city,
          country: formData.country,
          createPassword: formData.password,     // <--- map password -> createPassword
          confirmPassword: formData.confirmPassword
          };
        
        const res = await axios.post("https://product-backend-2-6atb.onrender.com/signup", payload);
        if (res.data.success) {
          alert("Signup successful, OTP sent to your email/phone");
          setMode("otp");
        } else {
          alert(res.data.message || "Signup failed");
        }
      } else {
        const res = await axios.post("https://product-backend-2-6atb.onrender.com/login", {
          email: formData.email,
          password: formData.password,
        });
        if (res.data.success) {
          alert("Login successful");
        } else {
          alert(res.data.message || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://product-backend-2-6atb.onrender.com/verify-otp", {
        email: formData.email,
        otp,
      });
      if (res.data.success) {
        alert("OTP verified, account created!");
        setMode("login");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="loginpage-container">
      <div className="loginpage-box">
        {/* Left branding side */}
        <div className="loginpage-left">Meesho</div>

        {/* Right form side */}
        <div className="loginpage-right">
          <h2>
            {mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign up"
              : "Verify OTP"}
          </h2>
          <div className="underline" />

          {mode !== "otp" ? (
            <form onSubmit={handleSubmit} className="loginpage-form">
              {mode === "signup" && (
                <>
                  <div className="field half">
                    <label className="field-label">
                      First name <span style={{ color: "#d23" }}>*</span>
                    </label>
                    <div className="input-wrap">
                      <input
                      className="input-design"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="field half">
                    <label className="field-label">
                      Last name <span style={{ color: "#d23" }}>*</span>
                    </label>
                    <div className="input-wrap">
                      <input
                      className="input-design"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="field full">
                    <label className="field-label">E-mail ID</label>
                    <input
                    className="input-design"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field half">
                    <label className="field-label">Mobile number</label>
                    <input
                    className="input-design"
                      name="phone"
                      type="tel"
                      placeholder="Mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field half">
                    <label className="field-label">GST number</label>
                    <input
                      name="gst"
                      placeholder="GST number"
                      value={formData.gst}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field half">
                    <label className="field-label">City</label>
                    <input
                    className="input-design"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field half">
                    <label className="field-label">Country</label>
                    <input
                    className="input-design"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field half">
                    <label className="field-label">Create Password</label>
                    <div className="input-wrap">
                      <input
                      className="input-design"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
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

                  <div className="field half">
                    <label className="field-label">Confirm Password</label>
                    <div className="input-wrap">
                      <input
                      className="input-design"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowConfirm((s) => !s)}
                      >
                        {showConfirm ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {mode === "login" && (
                <>
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
                </>
              )}

              {mode === "signup" && (
                <label className="checkbox-row">
                  <input type="checkbox" required /> i agree the terms and
                  conditions
                </label>
              )}

              <div className="field full">
                <button type="submit" className="btn-primary">
                  {mode === "signup" ? "Sign up" : "Sign in"}
                </button>
              </div>

              <div className="field full login-footer">
                {mode === "signup" ? (
                  <>
                    Already Have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setMode("login");
                      }}
                    >
                      Log in
                    </a>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setMode("signup");
                      }}
                    >
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="loginpage-form">
              <div className="field full">
                <label className="field-label">Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="field full">
                <button type="submit" className="btn-primary">
                  Verify OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


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

   

      <div>
     <Link to="/login">
    <div className="logo-heading">
      <img src="/Ellipse 2.png" className="shivay" alt="logo" />
      <h1 className="heading1">Shivayom</h1>
     </div>
     </Link>
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
