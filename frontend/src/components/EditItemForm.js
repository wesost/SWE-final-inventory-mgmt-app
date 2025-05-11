import React, { useState, useEffect } from "react";
import "../styles/EditItemForm.css"; // Import the component's CSS for styling

//EditItemForm is a reusable form component for editing item details.
//Props:
//item: the item object to edit
//onClose: function to call when closing the form
//onSave: function to call when saving the updated item
const EditItemForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});   //State to hold form data, initialized with the provided item or an empty object

  //Update formData if the item prop changes
  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  //Generic change handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;                       //Destructure name and value from the input event
    setFormData((prev) => ({ ...prev, [name]: value }));    //Update the specific field in formData based on input name
  };

  //Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();           //Prevent default form behavior (page reload)
    onSave(formData);             //Pass updated data to the parent component via onSave callback
  };

  return (
    <div className="edit-form-overlay">       {/* Overlay background for modal effect */}
      <div className="edit-form-container">   {/* Main container for the form */}
        <h3>Edit Item</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          {/* Item Name Field */}
          <label>
            <input 
              type="text"
              className="formAttribute"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Item Name"
            />
          </label>

          {/* Category Field */}
          <label>
            <input 
              type="text"
              className="formAttribute"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              placeholder="Category"
            />
          </label>

          {/* Quantity Field */}
          <label>
            <input 
              type="number"
              className="formAttribute"
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              placeholder="Quantity"
            />
          </label>

          {/* Net Weight Field */}
          <label>
            <input 
              type="number"
              className="formAttribute"
              step="0.1"
              name="net_weight"
              value={formData.net_weight || ""}
              onChange={handleChange}
              placeholder="Weight (kg)"
            />
          </label>

          {/* Expiration Date Field */}
          <label>
            <input 
              type="date"
              className="formAttribute"
              name="expiration_date"
              value={formData.expiration_date || ""}
              onChange={handleChange}
              placeholder="Expiration Date"
            />
          </label>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="submit">Save</button>                       {/* Submit form and save changes */}
            <button type="button" onClick={onClose}>Cancel</button>   {/* Close the form without saving */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;