const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// In-memory storage for submitted data
const items = [];

console.log(items);


// Route for submitting data
app.post('/api/items', upload.single('photo'), (req, res) => {
  const { name, description, price, materials } = req.body;
  const photoUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

  const newItem = {
      name,
      description,
      price,
      materials,
      photoUrl
  };

  items.push(newItem);
  res.status(201).json(newItem);
});


// Route for fetching items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
