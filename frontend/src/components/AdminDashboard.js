import React, { useState, useEffect } from "react";
import axios from "axios";
import EditItemForm from "../components/EditItemForm";
import ConfirmDialog from "./ConfirmationDialog";
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

  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get("http://localhost:5000/api/items")
      .then(response => setItems(response.data))
      .catch(error => console.error("Error fetching items:", error));
  };

  const showToast = (message, isSuccess = true) => {
    const notif = document.getElementById("dashBoardNotification");
    if (notif) {
      notif.textContent = message;
      notif.style.backgroundColor = isSuccess ? "#4BB543" : "#FF3333";
      notif.style.display = "block";
      setTimeout(() => {
        notif.style.display = "none";
      }, 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/items", {
      name: formData.itemName,
      category: formData.category,
      quantity: formData.quantity,
      weight: formData.weight,
      expiration_date: formData.expirationDate
    })
    .then(() => {
      showToast("Item added");
      fetchItems();
      setFormData({ itemName: "", category: "", quantity: "", weight: "", expirationDate: "" });
    })
    .catch(error => {
      console.error("Error adding item:", error);
      showToast("Add failed. Please try again.", false);
    });
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) {
      showToast("No item selected", false);
      return;
    }

    axios.delete(`http://localhost:5000/api/items/${itemToDelete}`)
      .then(() => {
        showToast("Item Removed");
        fetchItems();
        setItemToDelete(null);
        setShowConfirm(false);
      })
      .catch(error => {
        console.error("Error deleting item:", error);
        showToast("Delete failed. Please try again.", false);
      });
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-content">
        <h2 id="pageTitle">Inventory Dashboard</h2>
        <div id="dashBoardNotification"></div>
        <div id="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Weight (kg)</th>
              <th>Expiration Date</th>
              <th id="actionMenu">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                    <button className="removeItem" onClick={() => handleDeleteClick(item.item_id)}>Remove</button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan="5">No items available</td>
                  <td class="actionTab">
                    <button
                      className="editItem disabled"
                      disabled
                    >
                      Edit
                    </button>
                    <button
                      className="actionButton"
                      onClick={() => showToast("No item to remove.", false)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
        </div>
        {showEditForm && <EditItemForm onClose={() => setShowEditForm(false)} />}

        <section className="add-item">
          <h3>Add New Item</h3>
          <form onSubmit={handleSubmit}>
            <label><input className="addFormAttribute" type="text" name="itemName" placeholder="Name" value={formData.itemName} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="number" step="0.1" name="weight" placeholder="Weight(kg)" value={formData.weight} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="date" name="expirationDate" placeholder="Expiration Date" value={formData.expirationDate} onChange={handleChange} required /></label>
            <div id="addFormButtons">
              <button type="submit" id="manualAdd">Add Item</button>
              <button type="submit" id="scanAdd">Scan to Add</button>
            </div>
          </form>
        </section>

        {showConfirm && (
          <ConfirmDialog
            message="Are you sure you want to delete this item?"
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowConfirm(false);
              setItemToDelete(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
