// src/models/Tenant.js
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  instagramId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tenant", tenantSchema);
