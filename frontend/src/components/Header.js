import React from "react";
import { Link } from "react-router-dom"; 
import '../styles/Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src="/WhitworthLogo.png" alt="Whitworth Logo" />
            </div>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li> {/* Link to Home page */}
                    <li><Link to="/login">Login</Link></li> {/* Link to Login page */}
                </ul>
            </nav>
        </header>
    );
};

export default Header;