import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initializeDatabase from './initDb.js';
import deviceRoutes from './routes/devices.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
await initializeDatabase();

// Routes
app.use('/api', deviceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` API health check: http://localhost:${PORT}/api/health`);
  console.log(`Get all devices: http://localhost:${PORT}/api/devices`);
});
