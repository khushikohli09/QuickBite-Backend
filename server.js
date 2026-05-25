const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", process.env.FRONTEND_URL],
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ---------------- ROUTES ----------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/membership", require("./routes/membershipRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));

// ✅ CHATBOT + RECOMMENDATION ROUTES
app.use("/api/chat", require("./routes/chatbotRoutes"));
app.use("/api/recommend", require("./routes/foodRoutes"));

// ---------------- HEALTH ----------------
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// ---------------- SERVER ----------------
const server = http.createServer(app);

const { initWebSocket } = require("./webSocket");
initWebSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
