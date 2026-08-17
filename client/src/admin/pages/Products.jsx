import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import api from "../../config/api";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiUploadCloud,
  FiImage,
  FiSave,
} from "react-icons/fi";

import "../styles/products.css";


// =========================================================
// API
// =========================================================

const API_URL = "https://api.neourbanstore.in";

const PRODUCTS_API =
  `${API_URL}/api/products`;


// =========================================================
// IMAGE URL HELPER
// =========================================================

const getImageUrl = (image) => {

  if (!image) {
    return "";
  }

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  // Relative backend path
  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
};


// =========================================================
// NORMALIZE PRODUCT IMAGES
// =========================================================

const getProductImages = (product) => {

  if (
    Array.isArray(product?.images) &&
    product.images.length > 0
  ) {
    return product.images;
  }

  if (product?.image) {
    return [product.image];
  }

  return [];
};


// =========================================================
// EMPTY FORM
// =========================================================

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
};


// =========================================================
// PRODUCTS COMPONENT
// =========================================================

export default function Products() {

  // -------------------------------------------------------
  // PRODUCTS
  // -------------------------------------------------------

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // -------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------

  const [searchQuery, setSearchQuery] =
    useState("");


  // -------------------------------------------------------
  // EDIT MODAL
  // -------------------------------------------------------

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);


  // -------------------------------------------------------
  // IMAGES
  // -------------------------------------------------------

  const [existingImages, setExistingImages] =
    useState([]);

  const [newImages, setNewImages] =
    useState([]);

  const [mainImage, setMainImage] =
    useState("");


  // -------------------------------------------------------
  // LOADING STATES
  // -------------------------------------------------------

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  // -------------------------------------------------------
  // FILE INPUT
  // -------------------------------------------------------

  const fileInputRef =
    useRef(null);


  // =======================================================
  // FETCH PRODUCTS
  // =======================================================

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          PRODUCTS_API
        );

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Error fetching products:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }

  };


  // =======================================================
  // INITIAL FETCH
  // =======================================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // =======================================================
  // SEARCH
  // =======================================================

  const filteredProducts =
    useMemo(() => {

      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) => {

          const name =
            product.name
              ?.toLowerCase() || "";

          const category =
            product.category
              ?.toLowerCase() || "";

          const id =
            product.id
              ?.toLowerCase() || "";

          return (
            name.includes(query) ||
            category.includes(query) ||
            id.includes(query)
          );

        }
      );

    }, [
      products,
      searchQuery,
    ]);


  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  const handleEdit = (product) => {

    const images =
      getProductImages(
        product
      );


    setEditingProduct(
      product
    );


    setFormData({

      name:
        product.name || "",

      category:
        product.category || "",

      price:
        product.price ?? "",

      stock:
        product.stock ?? "",

      description:
        product.description || "",

    });


    setExistingImages(
      images
    );


    setNewImages([]);


    setMainImage(
      product.image ||
      images[0] ||
      ""
    );

  };


  // =======================================================
  // CLOSE EDIT MODAL
  // =======================================================

  const closeEditModal = () => {

    if (saving) {
      return;
    }

    setEditingProduct(null);

    setFormData(
      emptyForm
    );

    setExistingImages([]);

    setNewImages([]);

    setMainImage("");

  };


  // =======================================================
  // INPUT CHANGE
  // =======================================================

  const handleInputChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  // =======================================================
  // ADD NEW IMAGES
  // =======================================================

  const handleImageUpload = (
    event
  ) => {

    const files =
      Array.from(
        event.target.files || []
      );


    if (
      files.length === 0
    ) {
      return;
    }


    // Only allow image files
    const imageFiles =
      files.filter(
        (file) =>
          file.type.startsWith(
            "image/"
          )
      );


    if (
      imageFiles.length !==
      files.length
    ) {

      alert(
        "Only image files are allowed."
      );

    }


    setNewImages(
      (previous) => [
        ...previous,
        ...imageFiles,
      ]
    );


    // Allow selecting same file again
    event.target.value = "";

  };


  // =======================================================
  // REMOVE EXISTING IMAGE
  // =======================================================

  const handleRemoveExistingImage = (
    image
  ) => {

    if (
      existingImages.length <= 1 &&
      newImages.length === 0
    ) {

      alert(
        "A product must have at least one image."
      );

      return;
    }


    const updatedImages =
      existingImages.filter(
        (item) =>
          item !== image
      );


    setExistingImages(
      updatedImages
    );


    // If removed image was main image,
    // automatically choose another one
    if (
      mainImage === image
    ) {

      setMainImage(
        updatedImages[0] ||
        ""
      );

    }

  };


  // =======================================================
  // REMOVE NEW IMAGE
  // =======================================================

  const handleRemoveNewImage = (
    index
  ) => {

    setNewImages(
      (previous) =>
        previous.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );

  };


  // =======================================================
  // SET MAIN IMAGE
  // =======================================================

  const handleSetMainImage = (
    image
  ) => {

    setMainImage(
      image
    );

  };


  // =======================================================
  // SAVE PRODUCT
  // =======================================================

  const handleSaveProduct = async (
    event
  ) => {

    event.preventDefault();


    if (!editingProduct) {
      return;
    }


    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      !formData.name.trim()
    ) {

      alert(
        "Product name is required."
      );

      return;
    }


    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {

      alert(
        "Please enter a valid price."
      );

      return;
    }


    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {

      alert(
        "Please enter a valid stock quantity."
      );

      return;
    }


    if (
      existingImages.length === 0 &&
      newImages.length === 0
    ) {

      alert(
        "Please keep at least one product image."
      );

      return;
    }


    try {

      setSaving(true);


      // ===================================================
      // PRODUCT ID
      // ===================================================

      // MongoDB _id is safest because your controller
      // supports it directly.

      const productIdentifier =
        editingProduct._id ||
        editingProduct.id;


      if (!productIdentifier) {

        throw new Error(
          "Product ID is missing."
        );

      }


      // ===================================================
      // FORM DATA
      // ===================================================

      const data =
        new FormData();


      // Basic fields

      data.append(
        "name",
        formData.name.trim()
      );


      data.append(
        "category",
        formData.category.trim()
      );


      data.append(
        "price",
        String(
          Number(formData.price)
        )
      );


      data.append(
        "stock",
        String(
          Number(formData.stock)
        )
      );


      data.append(
        "description",
        formData.description || ""
      );


      // ===================================================
      // EXISTING IMAGES
      // ===================================================

      data.append(
        "existingImages",
        JSON.stringify(
          existingImages
        )
      );


      // ===================================================
      // MAIN IMAGE
      // ===================================================

      // If main image is an existing image,
      // send its path.

      if (mainImage) {

        data.append(
          "mainImage",
          mainImage
        );

      }


      // ===================================================
      // NEW IMAGE FILES
      // ===================================================

      newImages.forEach(
        (file) => {

          data.append(
            "images",
            file
          );

        }
      );


      // ===================================================
      // DEBUG
      // =======================================================

      console.log(
        "Updating product:",
        productIdentifier
      );

      console.log(
        "Existing images:",
        existingImages
      );

      console.log(
        "New images:",
        newImages
      );

      console.log(
        "Main image:",
        mainImage
      );


      // ===================================================
      // PUT REQUEST
      // ===================================================

      const response =
        await axios.put(

          `${PRODUCTS_API}/${productIdentifier}`,

          data,

          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }

        );


      console.log(
        "UPDATE RESPONSE:",
        response.data
      );


      // ===================================================
      // UPDATE LOCAL TABLE
      // ===================================================

      const updatedProduct =
        response.data?.product;


      if (updatedProduct) {

        setProducts(
          (previous) =>
            previous.map(
              (product) => {

                const sameProduct =
                  product._id ===
                    updatedProduct._id ||
                  product.id ===
                    updatedProduct.id;

                return sameProduct
                  ? updatedProduct
                  : product;

              }
            )
        );

      } else {

        // Fallback: fetch everything again
        await fetchProducts();

      }


      // ===================================================
      // CLOSE MODAL
      // ===================================================

      setEditingProduct(
        null
      );

      setFormData(
        emptyForm
      );

      setExistingImages([]);

      setNewImages([]);

      setMainImage("");


      alert(
        "Product updated successfully! 🎉"
      );


    } catch (error) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );


      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );


      alert(

        error.response?.data?.message ||

        error.response?.data?.error ||

        error.message ||

        "Failed to update product"

      );

    } finally {

      setSaving(false);

    }

  };


  // =======================================================
  // DELETE PRODUCT
  // =======================================================

  const handleDelete = async (
    product
  ) => {

    if (!product) {
      return;
    }


    const confirmed =
      window.confirm(

        `Are you sure you want to delete "${product.name}"?`

      );


    if (!confirmed) {
      return;
    }


    const productIdentifier =
      product._id ||
      product.id;


    if (!productIdentifier) {

      alert(
        "Product ID is missing."
      );

      return;

    }


    try {

      setDeletingId(
        productIdentifier
      );


      await axios.delete(
        `${PRODUCTS_API}/${productIdentifier}`
      );


      setProducts(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
                product._id &&
              item.id !==
                product.id
          )
      );


      alert(
        "Product deleted successfully."
      );


    } catch (error) {

      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );


      alert(

        error.response?.data?.message ||

        error.response?.data?.error ||

        "Failed to delete product"

      );

    } finally {

      setDeletingId(null);

    }

  };


  // =======================================================
  // GET DISPLAY STATUS
  // =======================================================

  const getStatus = (
    product
  ) => {

    const stock =
      Number(
        product.stock ?? 0
      );


    if (stock <= 0) {
      return {
        text: "Out of Stock",
        className: "inactive",
      };
    }


    return {
      text: "Active",
      className: "active",
    };

  };


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="products-header">

        <div>

          <h1>
            Products
          </h1>

          <p>
            Manage all your store products
          </p>

        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >

          <span
            style={{
              color: "#78839a",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {products.length} Products
          </span>


          <button
            className="add-product-btn"
            onClick={() =>
              alert(
                "Add Product functionality can be connected next."
              )
            }
          >

            <FiPlus />

            Add Product

          </button>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="product-toolbar">

        <div className="product-search">

          <FiSearch />

          <input

            type="text"

            placeholder="Search products..."

            value={
              searchQuery
            }

            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }

          />

        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="products-table">

        {loading ? (

          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#888",
            }}
          >

            Loading products...

          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>
                  Image
                </th>

                <th>
                  Name
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredProducts.length >
              0 ? (

                filteredProducts.map(
                  (product) => {

                    const images =
                      getProductImages(
                        product
                      );


                    const status =
                      getStatus(
                        product
                      );


                    const productId =
                      product._id ||
                      product.id;


                    const isDeleting =
                      deletingId ===
                      productId;


                    return (

                      <tr
                        key={
                          productId
                        }
                      >

                        {/* IMAGE */}

                        <td>

                          <img

                            src={getImageUrl(
                              product.image ||
                              images[0]
                            )}

                            alt={
                              product.name ||
                              "Product"
                            }

                            onError={(event) => {

                              event.currentTarget.style.opacity =
                                "0.3";

                            }}

                          />

                        </td>


                        {/* NAME */}

                        <td>

                          <strong>

                            {
                              product.name ||
                              "Unnamed Product"
                            }

                          </strong>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          {
                            product.category ||
                            "Energy"
                          }

                        </td>


                        {/* PRICE */}

                        <td>

                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* STOCK */}

                        <td>

                          {
                            product.stock ??
                            0
                          }

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${status.className}`}
                          >

                            <span
                              style={{
                                display:
                                  "inline-block",
                                width:
                                  "8px",
                                height:
                                  "8px",
                                borderRadius:
                                  "50%",
                                background:
                                  "currentColor",
                                marginRight:
                                  "7px",
                              }}
                            />

                            {
                              status.text
                            }

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <button

                            className="icon-btn"

                            title="Edit product"

                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }

                          >

                            <FiEdit2 />

                          </button>


                          <button

                            className="icon-btn delete"

                            title="Delete product"

                            disabled={
                              isDeleting
                            }

                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }

                          >

                            <FiTrash2 />

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "50px",
                      color:
                        "#888",
                    }}
                  >

                    No products found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>


      {/* =================================================
          EDIT PRODUCT MODAL
      ================================================= */}

      {editingProduct && (

        <div

          className="product-modal-overlay"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeEditModal();

            }

          }}

        >

          <div

            className="product-modal"

            onMouseDown={(event) =>
              event.stopPropagation()
            }

          >

            {/* ===========================================
                HEADER
            =========================================== */}

            <div className="product-modal-header">

              <div>

                <h2>
                  Edit Product
                </h2>

                <p>
                  Update product details and images
                </p>

              </div>


              <button

                type="button"

                className="modal-close"

                onClick={
                  closeEditModal
                }

                disabled={
                  saving
                }

              >

                <FiX />

              </button>

            </div>


            {/* ===========================================
                FORM
            =========================================== */}

            <form
              onSubmit={
                handleSaveProduct
              }
            >

              {/* =========================================
                  BASIC DETAILS
              ========================================= */}

              <div className="product-form-grid">

                {/* NAME */}

                <div className="form-group">

                  <label>
                    Product Name
                  </label>

                  <input

                    type="text"

                    name="name"

                    value={
                      formData.name
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder="Product name"

                    disabled={
                      saving
                    }

                  />

                </div>


                {/* CATEGORY */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <input

                    type="text"

                    name="category"

                    value={
                      formData.category
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder="Category"

                    disabled={
                      saving
                    }

                  />

                </div>


                {/* PRICE */}

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input

                    type="number"

                    name="price"

                    min="0"

                    step="0.01"

                    value={
                      formData.price
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder="Price"

                    disabled={
                      saving
                    }

                  />

                </div>


                {/* STOCK */}

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input

                    type="number"

                    name="stock"

                    min="0"

                    value={
                      formData.stock
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder="Stock"

                    disabled={
                      saving
                    }

                  />

                </div>

              </div>


              {/* =========================================
                  DESCRIPTION
              ========================================= */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea

                  name="description"

                  value={
                    formData.description
                  }

                  onChange={
                    handleInputChange
                  }

                  placeholder="Product description"

                  disabled={
                    saving
                  }

                />

              </div>


              {/* =========================================
                  PRODUCT IMAGES
              ========================================= */}

              <div className="image-section">

                <div className="image-section-header">

                  <label>
                    Product Images
                  </label>

                  <span>
                    First image = main image
                  </span>

                </div>


                <div className="product-image-grid">

                  {/* =====================================
                      EXISTING IMAGES
                  ===================================== */}

                  {existingImages.map(
                    (
                      image,
                      index
                    ) => (

                      <div

                        className="admin-image-card"

                        key={`existing-${image}-${index}`}

                      >

                        <img

                          src={getImageUrl(
                            image
                          )}

                          alt={`Product ${index + 1}`}

                        />


                        {/* MAIN */}

                        {mainImage ===
                          image && (

                          <button

                            type="button"

                            className="main-image-badge"

                            onClick={() =>
                              handleSetMainImage(
                                image
                              )
                            }

                            title="Main image"

                          >

                            Main

                          </button>

                        )}


                        {/* MAKE MAIN */}

                        {mainImage !==
                          image && (

                          <button

                            type="button"

                            className="new-image-badge"

                            onClick={() =>
                              handleSetMainImage(
                                image
                              )
                            }

                            title="Set as main image"

                          >

                            Set Main

                          </button>

                        )}


                        {/* REMOVE */}

                        <button

                          type="button"

                          className="remove-image-btn"

                          onClick={() =>
                            handleRemoveExistingImage(
                              image
                            )
                          }

                          disabled={
                            saving
                          }

                          title="Remove image"

                        >

                          <FiX />

                        </button>

                      </div>

                    )
                  )}


                  {/* =====================================
                      NEW IMAGES
                  ===================================== */}

                  {newImages.map(
                    (
                      file,
                      index
                    ) => {

                      const previewUrl =
                        URL.createObjectURL(
                          file
                        );


                      return (

                        <div

                          className="admin-image-card"

                          key={`new-${file.name}-${index}`}

                        >

                          <img

                            src={
                              previewUrl
                            }

                            alt={
                              file.name
                            }

                          />


                          <span
                            className="new-image-badge"
                          >
                            New
                          </span>


                          <button

                            type="button"

                            className="remove-image-btn"

                            onClick={() =>
                              handleRemoveNewImage(
                                index
                              )
                            }

                            disabled={
                              saving
                            }

                            title="Remove new image"

                          >

                            <FiX />

                          </button>

                        </div>

                      );

                    }
                  )}


                  {/* =====================================
                      ADD IMAGE
                  ===================================== */}

                  <label
                    className="image-upload-card"
                  >

                    <FiUploadCloud />

                    <span>
                      Add Images
                    </span>

                    <small>
                      JPG / PNG / WEBP
                    </small>


                    <input

                      ref={
                        fileInputRef
                      }

                      type="file"

                      accept="image/jpeg,image/png,image/webp,image/avif"

                      multiple

                      onChange={
                        handleImageUpload
                      }

                      disabled={
                        saving
                      }

                    />

                  </label>

                </div>

              </div>


              {/* =========================================
                  FOOTER
              ========================================= */}

              <div className="product-modal-actions">

                <button

                  type="button"

                  className="cancel-btn"

                  onClick={
                    closeEditModal
                  }

                  disabled={
                    saving
                  }

                >

                  Cancel

                </button>


                <button

                  type="submit"

                  className="save-product-btn"

                  disabled={
                    saving
                  }

                >

                  {saving ? (

                    <>
                      Saving...
                    </>

                  ) : (

                    <>
                      <FiSave
                        style={{
                          marginRight:
                            "7px",
                          verticalAlign:
                            "middle",
                        }}
                      />

                      Save Changes
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}