import React, { useState } from "react";
import "../styles/ConfirmationDialog.css";

//ConfirmDialog component for confirming deletion of an item (with quantity selection if applicable)
const ConfirmDialog = ({ item, message, onConfirm, onCancel }) => {
  // State to track how many units of the item the user wants to delete
  const [quantityToDelete, setQuantityToDelete] = useState(1);

  //Function to handle the confirmation action
  const handleConfirmClick = () => {
    // Calls the parent onConfirm callback with the selected quantity
    onConfirm(quantityToDelete);
  };

  //Renders a dropdown to select quantity if the item has more than one unit
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
            {
              //Create an array from 1 to item.quantity and map it into <option> elements
              Array.from({ length: item.quantity }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))
            }
          </select>
        </div>
      );
    }

    //If the item has only one unit, no quantity selector is needed
    return null;
  };

  //Render the confirmation dialog UI
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        {/* Custom message passed from parent */}
        <h3>{message}</h3>
        <hr />

        {/* Show quantity selector only if necessary */}
        {renderQuantitySelector()}

        {/* Confirmation and cancellation buttons */}
        <div className="dialog-actions">
          <button onClick={handleConfirmClick} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;