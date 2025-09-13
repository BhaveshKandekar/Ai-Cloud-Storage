const express = require("express");
const cors = require("cors");
const path = require("path");

const fileRoutes = require("./routes/fileRoutes");

const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = 5000;
app.use(express.json());

app.use(cors());

// ✅ MinIO file routes
app.use("/api", fileRoutes);

// Add a simple test route to verify the server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});


