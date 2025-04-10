import React, { useState, useEffect } from "react";
import axios from "axios";
import EditItemForm from "../components/EditItemForm";
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    weight: "",
    expirationDate: ""
  });

  // Fetch items from the backend
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get("http://localhost:5000/api/items")
      .then(response => setItems(response.data))
      .catch(error => console.error("Error fetching items:", error));
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/items", {
      name: formData.itemName,
      category: formData.category,
      quantity: formData.quantity,
      weight: formData.weight,
      expiration_date: formData.expirationDate
    })
    .then(response => {
      alert("Item added successfully!");
      fetchItems(); // Refresh the list
      setFormData({ itemName: "", category: "", quantity: "", weight: "", expirationDate: "" });
    })
    .catch(error => console.error("Error adding item:", error));
  };

  // Handle item deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://localhost:5000/api/items/${id}`)
        .then(response => {
          alert("Item removed successfully!");
          fetchItems(); // Refresh the list
        })
        .catch(error => console.error("Error deleting item:", error));
    }
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-content">
        <h2>Food Inventory Dashboard</h2>

        {/* Display Items */}
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Weight (kg)</th>
              <th>Expiration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Check if the 'items' array has any data */}
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.net_weight}</td> 
                  <td>{item.expiration_date || "N/A"}</td> 
                  <td className="actionTab">
                    <button className="editItem" onClick={() => setShowEditForm(true)}>Edit</button>
                    <button onClick={() => handleDelete(item.item_id)}>Remove</button>
                  </td>
                </tr>
              ))
            ) : (
              //If no items are available display message but provide action buttons
              <tr>
                <td colSpan="5">No items available</td> 
                <td className="actionTab">
                  <button className="actionButton" id="editItem" onClick={() => setShowEditForm(true)}>Edit</button>
                  <button className="actionButton" id="removeItem" onClick={() => alert("No item to delete!")}>Remove</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showEditForm && <EditItemForm onClose={() => setShowEditForm(false)} />}

        {/* Add Item Form */}
        <section className="add-item">
          <h3>Add New Item</h3>
          <form onSubmit={handleSubmit}>
            <label><input type="text" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required /></label>
            <label><input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required /></label>
            <label><input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required /></label>
            <label><input type="number" step="0.1" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required /></label>
            <label><input type="date" name="expirationDate" placeholder="Expiration Date" value={formData.expirationDate} onChange={handleChange} required /></label>
            <button type="submit">Add Item</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
