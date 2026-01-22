console.log('Starting server...');
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
require('./config/redis'); // Initialize Redis

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
