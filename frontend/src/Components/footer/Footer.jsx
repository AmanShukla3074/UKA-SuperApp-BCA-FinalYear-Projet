import './Footer.css'
import React from "react";
import { Link } from "react-router-dom";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import uka_logo from '../Assets/uka_logo2.png'

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-logo">
            <Link to="/"><img src={uka_logo} alt="Logo" /></Link>
        </div>
      <nav className="footer-nav">
        <Link to="/" className="footer-link">
        About us
        </Link>
        <Link to="/shop" className="footer-link">
        T&C
        </Link>
        <Link to="/about" className="footer-link">
        Privacy Policies
        </Link>
        <Link to="/contact" className="footer-link">
          Contact Us
        </Link>
    
      </nav>
      <div className="social-icons">
        <a href="#" className="social-icon">
          <FaSquareXTwitter />
        </a>
        <a href="#" className="social-icon">
          <FaSquareFacebook />
        </a>
        <a href="#" className="social-icon">
          <FaSquareInstagram />
        </a>
      </div>
      <aside className="footer-copyright">
        <p>
          Copyright © 2023 - All right reserved by UKA
        </p>
      </aside>
    </footer>
  );
};

export default Footer;