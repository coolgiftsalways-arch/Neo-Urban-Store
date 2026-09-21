import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to MongoDB ✅");

  const result = await mongoose.connection.db
    .collection("products")
    .updateMany(
      { price: 349 },
      { $set: { price: 299 } }
    );

  console.log("Products matched:", result.matchedCount);
  console.log("Products updated:", result.modifiedCount);

  await mongoose.disconnect();

  console.log("Done ✅");
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}