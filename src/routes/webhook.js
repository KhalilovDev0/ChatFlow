// src/routes/webhook.js
const express = require("express");
const router = express.Router();

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
router.post("/", (req, res) => {
  const body = req.body;

  // Şablon olaraq ekrana yazdırırıq ki, gələn datanı görək
  console.log("📩 YENİ MESAJ GƏLDİ:\n", JSON.stringify(body, null, 2));

  // DİQQƏT: Meta-ya hər zaman 200 OK cavabı qayıtmalıdır.
  // Yoxsa Meta elə biləcək ki, mesaj gəlib çatmadı və eyni mesajı dayanmadan təkrar-təkrar göndərəcək.
  res.status(200).send("EVENT_RECEIVED");
});

module.exports = router;
