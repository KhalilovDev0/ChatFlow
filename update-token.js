require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const Tenant = require("./src/models/Tenant");

const ACCESS_TOKEN = "PASTE_INSTAGRAM_ACCESS_TOKEN_HERE";

const updateToken = async () => {
  try {
    await connectDB();

    const tenant = await Tenant.findOne({
      instagramId: "17841429199657310",
    });

    if (!tenant) {
      console.error("Tenant not found.");
      process.exitCode = 1;
      return;
    }

    tenant.accessToken = ACCESS_TOKEN;
    await tenant.save();

    console.log("Tenant access token updated successfully.");
  } catch (error) {
    console.error(`Failed to update tenant access token: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

updateToken();
