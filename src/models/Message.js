const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    enum: ["inbound", "outbound"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
