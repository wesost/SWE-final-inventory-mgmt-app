import React, { useState, useEffect } from "react";
import '../styles/LandingPage.css';
import whitworthLogo from '../assets/whitworth-logo.png'; // Import the logo directly

const LandingPage = () => {
    const [scannerActive, setScannerActive] = useState(false);
    const [scannedCode, setScannedCode] = useState('');
    
    useEffect(() => {
        setScannerActive(true);
        
        const handleKeyPress = (e) => {
            if (!scannerActive) return;
            
            if (e.key === 'Enter' && scannedCode) {
                handleBarcodeScanned(scannedCode);
                setScannedCode('');
                return;
            }
            
            if (e.key.length === 1 || e.key === '-') {
                setScannedCode(prev => prev + e.key);
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [scannerActive, scannedCode]);
    
    const handleBarcodeScanned = (code) => {
        console.log('Barcode scanned:', code);
    };

    const renderBarcodeLines = () => {
        const lines = [];
        const sampleCode = "";

        for (let i = 0; i < 40; i++) {
            const thickness = Math.random() > 0.7 ? 'thick' : (Math.random() > 0.5 ? 'thin' : '');
            const isSpace = Math.random() > 0.8;
            
            lines.push(
                <div 
                    key={i} 
                    className={`barcode-line ${thickness} ${isSpace ? 'space' : ''}`}
                    style={{ height: `${Math.random() * 30 + 70}%` }}
                ></div>
            );
        }
        
        return (
            <div className="barcode-container">
                <div className="barcode">
                    {lines}
                </div>
                <div className="barcode-text">{sampleCode}</div>
            </div>
        );
    };

    return (
        <div className="LandingPage">
            <div className="main-content">
                <div className="landing-container">
                    {/* You can add the logo here if needed */}
                    <div className="logo">
                        <img src={whitworthLogo} alt="Whitworth Logo" />
                    </div>
                    <h1 className="landing-title">Welcome to Whitworth University</h1>
                    <h2 className="landing-subtitle">Please Scan Item Barcodes</h2>
                    
                    <div className="landing-scanner-area">
                        <div className={`scanner-box ${scannerActive ? 'active' : ''}`}>
                            {renderBarcodeLines()}
                            <div className="scanner-animation"></div>
                            <p>Position barcode in scanning area</p>
                            {scannedCode && (
                                <div className="scanning-feedback">Reading: {scannedCode}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
