import React, {  useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
export default Dashboard;
