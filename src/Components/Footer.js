import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-logo">Meesho</h2>
        <h3 className="footer-title">Get in Touch</h3>
        <div className="footer-form">
          <input
            type="email"
            placeholder="Enter email address"
            className="footer-input"
          />
         
      </div>
       <div>
        <button className="footer-btn">Submit</button>
        </div>
        </div>
       
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p className="paragraph">© 2025 meesho. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
