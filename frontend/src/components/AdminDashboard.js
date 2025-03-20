import React from "react";
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h3>Food Inventory</h3>
        <ul>
          {['Dashboard', 'Manage Inventory', 'Reports', 'Settings'].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>

      <main className="admin-content">
        <h2>Food Inventory Dashboard</h2>
        <section className="stats">
          {['Total Items: 10', 'Expiring Soon: 2', 'Out of Stock: 1'].map((stat, idx) => (
            <div key={idx} className="stat-box">{stat}</div>
          ))}
        </section>

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
            <tr>
              <td>Noodles</td>
              <td>Test</td>
              <td>2</td>
              <td>1.5</td>
              <td>2025-03-15</td>
              <td><button>Remove</button></td>
            </tr>
          </tbody>
        </table>

        <section className="add-item">
          <h3>Add New Item</h3>
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
            <button type="submit">Add Item</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
