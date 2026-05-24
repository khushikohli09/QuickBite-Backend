const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const app = express();

// 🔥 PRODUCTION CORS CONFIGURATION

const allowedOrigins =
  process.env.NODE_ENV ===
  "production"
    ? [
        process.env.FRONTEND_URL,
        "https://quickbitefrontend-3pdr.onrender.com",
      ].filter(Boolean)
    : ["http://localhost:3000"];

console.log(
  "🔧 Allowed origins:",
  allowedOrigins
);

app.use(
  cors({
    origin: function (
      origin,
      callback
    ) {
      if (!origin)
        return callback(null, true);

      if (
        allowedOrigins.indexOf(
          origin
        ) !== -1 ||
        process.env.NODE_ENV !==
          "production"
      ) {
        callback(null, true);
      } else {
        console.log(
          "❌ Blocked origin:",
          origin
        );

        callback(
          new Error(
            "CORS not allowed"
          )
        );
      }
    },

    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

// -----------------------------------
// HEALTH CHECK
// -----------------------------------

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
  });
});

// -----------------------------------
// ROUTES
// -----------------------------------

// Auth Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// User Routes
app.use(
  "/api/users",
  require("./routes/userRoutes")
);

// Restaurant Routes
app.use(
  "/api/restaurants",
  require("./routes/restaurantRoutes")
);

// Order Routes
app.use(
  "/api/orders",
  require("./routes/orderRoutes")
);

// Vendor Routes
app.use(
  "/api/vendor",
  require("./routes/vendorRoutes")
);

// Admin Routes
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// Membership Routes
app.use(
  "/api/membership",
  require("./routes/membershipRoutes")
);

// Coupon Routes
app.use(
  "/api/coupons",
  require("./routes/couponRoutes")
);

// -----------------------------------
// CHATBOT ROUTES
// -----------------------------------

const chatbotRouter =
  express.Router();

const {
  foodRecommendation,
} = require(
  "./controllers/chatbotController"
);

chatbotRouter.post(
  "/recommend",
  foodRecommendation
);

app.use(
  "/api/chat",
  chatbotRouter
);

// ✅ OR if you already have chatbotRoutes file,
// then use ONLY this instead:
//
// app.use(
//   "/api/chat",
//   require("./routes/chatbotRoutes")
// );

// -----------------------------------
// PAYMENT ROUTES
// -----------------------------------

app.use(
  "/api/payment",
  require("./routes/paymentRoutes")
);

// -----------------------------------
// ROOT ROUTE
// -----------------------------------

app.get("/", (req, res) => {
  res.send(
    "QuickBite Backend is Running!"
  );
});

// -----------------------------------
// SOCKET SERVER
// -----------------------------------

const server =
  http.createServer(app);

const { initWebSocket } =
  require("./webSocket");

initWebSocket(server);

// -----------------------------------
// START SERVER
// -----------------------------------

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `✅ Server running on port ${PORT}`
  );

  console.log(
    `🌍 Environment: ${
      process.env.NODE_ENV ||
      "development"
    }`
  );
});
