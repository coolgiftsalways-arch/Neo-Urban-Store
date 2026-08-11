import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/Product.js";

/*
===========================================================
FIX ONLY VERIFIED FRONT IMAGES
===========================================================

This script changes ONLY products containing the
verified image filenames listed in VERIFIED_FIXES.

IMPORTANT:
- Does NOT guess images
- Does NOT scan for random front images
- Does NOT use frontimageMap.json
- Does NOT change product.images
- Does NOT change CSS
- Does NOT rename image files
- Does NOT modify other product fields
- ONLY changes product.image
- Uses exact verified image filenames
===========================================================
*/


// =========================================================
// VERIFIED FRONT IMAGE FIXES
// =========================================================

const VERIFIED_FIXES = [

  // =======================================================
  // 1. SLASH
  // =======================================================

  {
    imageName: "30262-2L.jpg",
    label: "Monster SLASH R&FN'R! FREE",
  },


  // =======================================================
  // 2. AUSTRIA 201
  // =======================================================

  {
    imageName: "100228L.jpg",
    label: "Monster Austria 201",
  },


  // =======================================================
  // 3. COLOMBIA 2017
  // =======================================================

  {
    imageName: "82039L.jpg",
    label: "Monster Colombia 2017",
  },


  // =======================================================
  // 4. BRAZIL 2017
  // =======================================================

  {
    imageName: "81440L.jpg",
    label: "Monster Brazil 2017",
  },


  // =======================================================
  // 5. HUNGARY 2016 HUG 1
  // =======================================================

  {
    imageName: "73440L.jpg",
    label: "Monster Hungary 2016 HUG 1",
  },


  // =======================================================
  // 6. HUNGARY 2015
  // =======================================================

  {
    imageName: "68455L.jpg",
    label: "Monster Hungary 2015",
  },


  // =======================================================
  // 7. GREAT BRITAIN 2017
  // =======================================================

  {
    imageName: "80492L.jpg",
    label: "Monster Great Britain 2017",
  },


  // =======================================================
  // 8. LO-CARB
  // =======================================================

  {
    imageName: "48013L.jpg",
    label: "Monster LO-CARB",
  },


  // =======================================================
  // 9. JAVA MONSTER
  // =======================================================

  {
    imageName: "36109L.jpg",
    label: "Monster Energy Coffee Drink",
  },


  // =======================================================
  // 10. HALO INFINITE
  // =======================================================

  {
    imageName: "109558-1L.jpg",
    label: "Monster Ultra Halo Infinite",
  },


  // =======================================================
  // 11. BEAST UNLEASHED WHITE
  // =======================================================

  {
    imageName: "141853L.jpg",
    label: "Monster The Beast Unleashed White",
  },


  // =======================================================
  // 12. BEAST UNLEASHED PEACH
  // =======================================================

  {
    imageName: "141852L.jpg",
    label: "Monster The Beast Unleashed Peach",
  },


  // =======================================================
  // 13. ALCOHOL COCKTAIL 72993
  // =======================================================

  {
    imageName: "72993L.jpg",
    label: "Monster Alcohol Cocktail 72993",
  },


  // =======================================================
  // 14. ALCOHOL COCKTAIL 72992
  // =======================================================

  {
    imageName: "72992L.jpg",
    label: "Monster Alcohol Cocktail 72992",
  },


  // =======================================================
  // 15. ALCOHOL COCKTAIL 72994
  // =======================================================

  {
    imageName: "72994L.jpg",
    label: "Monster Alcohol Cocktail 72994",
  },


  // =======================================================
  // 16. KHAOS
  // =======================================================

  {
    imageName: "73830L.jpg",
    label: "Monster KHAOS",
  },


  // =======================================================
  // 17. JUICED RIPPER
  // =======================================================

  {
    imageName: "83429L.jpg",
    label: "Monster Juiced Ripper",
  },


  // =======================================================
  // 18. RIPPER
  // =======================================================

  {
    imageName: "35023L.jpg",
    label: "Monster Ripper",
  },


  // =======================================================
  // 19. ULTRA SUNRISE - GREAT BRITAIN
  // =======================================================

  {
    imageName: "74211L.jpg",
    label: "Monster Ultra Sunrise Great Britain 2017",
  },


  // =======================================================
  // 20. FRANCE 2016
  // =======================================================

  {
    imageName: "78392L.jpg",
    label: "Monster Fruit Diet France 2016",
  },

];


// =========================================================
// NORMALIZE PATH
// =========================================================

const normalize = (value) => {

  if (!value) {
    return "";
  }

  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\\/g, "/");

};


// =========================================================
// GET FILE NAME
// =========================================================

const getFileName = (value) => {

  const normalized = normalize(value);

  if (!normalized) {
    return "";
  }

  const parts = normalized.split("/");

  return parts[parts.length - 1];

};


// =========================================================
// CHECK VERIFIED IMAGE
// =========================================================

const isVerifiedImage = (
  image,
  imageName
) => {

  const currentFileName =
    getFileName(image);

  const wantedFileName =
    getFileName(imageName);

  return (
    currentFileName ===
    wantedFileName
  );

};


// =========================================================
// FIND PRODUCT BY VERIFIED IMAGE
// =========================================================

const findProductByImage = async (
  imageName
) => {

  const products =
    await Product.find({
      images: {
        $exists: true,
        $ne: [],
      },
    });

  for (const product of products) {

    if (
      !Array.isArray(
        product.images
      )
    ) {
      continue;
    }

    const matchingImage =
      product.images.find(
        (image) =>
          isVerifiedImage(
            image,
            imageName
          )
      );

    if (matchingImage) {

      return {
        product,
        matchingImage,
      };

    }

  }

  return null;

};


// =========================================================
// MAIN
// =========================================================

const fixSlash = async () => {

  let connected = false;

  try {

    // =====================================================
    // CONNECT DATABASE
    // =====================================================

    await mongoose.connect(
      process.env.MONGO_URI
    );

    connected = true;

    console.log(
      "\nMongoDB Connected ✅"
    );


    // =====================================================
    // HEADER
    // =====================================================

    console.log(
      "\n=============================================="
    );

    console.log(
      "       VERIFIED FRONT IMAGE FIXER"
    );

    console.log(
      "=============================================="
    );

    console.log(
      `Verified images: ${VERIFIED_FIXES.length}`
    );


    // =====================================================
    // COUNTERS
    // =====================================================

    let updated = 0;

    let alreadyCorrect = 0;

    let productMissing = 0;

    let imageMissing = 0;

    let errors = 0;


    // =====================================================
    // PROCESS VERIFIED IMAGES
    // =====================================================

    for (
      const fix of VERIFIED_FIXES
    ) {

      console.log(
        "\n----------------------------------------------"
      );

      console.log(
        `Checking: ${fix.label}`
      );

      console.log(
        `Verified image: ${fix.imageName}`
      );


      try {

        // =================================================
        // FIND PRODUCT
        // =================================================

        const result =
          await findProductByImage(
            fix.imageName
          );


        // =================================================
        // PRODUCT NOT FOUND
        // =================================================

        if (!result) {

          console.log(
            "❌ Product containing this image was not found"
          );

          productMissing++;

          continue;

        }


        // =================================================
        // PRODUCT FOUND
        // =================================================

        const {
          product,
          matchingImage,
        } = result;


        console.log(
          `✅ Product found: ${product.name}`
        );

        console.log(
          `ID: ${product.id}`
        );

        console.log(
          `Current image: ${product.image}`
        );

        console.log(
          `Verified image: ${matchingImage}`
        );


        // =================================================
        // ALREADY CORRECT
        // =================================================

        if (
          normalize(
            product.image
          ) ===
          normalize(
            matchingImage
          )
        ) {

          console.log(
            "✅ Already using the correct front image"
          );

          alreadyCorrect++;

          continue;

        }


        // =================================================
        // SAVE OLD IMAGE
        // =================================================

        const oldImage =
          product.image;


        // =================================================
        // CHANGE ONLY product.image
        // =================================================

        product.image =
          matchingImage;


        // =================================================
        // SAVE
        // =================================================

        await product.save();


        // =================================================
        // SUCCESS
        // =================================================

        console.log(
          "\n✅ FRONT IMAGE UPDATED"
        );

        console.log(
          `OLD: ${oldImage}`
        );

        console.log(
          `NEW: ${product.image}`
        );


        updated++;

      } catch (error) {

        console.error(
          `\n❌ Error processing ${fix.label}`
        );

        console.error(
          error.message
        );

        errors++;

      }

    }


    // =====================================================
    // FINAL REPORT
    // =====================================================

    console.log(
      "\n\n=============================================="
    );

    console.log(
      "              FIX COMPLETE"
    );

    console.log(
      "=============================================="
    );

    console.log(
      `Verified images:  ${VERIFIED_FIXES.length}`
    );

    console.log(
      `Updated:           ${updated}`
    );

    console.log(
      `Already correct:   ${alreadyCorrect}`
    );

    console.log(
      `Product missing:   ${productMissing}`
    );

    console.log(
      `Image missing:     ${imageMissing}`
    );

    console.log(
      `Errors:            ${errors}`
    );

    console.log(
      "=============================================="
    );


    console.log(
      "\n⚠️ ONLY VERIFIED FRONT IMAGES WERE PROCESSED."
    );

    console.log(
      "⚠️ ONLY product.image WAS CHANGED."
    );

    console.log(
      "⚠️ product.images WAS NOT CHANGED."
    );

    console.log(
      "⚠️ NO CSS OR FRONTEND FILES WERE CHANGED."
    );

    console.log(
      "==============================================\n"
    );


  } catch (error) {

    // ===================================================
    // DATABASE / SCRIPT ERROR
    // ===================================================

    console.error(
      "\n❌ FIX FAILED:"
    );

    console.error(
      error
    );

  } finally {

    // ===================================================
    // CLOSE DATABASE
    // ===================================================

    if (connected) {

      await mongoose.connection.close();

      console.log(
        "Database connection closed."
      );

    }

  }

};


// =========================================================
// RUN
// =========================================================

fixSlash();