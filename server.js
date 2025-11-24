const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
dotenv.config();

const app = express();

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

app.use(cors({ origin: "*"  }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => res.send("QuickBite Backend is Running!"));

const server = http.createServer(app);

const { initWebSocket } = require("./webSocket");
initWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);