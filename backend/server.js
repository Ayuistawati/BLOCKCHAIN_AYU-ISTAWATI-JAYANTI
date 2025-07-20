const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Routes
const certificateRoutes = require('./routes/certificateRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/certificate', certificateRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('✅ API Blockchain SKP is running (MongoDB not used)');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
