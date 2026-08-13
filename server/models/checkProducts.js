import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Product from "./Product.js";

const run = async () => {
  try {
    console.log("====================================");
    console.log("CHECKING PRODUCTS");
    console.log("====================================");

    await connectDB();

    const products = await Product.find({})
      .select("name category sourceFolder")
      .limit(30)
      .lean();

    console.log(
      JSON.stringify(products, null, 2)
    );

    console.log("====================================");
    console.log(
      `Products displayed: ${products.length}`
    );
    console.log("====================================");

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ ERROR:",
      error
    );

    process.exit(1);
  }
};

run();