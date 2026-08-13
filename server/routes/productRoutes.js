import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();


// =====================================================
// ADMIN PRODUCT UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "products",
  "admin"
);


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    try {

      // Create directory ONLY when an upload is actually happening
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, {
          recursive: true,
        });
      }

      cb(null, uploadDirectory);

    } catch (error) {

      console.error(
        "❌ UPLOAD DIRECTORY ERROR:",
        error
      );

      cb(error);

    }

  },


  filename: (req, file, cb) => {

    const extension =
      path.extname(
        file.originalname
      );


    const filename =
      `product-${Date.now()}-${Math.round(
        Math.random() * 1000000000
      )}${extension}`;


    cb(
      null,
      filename
    );

  },

});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];


  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        "Only JPG, PNG, WEBP and AVIF images are allowed"
      )
    );

  }

};


// =====================================================
// MULTER
// =====================================================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

});


// =====================================================
// GET ALL PRODUCTS
// =====================================================

router.get(
  "/",
  getProducts
);


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

router.get(
  "/:id",
  getProduct
);


// =====================================================
// CREATE PRODUCT
// =====================================================

router.post(
  "/",
  upload.array(
    "images",
    10
  ),
  createProduct
);


// =====================================================
// UPDATE PRODUCT
// =====================================================

router.put(
  "/:id",
  upload.array(
    "images",
    10
  ),
  updateProduct
);


// =====================================================
// DELETE PRODUCT
// =====================================================

router.delete(
  "/:id",
  deleteProduct
);


export default router;