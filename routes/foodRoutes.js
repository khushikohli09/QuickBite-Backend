const express = require("express");
const router = express.Router();

const { foodRecommendation } = require("../controllers/chatbotController");

router.post("/recommend", foodRecommendation);

module.exports = router;
