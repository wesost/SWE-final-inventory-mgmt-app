import React from "react";
import "../styles/ConfirmationDialog.css";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        <h3>{message}</h3>
        <hr />
        <div className="dialog-actions">
          <button onClick={onConfirm} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
