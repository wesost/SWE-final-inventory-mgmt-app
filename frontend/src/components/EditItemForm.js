import React from "react";
import "../styles/EditItemForm.css"; 

const EditItemForm = ({ onClose }) => {
  return (
    <div className="edit-form-overlay">
        <div className="edit-form-container">
            <h3>Edit Item</h3>
            <form>
                <label>
                    <input type="text" name="itemName" placeholder="Item Name" />
                </label>
                <label>
                    <input type="text" name="category" placeholder="Category" />
                </label>
                <label>
                    <input type="number" name="quantity" placeholder="Quantity" />
                </label>
                <label>
                    <input type="number" step="0.1" name="weight" placeholder="Weight (kg)" />
                </label>
                <label>
                    <input type="date" name="expirationDate" placeholder="Expiration Date" />
                </label>
                <div className="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default EditItemForm;
