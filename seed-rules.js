require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const Tenant = require("./src/models/Tenant");
const AutoReply = require("./src/models/AutoReply");

const seedRules = async () => {
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

    await AutoReply.insertMany([
      {
        tenantId: tenant._id,
        keyword: "qiymət",
        replyText:
          "Salam! Məhsullarımızın qiyməti 50 AZN-dir. Sifariş vermək istərdiniz?",
      },
      {
        tenantId: tenant._id,
        keyword: "salam",
        replyText:
          "Salam! ChatFlow mağazasına xoş gəldiniz. Sizə necə kömək edə bilərəm?",
      },
    ]);

    console.log("AutoReply rules seeded successfully.");
  } catch (error) {
    console.error(`Failed to seed AutoReply rules: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedRules();
