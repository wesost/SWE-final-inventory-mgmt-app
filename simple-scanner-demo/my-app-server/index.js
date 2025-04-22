
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); 

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


// TODO: this data is locally stored and is lost on reset and 
// was used for test storage when getting info from api
// we want our data stored in database
 let data = [
   { id: 1, name: 'amazing item 1' },
   { id: 2, name: 'not amazing item 2' },
];
let nextId = 3; // keep track of next available id

// Route to get LOCALLY stored items - TODO: do away with this
 app.get('/api/items', (req, res) => {
   res.json(data);
 });


app.post('/api/items', (req, res) => {
    const newItem = {
        id: nextId++,
        type: 'manual', // means added manually
        name: req.body.name || 'unnamed item',
    };

    data.push(newItem);
    console.log('manually added item:', newItem);
    res.status(201).json(newItem);
});

// upc lookup route - calls api 
// takes the upc to lookup via req and returns json data about the item via res
app.post('/api/upc-lookup', async (req, res) => {
  const { upc } = req.body;

  if (!upc) {
    return res.status(400).json({error: "UPC code is required"});
    }

  try {
    console.log(`Backend recieved lookup request for upc: ${upc}`);
    const response = await axios.post(
      'https://api.upcitemdb.com/prod/trial/lookup',
      { upc }, // sends upc
      {
        headers: {
        "Content-Type": "application/json",
        }
      }
    );

    console.log('API response status:', response.status);
    // console.log('API response data:', response.data); // if want to log full response

    //check if api call successful and found an item
    if (response.data && response.data.items && response.data.items.length > 0) {
    const foundItemData = response.data.items[0]; // gets item details

    // store data LOCALLY
    // TODO: again, need to store to our db, not locally, maybe don't need this at all
    const newItemToStore = { 
      id: nextId++,
      type: 'scanned',
      upc: foundItemData.upc || foundItemData.ean || upc,
      title: foundItemData.title || 'no title',
      category: foundItemData.category || 'uncategorized'
      };

    storedItems.push(newItemToStore);
    console.log('stored scanned item:', newItemToStore.id, newItemToStore.title);

    res.json(newItemToStore);
    } else {
      // api call succeded but api didn't find item
      console.log(`no item found for upc: ${upc} by API`);
      res.status(404).json({message: "no product found for provided upc by api!"}); // 404 = not found
    }


  
  } catch (error) {
    console.error("Error fetching UPC data from api", error.response ? error.response.data : error.message);

   
  }
  
  });

 app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
   console.log('storing items in memory, data is lost on restart for now'); // again, set up with db
 });
