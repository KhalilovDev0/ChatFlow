const mongoose = require("mongoose");

const autoReplySchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  replyText: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("AutoReply", autoReplySchema);
