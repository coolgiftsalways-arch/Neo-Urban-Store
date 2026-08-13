import Product from "../models/Product.js";


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getProducts = async (
  req,
  res
) => {

  try {

    const products =
      await Product.find().sort({
        name: 1,
      });

    res.json(
      products
    );

  } catch (error) {

    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to fetch products",

      error:
        error.message,

    });

  }

};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export const getProduct = async (
  req,
  res
) => {

  try {

    const identifier =
      req.params.id;

    let product = null;


    // -------------------------------------------------
    // FIND BY MONGODB _id
    // -------------------------------------------------

    if (
      /^[0-9a-fA-F]{24}$/.test(
        identifier
      )
    ) {

      product =
        await Product.findById(
          identifier
        );

    }


    // -------------------------------------------------
    // FIND BY CUSTOM id
    // -------------------------------------------------

    if (!product) {

      product =
        await Product.findOne({
          id: identifier,
        });

    }


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    res.json(
      product
    );

  } catch (error) {

    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to fetch product",

      error:
        error.message,

    });

  }

};


// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (
  req,
  res
) => {

  try {

    const uploadedImages =
      req.files?.map(
        (file) =>
          `/uploads/products/admin/${file.filename}`
      ) || [];


    const {

      id,
      name,
      category,
      price,
      description,
      rating,
      reviews,
      stock,
      sourceFolder,

    } = req.body;


    const mainImage =
      uploadedImages[0] ||
      req.body.image;


    if (!mainImage) {

      return res.status(400).json({

        message:
          "At least one image is required",

      });

    }


    const product =
      await Product.create({

        id:
          id ||
          `product-${Date.now()}`,

        name,

        category:
          category ||
          "Energy",

        price:
          price !== undefined &&
          price !== ""
            ? Number(price)
            : null,

        image:
          mainImage,

        images:
          uploadedImages.length > 0
            ? uploadedImages
            : [mainImage],

        description:
          description || "",

        rating:
          rating !== undefined &&
          rating !== ""
            ? Number(rating)
            : 4.9,

        reviews:
          reviews !== undefined &&
          reviews !== ""
            ? Number(reviews)
            : 0,

        stock:
          stock !== undefined &&
          stock !== ""
            ? Number(stock)
            : 100,

        sourceFolder:
          sourceFolder || "",

      });


    res.status(201).json(
      product
    );

  } catch (error) {

    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create product",

      error:
        error.message,

    });

  }

};


// =====================================================
// ⭐ UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
  req,
  res
) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "UPDATE PRODUCT REQUEST"
    );

    console.log(
      "PRODUCT ID:",
      req.params.id
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILES:",
      req.files?.length || 0
    );

    console.log(
      "================================="
    );


    const identifier =
      req.params.id;


    let product = null;


    // -------------------------------------------------
    // FIND BY MONGODB _id
    // -------------------------------------------------

    if (
      /^[0-9a-fA-F]{24}$/.test(
        identifier
      )
    ) {

      product =
        await Product.findById(
          identifier
        );

    }


    // -------------------------------------------------
    // FIND BY CUSTOM PRODUCT ID
    // -------------------------------------------------

    if (!product) {

      product =
        await Product.findOne({
          id: identifier,
        });

    }


    // -------------------------------------------------
    // PRODUCT NOT FOUND
    // -------------------------------------------------

    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    // =================================================
    // BASIC DETAILS
    // =================================================

    if (
      req.body.name !== undefined
    ) {

      product.name =
        req.body.name;

    }


    if (
      req.body.category !== undefined
    ) {

      product.category =
        req.body.category;

    }


    if (
      req.body.price !== undefined &&
      req.body.price !== ""
    ) {

      product.price =
        Number(
          req.body.price
        );

    }


    if (
      req.body.stock !== undefined &&
      req.body.stock !== ""
    ) {

      product.stock =
        Number(
          req.body.stock
        );

    }


    if (
      req.body.description !== undefined
    ) {

      product.description =
        req.body.description;

    }


    // =================================================
    // EXISTING IMAGES
    // =================================================

    let existingImages = [];


    if (
      req.body.existingImages
    ) {

      try {

        existingImages =
          JSON.parse(
            req.body.existingImages
          );

      } catch (error) {

        console.error(
          "Existing image JSON error:",
          error
        );

        existingImages =
          product.images || [];

      }

    } else {

      existingImages =
        product.images?.length
          ? product.images
          : product.image
            ? [product.image]
            : [];

    }


    // =================================================
    // NEW UPLOADED IMAGES
    // =================================================

    const newImages =
      req.files?.map(
        (file) =>
          `/uploads/products/admin/${file.filename}`
      ) || [];


    // =================================================
    // COMBINE OLD + NEW
    // =================================================

    const allImages = [
      ...existingImages,
      ...newImages,
    ];


    // =================================================
    // AT LEAST ONE IMAGE
    // =================================================

    if (
      allImages.length === 0
    ) {

      return res.status(400).json({

        message:
          "Product must have at least one image",

      });

    }


    // =================================================
    // SAVE IMAGES
    // =================================================

    product.images =
      allImages;


    // =================================================
    // MAIN IMAGE
    // =================================================

    if (
      req.body.mainImage &&
      allImages.includes(
        req.body.mainImage
      )
    ) {

      product.image =
        req.body.mainImage;

    } else if (
      !allImages.includes(
        product.image
      )
    ) {

      product.image =
        allImages[0];

    }


    // =================================================
    // SAVE
    // =================================================

    const updatedProduct =
      await product.save();


    console.log(
      "PRODUCT UPDATED:",
      updatedProduct._id
    );


    res.json({

      message:
        "Product updated successfully",

      product:
        updatedProduct,

    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "UPDATE PRODUCT ERROR:"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );


    res.status(500).json({

      message:
        "Failed to update product",

      error:
        error.message,

    });

  }

};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (
  req,
  res
) => {

  try {

    const identifier =
      req.params.id;


    let product = null;


    // -------------------------------------------------
    // FIND BY _id
    // -------------------------------------------------

    if (
      /^[0-9a-fA-F]{24}$/.test(
        identifier
      )
    ) {

      product =
        await Product.findById(
          identifier
        );

    }


    // -------------------------------------------------
    // FIND BY CUSTOM ID
    // -------------------------------------------------

    if (!product) {

      product =
        await Product.findOne({
          id: identifier,
        });

    }


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    await Product.deleteOne({
      _id:
        product._id,
    });


    res.json({

      message:
        "Product deleted successfully",

      productId:
        product._id,

    });

  } catch (error) {

    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete product",

      error:
        error.message,

    });

  }

};