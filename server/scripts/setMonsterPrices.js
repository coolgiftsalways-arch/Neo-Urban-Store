import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/Product.js";

const setPrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Product.updateMany(
      {},
      { $set: { price: 349 } }
    );

    console.log("✅ Prices updated");
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

setPrices();