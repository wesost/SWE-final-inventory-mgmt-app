import React, { useState, useEffect } from "react";
import axios from "axios";
import EditItemForm from "../components/EditItemForm";
import ConfirmDialog from "./ConfirmationDialog";
import ScanDialog from "./AdminDashboardScanDialog";
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  //State to control UI components
  const [showEditForm, setShowEditForm] = useState(false);
  const [showScanDialog, setShowScanDialog] = useState(false);

  //Data state
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    barcode: "",
    itemName: "",
    category: "",
    quantity: "",
    weight: "",
    expirationDate: ""
  });

  //Deletion confirmation state
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  //Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  //Fetch all inventory items from backend
  const fetchItems = () => {
    axios.get("http://localhost:5000/api/items")
      .then(response => setItems(response.data))
      .catch(error => console.error("Error fetching items:", error));
  };

  //Display temporary notification message
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

  //Handle changes in the "Add Item" form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Save edited item to backend
  const handleSaveEdit = (updatedItem) => {
    axios.put(`http://localhost:5000/api/items/${updatedItem.item_id}`, updatedItem)
      .then(() => {
        showToast("Item Updated");
        fetchItems(); // Refresh list
        setShowEditForm(false);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        showToast("Update failed. Please try again.", false);
      })
  }

  //Handle form submission to add a new item
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/items", {
      barcode: formData.barcode,
      name: formData.itemName,
      category: formData.category,
      quantity: formData.quantity,
      weight: formData.weight,
      expiration_date: formData.expirationDate
    })
    .then(() => {
      showToast("Item added");
      fetchItems(); //Refresh item list
      setFormData({ barcode: "", itemName: "", category: "", quantity: "", weight: "", expirationDate: "" });
    })
    .catch(error => {
      console.error("Error adding item:", error);
      showToast("Add failed. Please try again.", false);
    });
  };

  //Open confirmation dialog for deletion
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };
  
  const confirmDelete = (quantityToDelete) => {
    if (!itemToDelete) {
      showToast("No item selected", false);
      return;
    }

    if (quantityToDelete >= itemToDelete.quantity) {
      // Delete the whole item if the quantity to delete is equal or more
      axios.delete(`http://localhost:5000/api/items/${itemToDelete.item_id}`)
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
    } else {
      // Otherwise, update the item's quantity
      const updatedQuantity = itemToDelete.quantity - quantityToDelete;

      axios.put(`http://localhost:5000/api/items/${itemToDelete.item_id}`, {
        ...itemToDelete,
        quantity: updatedQuantity
      })
        .then(() => {
          showToast(`Removed ${quantityToDelete} unit(s)`);
          fetchItems();
          setItemToDelete(null);
          setShowConfirm(false);
        })
        .catch(error => {
          console.error("Error updating item quantity:", error);
          showToast("Update failed. Please try again.", false);
        });
    }
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-content">
        <h2 id="pageTitle">Inventory Dashboard</h2>
        <hr id="titleUnderline" />
        <div id="dashBoardNotification"></div>

        {/* Item List Table */}
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
                      <button
                        className="editItem"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowEditForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="removeItem" onClick={() => handleDeleteClick(item)}>Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No items available</td>
                  <td className="actionTab">
                    <button className="editItem disabled" disabled onClick={() => showToast("No Item to Edit", false)}>Edit</button>
                    <button className="removeItem disabled" disabled onClick={() => showToast("No item to Remove", false)}>Remove</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Item Form Dialog */}
        {showEditForm && (
          <EditItemForm
            item={selectedItem}
            onClose={() => setShowEditForm(false)}
            onSave={handleSaveEdit}
          />
        )}

        {/* Admin Control Panel */}
        <div className="adminActions">
        <section className="add-item">
          <h3>Add New Item</h3>
          <hr />
          <form onSubmit={handleSubmit}>
            <label><input className="addFormAttribute" type="text" name="barcode" placeholder="Click here and scan to enter barcode" value={formData.barcode} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="text" name="itemName" placeholder="Name" value={formData.itemName} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="number" step="0.1" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required /></label>
            <label><input className="addFormAttribute" type="date" name="expirationDate" placeholder="Expiration Date" value={formData.expirationDate} onChange={handleChange} required /></label>
            <div id="addFormButtons">
              <button type="submit" id="manualAdd">Add Item</button>
              <button type="button" id="scanAdd" onClick={() => setShowScanDialog(true)}>Scan to Add</button>
            </div>
          </form>
          {showScanDialog && (
            <ScanDialog
              onConfirm={() => {
                fetchItems(); // refresh item list
                setShowScanDialog(false); 
              }}
              onCancel={() => setShowScanDialog(false)}
            />
          )}
        </section>
        <div className="adminOptions">
        <h3>Options</h3>
        <hr />
        <div id="extraOptions">
          <button type="submit" className="extraOptionButton" id="manualAdd">Analytics</button>
          <button type="submit" className="extraOptionButton" id="manualAdd">logout</button>
        </div>
        </div>
        
        {showConfirm && (
          <ConfirmDialog
            item={itemToDelete}
            message="Are you sure you want to delete this item?"
            onConfirm={(quantity) => confirmDelete(quantity)}         // Pass selected quantity
            onCancel={() => {
              setShowConfirm(false);
              setItemToDelete(null);
            }}
          />
        )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
