import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "../models/Product.js";

dotenv.config();


// ==========================================
// PATHS
// ==========================================

const ZIP_PATH = path.join(
  process.cwd(),
  "imports",
  "Monster All Product Data (1).zip"
);

const EXTRACT_PATH = path.join(
  process.cwd(),
  "imports",
  "monster-products"
);

const UPLOAD_PATH = path.join(
  process.cwd(),
  "uploads",
  "products"
);


// ==========================================
// CLEAN PRODUCT NAME
// ==========================================

const createProductName = (folderName) => {

  let name = folderName;

  // Remove MONSTER-
  name = name.replace(
    /^MONSTER[-\s]*/i,
    ""
  );

  // Remove "Energy drink"
  name = name.replace(
    /^Energy drink\s*/i,
    ""
  );

  // Remove size
  name = name.replace(
    /-\d+mL/gi,
    ""
  );

  // Replace separators
  name = name
    .replace(/[-_]+/g, " ")
    .replace(/:/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Remove country + year
  name = name.replace(
    /\s+(United States|Great Britain|Canada|Germany|France|Spain|Italy|Portugal|Belgium|Benelux|Norway|Switzerland|Japan|Brazil|Mexico|Hungary|Turkey|Ireland|Sweden|Slovenia|Denmark|Czech Republic|Slovak Republic|Russian Federation|Hong Kong|Colombia)\s*-?\s*\d{4}.*$/i,
    ""
  );

  // Remove leftover year
  name = name.replace(
    /\s*-\s*\d{4}.*$/i,
    ""
  );

  return `Monster ${name.trim()}`;
};


// ==========================================
// DETECT CATEGORY
// ==========================================

const getCategory = (folderName) => {

  const name = folderName.toLowerCase();


  if (
    name.includes("coffee") ||
    name.includes("espresso") ||
    name.includes("mocha")
  ) {
    return "Coffee";
  }


  if (
    name.includes("tea")
  ) {
    return "Tea";
  }


  if (
    name.includes("juice") ||
    name.includes("fruit")
  ) {
    return "Juice";
  }


  if (
    name.includes("water") ||
    name.includes("hydro")
  ) {
    return "Water";
  }


  if (
    name.includes("soft drink") ||
    name.includes("cola") ||
    name.includes("soda")
  ) {
    return "Soft Drinks";
  }


  return "Energy";
};


// ==========================================
// CREATE UNIQUE PRODUCT ID
// ==========================================

const createId = (
  folderName,
  index
) => {

  const clean =
    folderName
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .substring(0, 80);


  return `monster-${index + 1}-${clean}`;
};


// ==========================================
// CONNECT DATABASE
// ==========================================

const connectDatabase = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected ✅"
    );

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};


// ==========================================
// CLEAN OLD INDEX
// ==========================================

const cleanupOldIndexes = async () => {

  try {

    const collection =
      mongoose.connection.collection(
        "products"
      );


    const indexes =
      await collection.indexes();


    const oldIndex =
      indexes.find(
        (index) =>
          index.name === "productId_1"
      );


    if (oldIndex) {

      await collection.dropIndex(
        "productId_1"
      );

      console.log(
        "🧹 Removed old productId_1 index"
      );

    } else {

      console.log(
        "✅ No old productId_1 index found"
      );
    }

  } catch (error) {

    console.error(
      "⚠️ Index cleanup failed:",
      error.message
    );
  }
};


// ==========================================
// EXTRACT ZIP
// ==========================================

const extractZip = async (
  zipPath
) => {

  console.log(
    "\n📦 Extracting ZIP..."
  );


  const extractPath =
    EXTRACT_PATH;


  // ----------------------------------------
  // REMOVE OLD EXTRACTION
  // ----------------------------------------

  if (
    fs.existsSync(extractPath)
  ) {

    fs.rmSync(
      extractPath,
      {
        recursive: true,
        force: true
      }
    );
  }


  // ----------------------------------------
  // CREATE EXTRACTION DIRECTORY
  // ----------------------------------------

  fs.mkdirSync(
    extractPath,
    {
      recursive: true
    }
  );


  // ----------------------------------------
  // CHECK ZIP
  // ----------------------------------------

  if (
    !fs.existsSync(zipPath)
  ) {

    throw new Error(
      `ZIP file not found: ${zipPath}`
    );
  }


  // ----------------------------------------
  // ZIP SIZE
  // ----------------------------------------

  const zipSize =
    fs.statSync(zipPath).size;


  console.log(
    `📦 ZIP size: ${(
      zipSize /
      1024 /
      1024
    ).toFixed(2)} MB`
  );


  // ----------------------------------------
  // OPEN ZIP
  // ----------------------------------------

  const directory =
    await unzipper.Open.file(
      zipPath
    );


  console.log(
    `📁 ZIP contains ${directory.files.length} entries`
  );


  let extractedCount = 0;


  // ========================================
  // EXTRACT FILES
  // ========================================

  for (
    const entry of directory.files
  ) {

    // Skip directories
    if (
      entry.type === "Directory" ||
      entry.path.endsWith("/")
    ) {
      continue;
    }


    const originalPath =
      entry.path;


    // --------------------------------------
    // SPLIT ZIP PATH
    // --------------------------------------

    const parts =
      originalPath.split(
        /[\\/]/
      );


    // --------------------------------------
    // MAKE WINDOWS-SAFE NAMES
    // --------------------------------------

    const safeParts =
      parts
        .filter(Boolean)
        .map((part) => {

          return part
            .replace(
              /[<>:"/\\|?*]/g,
              "_"
            )
            .replace(
              /[\x00-\x1F]/g,
              "_"
            )
            .replace(
              /[. ]+$/g,
              ""
            )
            .trim() ||
            "unknown";

        });


    if (
      safeParts.length === 0
    ) {
      continue;
    }


    // --------------------------------------
    // OUTPUT PATH
    // --------------------------------------

    const outputPath =
      path.join(
        extractPath,
        ...safeParts
      );


    // --------------------------------------
    // SECURITY CHECK
    // --------------------------------------

    const rootPath =
      path.resolve(
        extractPath
      );


    const resolvedOutputPath =
      path.resolve(
        outputPath
      );


    if (
      !resolvedOutputPath.startsWith(
        rootPath + path.sep
      )
    ) {

      console.log(
        "⚠️ Skipping unsafe entry:",
        originalPath
      );

      continue;
    }


    // --------------------------------------
    // CREATE PARENT FOLDER
    // --------------------------------------

    fs.mkdirSync(
      path.dirname(outputPath),
      {
        recursive: true
      }
    );


    // --------------------------------------
    // WRITE FILE
    // --------------------------------------

    await new Promise(
      (resolve, reject) => {

        entry
          .stream()
          .pipe(
            fs.createWriteStream(
              outputPath
            )
          )
          .on(
            "finish",
            resolve
          )
          .on(
            "error",
            reject
          );

      }
    );


    extractedCount++;


    if (
      extractedCount % 100 === 0
    ) {

      console.log(
        `   Extracted ${extractedCount} files...`
      );
    }
  }


  console.log(
    `\n✅ Extracted ${extractedCount} files`
  );


  console.log(
    `📂 Extraction folder: ${extractPath}`
  );


  return extractPath;
};


// ==========================================
// FIND PRODUCT FOLDERS
// ==========================================

const getProductFolders = () => {

  const rootFolder =
    path.join(
      EXTRACT_PATH,
      "untitled folder"
    );


  if (
    !fs.existsSync(rootFolder)
  ) {

    throw new Error(
      "Could not find 'untitled folder' inside ZIP."
    );
  }


  const folders =
    fs
      .readdirSync(
        rootFolder
      )
      .filter((item) => {

        const fullPath =
          path.join(
            rootFolder,
            item
          );


        try {

          return fs
            .statSync(
              fullPath
            )
            .isDirectory();

        } catch {

          return false;

        }

      });


  return folders.map(
    (folderName) => {

      return {

        name:
          folderName,

        path:
          path.join(
            rootFolder,
            folderName
          )

      };

    }
  );
};


// ==========================================
// GET PRODUCT IMAGES
// FRONT IMAGE FIRST
// ==========================================

const getImages = (
  folderPath
) => {

  if (
    !fs.existsSync(folderPath)
  ) {

    return [];
  }


  const images =
    fs
      .readdirSync(
        folderPath
      )
      .filter(
        (file) =>
          /\.(jpg|jpeg|png|webp)$/i.test(
            file
          )
      );


  // ========================================
  // SORT IMAGES
  // ========================================

  images.sort(
    (a, b) => {

      const getScore =
        (filename) => {

          const lower =
            filename.toLowerCase();


          // --------------------------------
          // BEST:
          // BASE IMAGE
          //
          // Example:
          // 53651.jpg
          // 71712.jpg
          // --------------------------------

          if (
            !/-[12]l\.(jpg|jpeg|png|webp)$/i.test(
              lower
            )
          ) {

            return 0;
          }


          // --------------------------------
          // SECOND:
          // -1L
          // --------------------------------

          if (
            /-1l\.(jpg|jpeg|png|webp)$/i.test(
              lower
            )
          ) {

            return 10;
          }


          // --------------------------------
          // THIRD:
          // -2L
          // --------------------------------

          if (
            /-2l\.(jpg|jpeg|png|webp)$/i.test(
              lower
            )
          ) {

            return 20;
          }


          return 30;
        };


      const scoreA =
        getScore(a);


      const scoreB =
        getScore(b);


      if (
        scoreA !== scoreB
      ) {

        return scoreA - scoreB;
      }


      return a.localeCompare(
        b,
        undefined,
        {
          numeric: true,
          sensitivity: "base"
        }
      );

    }
  );


  return images;
};


// ==========================================
// COPY PRODUCT IMAGES
// ==========================================

const copyImages = (
  productId,
  folderPath,
  images
) => {

  const destination =
    path.join(
      UPLOAD_PATH,
      productId
    );


  fs.mkdirSync(
    destination,
    {
      recursive: true
    }
  );


  const imageUrls = [];


  images.forEach(
    (imageName) => {

      const source =
        path.join(
          folderPath,
          imageName
        );


      // ------------------------------------
      // CHECK SOURCE
      // ------------------------------------

      if (
        !fs.existsSync(source)
      ) {

        console.log(
          `⚠️ Image missing: ${source}`
        );

        return;
      }


      // ------------------------------------
      // SAFE IMAGE NAME
      // ------------------------------------

      const safeName =
        imageName
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
          );


      const destinationFile =
        path.join(
          destination,
          safeName
        );


      // ------------------------------------
      // COPY
      // ------------------------------------

      fs.copyFileSync(
        source,
        destinationFile
      );


      // ------------------------------------
      // URL
      // ------------------------------------

      imageUrls.push(
        `/uploads/products/${productId}/${safeName}`
      );

    }
  );


  return imageUrls;
};


// ==========================================
// IMPORT PRODUCTS
// ==========================================

const importProducts = async () => {

  const folders =
    getProductFolders();


  console.log(
    `\n🧃 Found ${folders.length} product folders.\n`
  );


  // ----------------------------------------
  // CREATE UPLOAD FOLDER
  // ----------------------------------------

  fs.mkdirSync(
    UPLOAD_PATH,
    {
      recursive: true
    }
  );


  let imported = 0;

  let updated = 0;

  let skipped = 0;


  // ========================================
  // LOOP PRODUCTS
  // ========================================

  for (
    let index = 0;
    index < folders.length;
    index++
  ) {

    const folder =
      folders[index];


    const folderName =
      folder.name;


    const folderPath =
      folder.path;


    // --------------------------------------
    // GET IMAGES
    // --------------------------------------

    const images =
      getImages(
        folderPath
      );


    // --------------------------------------
    // NO IMAGES
    // --------------------------------------

    if (
      images.length === 0
    ) {

      console.log(
        `⚠️ Skipping: ${folderName}`
      );

      skipped++;

      continue;
    }


    // --------------------------------------
    // CREATE ID
    // --------------------------------------

    const id =
      createId(
        folderName,
        index
      );


    // --------------------------------------
    // CHECK EXISTING PRODUCT
    // --------------------------------------

    const existing =
      await Product.findOne({
        id
      });


    // ======================================
    // COPY IMAGES
    // ======================================

    const imageUrls =
      copyImages(
        id,
        folderPath,
        images
      );


    // --------------------------------------
    // MAKE SURE IMAGE EXISTS
    // --------------------------------------

    if (
      imageUrls.length === 0
    ) {

      console.log(
        `⚠️ No usable images: ${folderName}`
      );

      skipped++;

      continue;
    }


    // ======================================
    // EXISTING PRODUCT
    // UPDATE IT
    // ======================================

    if (existing) {

      existing.image =
        imageUrls[0];


      existing.images =
        imageUrls;


      existing.name =
        createProductName(
          folderName
        );


      existing.category =
        getCategory(
          folderName
        );


      existing.sourceFolder =
        folderName;


      await existing.save();


      updated++;


      console.log(
        `🔄 ${updated}. Updated: ${existing.name} | Front: ${images[0]}`
      );


      continue;
    }


    // ======================================
    // NEW PRODUCT
    // ======================================

    const productName =
      createProductName(
        folderName
      );


    const category =
      getCategory(
        folderName
      );


    // ======================================
    // CREATE MONGODB PRODUCT
    // ======================================

    const product =
      await Product.create({

        id,

        name:
          productName,

        category,

        // ZIP doesn't contain prices
        price:
          null,

        // FIRST IMAGE = FRONT
        image:
          imageUrls[0],

        // ALL IMAGES
        images:
          imageUrls,

        description:
          `Experience ${productName}. A refreshing Monster drink made for bold flavour and maximum refreshment.`,

        rating:
          4.9,

        reviews:
          0,

        stock:
          100,

        sourceFolder:
          folderName

      });


    imported++;


    console.log(
      `✅ ${imported}. ${product.name} | Front: ${images[0]} | ${images.length} images`
    );

  }


  // ==========================================
  // SUMMARY
  // ==========================================

  console.log(
    "\n================================"
  );


  console.log(
    "🎉 IMPORT COMPLETE"
  );


  console.log(
    "================================"
  );


  console.log(
    `🆕 Imported: ${imported}`
  );


  console.log(
    `🔄 Updated: ${updated}`
  );


  console.log(
    `⏭️ Skipped: ${skipped}`
  );


  console.log(
    `📦 Total folders: ${folders.length}`
  );


  console.log(
    "================================\n"
  );
};


// ==========================================
// RUN
// ==========================================

const run = async () => {

  try {

    // --------------------------------------
    // CONNECT DATABASE
    // --------------------------------------

    await connectDatabase();


    // --------------------------------------
    // CLEAN OLD INDEX
    // --------------------------------------

    await cleanupOldIndexes();


    // --------------------------------------
    // EXTRACT ZIP
    // --------------------------------------

    await extractZip(
      ZIP_PATH
    );


    // --------------------------------------
    // IMPORT PRODUCTS
    // --------------------------------------

    await importProducts();


    // --------------------------------------
    // CLOSE DATABASE
    // --------------------------------------

    await mongoose.connection.close();


    console.log(
      "Database connection closed."
    );


  } catch (error) {

    console.error(
      "\n❌ IMPORT FAILED:"
    );


    console.error(
      error
    );


    // --------------------------------------
    // CLOSE DB IF OPEN
    // --------------------------------------

    try {

      await mongoose.connection.close();

    } catch {

      // Ignore close error

    }


    process.exit(1);
  }
};


// ==========================================
// START
// ==========================================

run();