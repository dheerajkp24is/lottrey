const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add path
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// Smart CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://lottrey.vercel.app',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace(/\/$/, '')] : [])
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);

      // Clean trailing slash from incoming origin
      const cleanOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        return callback(null, true); // Fallback allow
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded image files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/draws', require('./routes/drawRoutes'));
app.use('/api/winners', require('./routes/winnerRoutes'));
app.use('/api/check', require('./routes/resultRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/buyers', require('./routes/buyerRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});