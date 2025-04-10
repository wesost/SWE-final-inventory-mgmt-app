

///////
import React, { useState } from 'react';
import './App.css';

function App() {
  const [upc, setUpc] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset errors
  
    try {
      const response = await fetch('http://localhost:5000/api/upc-lookup', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upc }),
      });
  
      const data = await response.json();
      
      
      if (data.items && data.items.length > 0) {
        setProduct(data.items[0]); // Store first product in state
        
        // FUNCTION HERE TO FILTER OUT UNWANTED DATA, RETURN SHORTENED JSON?

        // print statement to see what we're working with here
        console.log(data);

        // FUNCTION HERE TO SEND DATA TO DATABASE
      } else {
        setProduct(null);
        setError("No product found for this UPC.");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product information.");
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>UPC Lookup</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={upc}
            onChange={(e) => setUpc(e.target.value)}
            placeholder="Enter UPC Code"
          />
          <button type="submit">Lookup Product</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {product && (
          <div>
            <h2>Product Information</h2>
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt={product.title} width="200" />
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

