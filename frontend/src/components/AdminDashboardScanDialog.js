import React, { useState, useEffect } from "react";
import "../styles/AdminDashboardScanDialog.css";

//ScanDialog Component for capturing barcode input through keyboard simulation
const ScanDialog = ({ message, onConfirm, onCancel }) => {
  //State to determine if the scanner is active
  const [scannerActive, setScannerActive] = useState(false);
  //State to store the currently scanned barcode characters
  const [scannedCode, setScannedCode] = useState('');

  //useEffect to activate scanner and listen for key presses
  useEffect(() => {
    setScannerActive(true);

    //Handle barcode input via keyboard events
    const handleKeyPress = (e) => {
      //Exit if scanner is not active
      if (!scannerActive) return;

      // If Enter key is pressed and a code has been typed, treat it as a complete scan
      if (e.key === 'Enter' && scannedCode) {
        handleBarcodeScanned(scannedCode);  // Pass scanned code to handler
        setScannedCode(''); // Reset the scanned code
        return;
      }

      //Append valid key characters to scannedCode (letters, numbers, dash)
      if (e.key.length === 1 || e.key === '-') {
        setScannedCode(prev => prev + e.key);
      }
    };

    //Register and cleanup keyboard event listener
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [scannerActive, scannedCode]);

  //Placeholder function to handle scanned barcode
  const handleBarcodeScanned = (code) => {
    console.log('Barcode scanned:', code);
  };

  // Function to render simulated barcode lines for UI effect
  const renderBarcodeLines = () => {
    const lines = [];
    const sampleCode = ""; // Can be updated to show a fixed barcode below the graphic

    // Generate 40 vertical lines with random height and thickness
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

  // Main render of the ScanDialog UI
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        <h3>Scan Your Item(s)</h3>
        <hr />
        <div className="admin-scanner-area">
          <div className={`admin-scanner-box ${scannerActive ? 'active' : ''}`}>
            {renderBarcodeLines()}
            <div className="admin-scanner-animation"></div>
            <p>Target Barcode</p>
            {/* Live feedback showing current scanned input */}
            {scannedCode && (
              <div className="admin-scanning-feedback">Reading: {scannedCode}</div>
            )}
          </div>
        </div>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="confirm-btn">Save</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ScanDialog;
