// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(bodyParser.json());



// let data = [
//   { id: 1, name: 'amazing item 1' },
//   { id: 2, name: 'not amazing item 2' },
// ];

// app.get('/api/items', (req, res) => {
//   res.json(data);
// });

// app.post('/api/items', (req, res) => {
//     const newItem = {
//         id: data.length + 1,
//         name: req.body.name,
//     };
//     data.push(newItem);
//     res.json(newItem);
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });




const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Use axios for making API requests

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let data = [
  { id: 1, name: 'amazing item 1' },
  { id: 2, name: 'not amazing item 2' },
];

// Route to get locally stored items
app.get('/api/items', (req, res) => {
  res.json(data);
});

// Route to add new items to local storage
app.post('/api/items', (req, res) => {
  const newItem = {
    id: data.length + 1,
    name: req.body.name,
  };
  data.push(newItem);
  res.json(newItem);
});

// New route: UPC Lookup (calls the upcitemdb API)
app.post('/api/upc-lookup', async (req, res) => {
  const { upc } = req.body;

  if (!upc) {
    return res.status(400).json({ error: "UPC code is required" });
  }

  try {
    const response = await axios.post(
      'https://api.upcitemdb.com/prod/trial/lookup',
      { upc }, // Send UPC in request body
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching UPC data:", error);
    res.status(500).json({ error: "Failed to retrieve product information" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
