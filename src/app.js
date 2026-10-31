// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/database");
const webhookRoutes = require("./routes/webhook"); // <-- YENİ: Webhook route-u çağırdıq

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

// YENİ: Bütün '/api/webhook' sorğularını o fayla yönləndiririk
app.use("/api/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Kael sistemi aktivdir." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-cu portda ayağa qalxdı...`);
});
