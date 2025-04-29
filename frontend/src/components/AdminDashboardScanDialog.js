import React, { useState, useEffect } from "react";
import "../styles/AdminDashboardScanDialog.css";

const ScanDialog = ({ message, onConfirm, onCancel }) => {
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
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        <h3>Scan Your Item(s)</h3>
        <hr />
        <div className="admin-scanner-area">
          <div className={`admin-scanner-box ${scannerActive ? 'active' : ''}`}>
              {renderBarcodeLines()}
            <div className="admin-scanner-animation"></div>
              <p>Target Barcode</p>
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
