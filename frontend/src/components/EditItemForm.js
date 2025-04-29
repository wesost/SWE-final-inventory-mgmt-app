import React, { useState, useEffect } from "react";
import "../styles/EditItemForm.css";

const EditItemForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});     //State to hold the form data, initialized with the 'item' prop or an empty object

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;                       //Destructure name and value from the event target
    setFormData((prev) => ({ ...prev, [name]: value }));    //Update the form data with the new value
  };

  const handleSubmit = (e) => {
    e.preventDefault();                                     //Prevent default form submission
    onSave(formData);                                       //Call the onSave function passed in as a prop, passing the form data
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <h3>Edit Item</h3>
        <hr />
        <form onSubmit={handleSubmit}>
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