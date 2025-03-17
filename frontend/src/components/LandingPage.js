import React from "react";
import { Link } from "react-router-dom"; 
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="LandingPage">
            <div className="main-content">
                <div className="landing-container">
                    <h1 className="landing-title">Welcome to Whitworth University</h1>
                    <h2 className="landing-subtitle">Please Scan Item Barcodes</h2>
                    <div className="landing-scanner-area">
                        <div className="scanner-box">
                            <div className="scanner-animation"></div>
                            <p>Position barcode in scanning area</p>
                        </div>
                    </div>
                    <div className="landing-actions">
                        <Link to="/login" className="admin-login-btn">Administrator Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;