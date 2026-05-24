const prisma = require("../prisma/client");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------- AI HELPER ----------------
async function getAIResponse(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// ---------------- CHATBOT ----------------
exports.chatbot = async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const userId = req.user?.id;

    const restaurants = await prisma.restaurant.findMany({
      include: { menuItems: true },
    });

    let lastOrder = null;

    if (userId) {
      lastOrder = await prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true,
        },
      });
    }

    const prompt = `
You are QuickBite AI Assistant 🍽️

Be short and helpful.

User: ${userMessage}

Restaurants: ${JSON.stringify(restaurants)}
LastOrder: ${JSON.stringify(lastOrder)}
`;

    const reply = await getAIResponse(prompt);

    return res.json({ reply });

  } catch (err) {
    console.error("CHATBOT ERROR:", err);

    return res.status(500).json({
      reply: "Something went wrong 😢",
    });
  }
};


// ---------------- FOOD RECOMMENDATION API ----------------
exports.foodRecommendation = async (req, res) => {
  try {
    const { mood, budget } = req.body;

    const restaurants = await prisma.restaurant.findMany({
      include: { menuItems: true },
    });

    // flatten items
    const items = restaurants.flatMap((r) =>
      r.menuItems.map((item) => ({
        name: item.name,
        price: Number(item.price),
        restaurant: r.name,
        image: item.image || null,
      }))
    );

    const prompt = `
You are a FOOD RECOMMENDATION AI 🍽️

RULES:
- Only use given items
- Respect budget strictly
- Match mood (spicy, sweet, light, etc.)
- Return ONLY valid JSON array
- No explanation, no markdown

USER INPUT:
Budget: ${budget}
Mood: ${mood}

FOOD ITEMS:
${JSON.stringify(items)}

OUTPUT FORMAT:
[
  {
    "name": "",
    "restaurant": "",
    "price": 0,
    "reason": ""
  }
]
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // safer cleanup
    text = text.replace(/```json|```/g, "").trim();

    let recommendations = [];

    try {
      recommendations = JSON.parse(text);
    } catch (parseErr) {
      console.error("JSON PARSE ERROR:", text);

      return res.status(200).json({
        success: false,
        message: "AI returned invalid format",
        raw: text,
      });
    }

    // normalize + attach image (better matching)
    recommendations = recommendations.map((rec) => {
      const match = items.find((i) => {
        return (
          i.name.toLowerCase().trim() === rec.name?.toLowerCase()?.trim() &&
          i.restaurant.toLowerCase().trim() === rec.restaurant?.toLowerCase()?.trim()
        );
      });

      return {
        name: rec.name,
        restaurant: rec.restaurant,
        price: rec.price,
        reason: rec.reason,
        image: match?.image || null,
      };
    });

    return res.json({
      success: true,
      recommendations,
    });

  } catch (err) {
    console.error("AI ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "AI failed",
    });
  }
};
