const express = require("express");

const router = express.Router();

const {
  getVendorDashboard,
  getVendorAnalytics,
  getVendorOrders,
  addRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require(
  "../controllers/vendorController"
);

// ------------------------------------
// DASHBOARD
// ------------------------------------

router.get(
  "/dashboard",
  getVendorDashboard
);

// ------------------------------------
// ORDERS
// ------------------------------------

router.get(
  "/orders",
  getVendorOrders
);

// ------------------------------------
// ANALYTICS
// ------------------------------------

router.get(
  "/analytics",
  getVendorAnalytics
);

// ------------------------------------
// RESTAURANT
// ------------------------------------

router.post(
  "/restaurant",
  addRestaurant
);

// ------------------------------------
// MENU
// ------------------------------------

router.post(
  "/menu",
  addMenuItem
);

router.put(
  "/menu/:id",
  updateMenuItem
);

router.delete(
  "/menu/:id",
  deleteMenuItem
);

module.exports = router;
