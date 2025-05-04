import React, { useState } from "react";
import "../styles/ConfirmationDialog.css";

const ConfirmDialog = ({ item, message, onConfirm, onCancel }) => {
  const [quantityToDelete, setQuantityToDelete] = useState(1);

  const handleConfirmClick = () => {
    onConfirm(quantityToDelete);
  };

  const renderQuantitySelector = () => {
    if (item.quantity > 1) {
      return (
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity to delete:</label>
          <select
            id="quantity"
            value={quantityToDelete}
            onChange={(e) => setQuantityToDelete(parseInt(e.target.value))}
          >
            {Array.from({ length: item.quantity }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        <h3>{message}</h3>
        <hr />
        {renderQuantitySelector()}
        <div className="dialog-actions">
          <button onClick={handleConfirmClick} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
