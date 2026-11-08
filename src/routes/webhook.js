// src/routes/webhook.js
const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const Message = require("../models/Message");
const AutoReply = require("../models/AutoReply");
const { sendInstagramMessage } = require("../utils/instagram");

// 1. Meta'nın qapını döyməsi və bizim serveri təsdiqləməsi (GET)
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

  // Meta bizə URL üzərindən bu 3 parametri göndərir
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Meta Webhook Uğurla Təsdiqləndi!");
      // Meta bizdən məhz bu 'challenge' kodunu geri qaytarmağımızı gözləyir
      res.status(200).send(challenge);
    } else {
      console.log("❌ Webhook Təsdiq Xətası: Tokenlər uyğun gəlmir!");
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// 2. İstifadəçilərdən gələn real mesajların tutulması (POST)
router.post("/", async (req, res) => {
  const body = req.body;

  if (body.object !== "instagram") {
    return res.sendStatus(404);
  }

  // DİQQƏT: Meta-ya hər zaman dərhal 200 OK cavabı qayıtmalıdır ki, timeout döngəsinə düşməsin.
  res.status(200).send("EVENT_RECEIVED");

  try {
    if (!Array.isArray(body.entry)) return;

    for (const entry of body.entry) {
      if (!Array.isArray(entry.messaging)) continue;

      for (const webhookEvent of entry.messaging) {
        const senderId = webhookEvent.sender?.id;
        const recipientId = webhookEvent.recipient?.id;
        const messageText = webhookEvent.message?.text;

        if (!senderId || !recipientId || !messageText) continue;

        const tenant = await Tenant.findOne({ instagramId: recipientId });

        if (tenant) {
          const message = new Message({
            tenantId: tenant._id,
            senderId,
            text: messageText,
            direction: "inbound",
          });
          await message.save();

          console.log("Message saved to the database.", {
            tenantId: tenant._id,
            senderId,
          });

          console.log(`Message received for store: ${tenant.storeName}`, {
            senderId,
            messageText,
          });

          const normalizedMessageText = messageText.toLowerCase();
          const rules = await AutoReply.find({
            tenantId: tenant._id,
            isActive: true,
          });

          let replySent = false;

          for (const rule of rules) {
            if (normalizedMessageText.includes(rule.keyword.toLowerCase())) {
              await sendInstagramMessage(
                tenant.instagramId,
                senderId,
                rule.replyText,
                tenant.accessToken,
              );

              const outboundMessage = new Message({
                tenantId: tenant._id,
                senderId,
                text: rule.replyText,
                direction: "outbound",
              });
              await outboundMessage.save();

              console.log("Outbound message saved to the database.", {
                tenantId: tenant._id,
                senderId,
              });
              replySent = true;
              break;
            }
          }

          if (!replySent) {
            console.log("No keyword matched. Operator will handle.");
          }
        } else {
          console.log(`Tenant not found for ID: ${recipientId}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error processing Instagram webhook:", error);
  }
});

module.exports = router;
