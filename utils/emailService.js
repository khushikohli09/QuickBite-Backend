const nodemailer = require("nodemailer");

// -----------------------------------
// TRANSPORTER
// -----------------------------------

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

// -----------------------------------
// VERIFY CONNECTION
// -----------------------------------

transporter.verify((error, success) => {
  if (error) {
    console.log(
      "❌ Email transporter error:",
      error
    );
  } else {
    console.log(
      "✅ Email server is ready"
    );
  }
});

// -----------------------------------
// USER ORDER PLACED
// -----------------------------------

const sendOrderConfirmationEmail =
  async (order, email) => {
    try {
      console.log(
        "📧 Sending order email to:",
        email
      );

      await transporter.sendMail({
        from: `"QuickBite 🍔" <${process.env.EMAIL}>`,

        to: email,

        subject:
          "🧾 Order Placed Successfully",

        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>
              🎉 Order #${order.id} placed successfully
            </h2>

            <p>
              Thank you for ordering with QuickBite.
            </p>
          </div>
        `,
      });

      console.log(
        "✅ Order placed email sent"
      );
    } catch (err) {
      console.log(
        "❌ Order email failed:",
        err.message
      );
    }
  };

// -----------------------------------
// STATUS EMAIL
// -----------------------------------

const sendStatusUpdateEmail =
  async (order, email, type) => {
    try {
      let message = "";

      if (
        type === "Order Confirmed"
      ) {
        message =
          "✅ Your order has been confirmed and is being prepared.";
      } else if (
        type === "Preparing"
      ) {
        message =
          "🍳 Your order is being prepared.";
      } else if (
        type ===
        "Ready to Deliver"
      ) {
        message =
          "🚚 Your order is ready and out for delivery.";
      } else if (
        type === "Delivered"
      ) {
        message =
          "🎉 Your order has been delivered.";
      } else {
        message = `📦 Order status updated: ${order.status}`;
      }

      console.log(
        "📧 Sending status email:",
        type
      );

      await transporter.sendMail({
        from: `"QuickBite 🍔" <${process.env.EMAIL}>`,

        to: email,

        subject: `Order #${order.id} Update`,

        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>${message}</h2>

            <p>
              Thank you for choosing QuickBite 🚀
            </p>
          </div>
        `,
      });

      console.log(
        "✅ Status email sent:",
        type
      );
    } catch (err) {
      console.log(
        "❌ Status email failed:",
        err.message
      );
    }
  };

module.exports = {
  sendOrderConfirmationEmail,
  sendStatusUpdateEmail,
};
