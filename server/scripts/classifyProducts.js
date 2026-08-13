import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Product from "../models/Product.js";

// =====================================================
// NORMALIZE TEXT
// =====================================================

const normalize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[_]+/g, " ")
    .replace(/[-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// =====================================================
// EXTRACT YEAR
// =====================================================

const getYear = (text = "") => {
  const match = String(text).match(/\b(19|20)\d{2}\b/);

  if (!match) {
    return null;
  }

  return Number(match[0]);
};

// =====================================================
// GET COUNTRY
// =====================================================

const getCountry = (sourceFolder = "") => {
  const text = normalize(sourceFolder);

  const countries = [
    "united states",
    "russian federation",
    "great britain",
    "united kingdom",
    "japan",
    "germany",
    "canada",
    "netherlands",
    "belgium",
    "switzerland",
    "slovenia",
    "spain",
    "peru",
    "australia",
    "france",
    "italy",
    "mexico",
    "brazil",
    "poland",
    "south korea",
    "china",
    "india",
  ];

  for (const country of countries) {
    if (text.includes(country)) {
      return country;
    }
  }

  return "";
};

// =====================================================
// COLLECTION KEYWORDS
// =====================================================

const COLLECTION_KEYWORDS = [
  // Gaming
  "call of duty",
  "assassin's creed",
  "assassins creed",
  "halo",

  // Motorsport / athletes
  "valentino rossi",
  "ken block",
  "lewis hamilton",

  // Other collaborations / special editions
  "special edition",
  "special collection",
  "limited edition",
  "limited collection",
  "collector edition",
  "collector's edition",
  "collectors edition",
  "collector",
  "collaboration",
  "collab",
  "anniversary edition",
  "championship edition",
  "world champion",
];

// =====================================================
// RARE KEYWORDS
// =====================================================

const RARE_KEYWORDS = [
  "rare",
  "vintage",
  "discontinued",
  "retired",
  "old edition",
  "classic edition",
];

// =====================================================
// CLASSIFY PRODUCT
// =====================================================

const classifyProduct = (product) => {
  const name = normalize(product.name);
  const source = normalize(product.sourceFolder);
  const description = normalize(product.description);

  const combined = `${name} ${source} ${description}`;

  // ===================================================
  // 1. COLLECTIONS
  // ===================================================
  //
  // Collections are checked FIRST.
  // This prevents collaboration products from
  // accidentally becoming Imported or Rare.
  // ===================================================

  const isCollection = COLLECTION_KEYWORDS.some(
    (keyword) => combined.includes(keyword)
  );

  if (isCollection) {
    return "Collections";
  }

  // ===================================================
  // 2. RARE KEYWORDS
  // ===================================================

  const isRareKeyword = RARE_KEYWORDS.some(
    (keyword) => combined.includes(keyword)
  );

  if (isRareKeyword) {
    return "Rare";
  }

  // ===================================================
  // 3. VERY OLD PRODUCTS
  // ===================================================
  //
  // We are intentionally using a stricter year.
  // Products from 2011-2015 are NOT automatically Rare.
  // ===================================================

  const year = getYear(product.sourceFolder);

  if (year && year <= 2010) {
    return "Rare";
  }

  // ===================================================
  // 4. PICTURE / NUS
  // ===================================================
  //
  // These are source/archive indicators and are useful
  // for identifying collector/rare products.
  // ===================================================

  if (
    source.includes("picture") ||
    source.includes("nus")
  ) {
    return "Rare";
  }

  // ===================================================
  // 5. IMPORTED
  // ===================================================

  const country = getCountry(product.sourceFolder);

  const commonCountries = [
    "united states",
    "usa",
  ];

  if (
    country &&
    !commonCountries.includes(country)
  ) {
    return "Imported";
  }

  // ===================================================
  // 6. DEFAULT
  // ===================================================

  return "Regulars";
};

// =====================================================
// MAIN
// =====================================================

const run = async () => {
  try {
    console.log("");
    console.log("==========================================");
    console.log("   PRODUCT COLLECTION CLASSIFICATION");
    console.log("==========================================");
    console.log("");

    // -------------------------------------------------
    // CONNECT DATABASE
    // -------------------------------------------------

    await connectDB();

    // -------------------------------------------------
    // GET ALL PRODUCTS
    // -------------------------------------------------

    const products = await Product.find({});

    console.log(
      `📦 Total products found: ${products.length}`
    );

    console.log("");

    // -------------------------------------------------
    // COUNTERS
    // -------------------------------------------------

    const counts = {
      Regulars: 0,
      Imported: 0,
      Rare: 0,
      Collections: 0,
    };

    // -------------------------------------------------
    // CLASSIFY PRODUCTS
    // -------------------------------------------------

    for (const product of products) {
      const collectionType =
        classifyProduct(product);

      // Only update collectionType.
      product.collectionType =
        collectionType;

      await product.save();

      counts[collectionType]++;

      console.log(
        `${collectionType.padEnd(12)} | ${product.name}`
      );
    }

    // -------------------------------------------------
    // FINAL RESULTS
    // -------------------------------------------------

    console.log("");

    console.log("==========================================");
    console.log("   CLASSIFICATION COMPLETE");
    console.log("==========================================");

    console.log(
      `Regulars     : ${counts.Regulars}`
    );

    console.log(
      `Imported     : ${counts.Imported}`
    );

    console.log(
      `Rare         : ${counts.Rare}`
    );

    console.log(
      `Collections  : ${counts.Collections}`
    );

    console.log(
      `TOTAL        : ${products.length}`
    );

    console.log("==========================================");
    console.log("");

    process.exit(0);

  } catch (error) {
    console.error("");
    console.error(
      "❌ CLASSIFICATION ERROR"
    );
    console.error(error);
    console.error("");

    process.exit(1);
  }
};

run();