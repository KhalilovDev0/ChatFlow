// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopName: { type: String, required: true },

    // Abunəlik məntiqi
    plan: {
      type: String,
      enum: ["free_trial", "basic", "duo", "premium"], // Sənin təyin etdiyin paketlər
      default: "free_trial",
    },

    // "Usage-based" sınaq məntiqi üçün sayğac
    messageCount: { type: Number, default: 0 }, // 50-yə çatanda free_trial dayanacaq

    // Meta (Facebook) tərəfindən veriləcək açarlar bura yazılacaq
    metaData: {
      whatsappPhoneId: { type: String, default: null },
      instagramAccountId: { type: String, default: null },
      accessToken: { type: String, default: null },
    },
  },
  { timestamps: true },
); // Nə vaxt yaradıldığını (createdAt) avtomatik qeyd edir

module.exports = mongoose.model("User", userSchema);
