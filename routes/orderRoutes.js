// backend/routes/orderRoutes.js
const express = require("express");
const prisma = require("../prisma/client"); // Prisma client
const router = express.Router();

// POST /orders/confirm → Confirm and create a new order
router.post("/confirm", async (req, res) => {
  try {
    const { userId, restaurantId, items, deliveryInfo, paymentMethod, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided for order." });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        total: Number(total || 0),
        paymentMethod,
        deliveryName: deliveryInfo.name,
        deliveryPhone: deliveryInfo.phone,
        deliveryAddress: deliveryInfo.address,
        status: "Pending", // initial status
      },
    });

    // Create order items
    const orderItemsData = items.map((it) => ({
      orderId: order.id,
      menuItemId: it.menuItemId,
      quantity: Number(it.quantity || 1),
      price: Number(it.price || 0),
    }));

    await prisma.orderItem.createMany({ data: orderItemsData });

    res.status(201).json({ message: "Order confirmed!", orderId: order.id });
  } catch (err) {
    console.error("confirmOrder error:", err);
    res.status(500).json({ error: "Failed to confirm order." });
  }
});

// GET /orders/:id → Fetch order by ID (including current status)
router.get("/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        restaurantId: true,
        total: true,
        paymentMethod: true,
        deliveryName: true,
        deliveryPhone: true,
        deliveryAddress: true,
        status: true, // current order status
        items: true,  // optional, include items
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    console.error("fetchOrder error:", err);
    res.status(500).json({ error: "Failed to fetch order." });
  }
});

module.exports = router;
