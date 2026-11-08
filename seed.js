require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const Tenant = require("./src/models/Tenant");

const seedTenant = async () => {
  try {
    await connectDB();

    const tenant = new Tenant({
      storeName: "appleex.g Test Store",
      instagramId: "17841429199657310",
    });
    await tenant.save();

    console.log("Tenant seeded successfully.");
  } catch (error) {
    console.error(`Failed to seed tenant: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedTenant();
