import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

const changePassword = async () => {
  try {
    await connectDB();

    const email = "admin@neourbanstore.com";

    // 👇 CHANGE THIS
    const newPassword = "Neo@8800";

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("❌ Admin not found.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    console.log("✅ Admin password changed successfully!");
    console.log("Email:", email);
    console.log("New password:", newPassword);

    process.exit(0);

  } catch (error) {
    console.error(
      "❌ Failed to change password:",
      error
    );

    process.exit(1);
  }
};

changePassword();