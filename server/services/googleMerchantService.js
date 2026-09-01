import axios from "axios";
import { GoogleAuth } from "google-auth-library";

const MERCHANT_API_BASE =
  "https://merchantapi.googleapis.com/products/v1";

const GOOGLE_CONTENT_SCOPE =
  "https://www.googleapis.com/auth/content";

let googleAuth = null;

/* =========================================================
   GET ENV CONFIG
========================================================= */

const getConfig = () => ({
  merchantId: process.env.GOOGLE_MERCHANT_ID?.trim(),

  dataSourceId:
    process.env.GOOGLE_MERCHANT_DATA_SOURCE_ID?.trim(),

  feedLabel:
    process.env.GOOGLE_MERCHANT_FEED_LABEL?.trim() || "IN",

  contentLanguage:
    process.env.GOOGLE_MERCHANT_CONTENT_LANGUAGE?.trim() || "en",

  currency:
    process.env.GOOGLE_MERCHANT_CURRENCY?.trim() || "INR",

  backendUrl:
    process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, ""),

  frontendUrl:
    process.env.FRONTEND_PUBLIC_URL?.replace(/\/+$/, ""),
});

/* =========================================================
   CHECK IF MERCHANT SYNC IS ENABLED
========================================================= */

export const isGoogleMerchantEnabled = () => {
  const config = getConfig();

  return (
    process.env.GOOGLE_MERCHANT_SYNC_ENABLED === "true" &&
    Boolean(
      config.merchantId &&
        config.dataSourceId &&
        config.backendUrl &&
        config.frontendUrl
    )
  );
};

/* =========================================================
   VALIDATE CONFIG
========================================================= */

const validateConfig = () => {
  const config = getConfig();

  const missing = [];

  if (!config.merchantId) {
    missing.push("GOOGLE_MERCHANT_ID");
  }

  if (!config.dataSourceId) {
    missing.push("GOOGLE_MERCHANT_DATA_SOURCE_ID");
  }

  if (!config.backendUrl) {
    missing.push("BACKEND_PUBLIC_URL");
  }

  if (!config.frontendUrl) {
    missing.push("FRONTEND_PUBLIC_URL");
  }

  if (missing.length > 0) {
    throw new Error(
      `Google Merchant configuration missing: ${missing.join(", ")}`
    );
  }

  return config;
};

/* =========================================================
   GOOGLE AUTH
========================================================= */

const getGoogleAuth = () => {
  if (!googleAuth) {
    googleAuth = new GoogleAuth({
      scopes: [GOOGLE_CONTENT_SCOPE],
    });
  }

  return googleAuth;
};

const getAccessToken = async () => {
  const auth = getGoogleAuth();

  const client = await auth.getClient();

  const tokenResponse = await client.getAccessToken();

  const token =
    typeof tokenResponse === "string"
      ? tokenResponse
      : tokenResponse?.token;

  if (!token) {
    throw new Error(
      "Unable to get Google Merchant API access token."
    );
  }

  return token;
};

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

export const getMerchantErrorMessage = (error) => {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Unknown Google Merchant API error"
  );
};

/* =========================================================
   CONVERT IMAGE TO PUBLIC URL
========================================================= */

const makePublicUrl = (baseUrl, value) => {
  if (!value) {
    return null;
  }

  const stringValue = String(value).trim();

  if (
    stringValue.startsWith("http://") ||
    stringValue.startsWith("https://")
  ) {
    return stringValue;
  }

  return `${baseUrl}/${stringValue.replace(/^\/+/, "")}`;
};

/* =========================================================
   PRICE TO GOOGLE MICROS
========================================================= */

const priceToMicros = (price) => {
  const numericPrice = Number(price);

  if (
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0
  ) {
    throw new Error(
      `Invalid product price for Merchant Center: ${price}`
    );
  }

  return Math.round(
    numericPrice * 1_000_000
  ).toString();
};

/* =========================================================
   GOOGLE DATA SOURCE NAME
========================================================= */

const getDataSourceName = () => {
  const config = validateConfig();

  return (
    `accounts/${config.merchantId}` +
    `/dataSources/${config.dataSourceId}`
  );
};

/* =========================================================
   BUILD GOOGLE PRODUCT
========================================================= */

export const buildGoogleProduct = (product) => {
  const config = validateConfig();

  if (!product) {
    throw new Error("Product is required.");
  }

  if (!product.id) {
    throw new Error(
      "Product id is required for Google Merchant Center."
    );
  }

  if (!product.name) {
    throw new Error(
      `Product ${product.id} does not have a name.`
    );
  }

  if (!product.image) {
    throw new Error(
      `Product ${product.id} does not have an image.`
    );
  }

  const imageLink = makePublicUrl(
    config.backendUrl,
    product.image
  );

  const productLink =
    `${config.frontendUrl}/product/` +
    encodeURIComponent(product.id);

  return {
    offerId: String(product.id),

    contentLanguage: config.contentLanguage,

    feedLabel: config.feedLabel,

    productAttributes: {
      title: product.name,

      description:
        product.description?.trim() ||
        product.name,

      link: productLink,

      imageLink,

      availability:
        Number(product.stock) > 0
          ? "IN_STOCK"
          : "OUT_OF_STOCK",

      condition: "NEW",

      price: {
        amountMicros: priceToMicros(product.price),
        currencyCode: config.currency,
      },
    },
  };
};

/* =========================================================
   CREATE / FULL SYNC PRODUCT

   productInputs:insert also replaces an existing product
   when the product identifiers/data source match.
========================================================= */

export const syncProductToGoogle = async (product) => {
  const config = validateConfig();

  const token = await getAccessToken();

  const googleProduct =
    buildGoogleProduct(product);

  const url =
    `${MERCHANT_API_BASE}/accounts/` +
    `${config.merchantId}/productInputs:insert`;

  const response = await axios.post(
    url,
    googleProduct,
    {
      params: {
        dataSource: getDataSourceName(),
      },

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      timeout: 30000,
    }
  );

  return response.data;
};

/* =========================================================
   GOOGLE PRODUCT INPUT ID

   Format before encoding:
   language~feedLabel~offerId

   Base64URL encoding prevents special-character problems.
========================================================= */

const getEncodedProductInputId = (productId) => {
  const config = validateConfig();

  const rawProductInputId =
    `${config.contentLanguage}~` +
    `${config.feedLabel}~` +
    `${productId}`;

  return Buffer.from(
    rawProductInputId,
    "utf8"
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

/* =========================================================
   UPDATE ONLY PRICE + STOCK

   Better for frequent changes.
========================================================= */

export const updatePriceAndAvailabilityOnGoogle =
  async (product) => {
    const config = validateConfig();

    const token = await getAccessToken();

    const encodedProductId =
      getEncodedProductInputId(product.id);

    const url =
      `${MERCHANT_API_BASE}/accounts/` +
      `${config.merchantId}/productInputs/` +
      `${encodedProductId}`;

    const body = {
      productAttributes: {
        price: {
          amountMicros: priceToMicros(
            product.price
          ),
          currencyCode: config.currency,
        },

        availability:
          Number(product.stock) > 0
            ? "IN_STOCK"
            : "OUT_OF_STOCK",
      },
    };

    try {
      const response = await axios.patch(
        url,
        body,
        {
          params: {
            dataSource: getDataSourceName(),

            updateMask:
              "productAttributes.price," +
              "productAttributes.availability",
          },

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          timeout: 30000,
        }
      );

      return response.data;
    } catch (error) {
      /*
        If product is not already in Merchant Center,
        do a full insert instead.
      */
      if (error?.response?.status === 404) {
        console.log(
          `Google product ${product.id} not found. Doing full sync...`
        );

        return syncProductToGoogle(product);
      }

      throw error;
    }
  };

/* =========================================================
   DELETE PRODUCT FROM GOOGLE
========================================================= */

export const deleteProductFromGoogle = async (
  product
) => {
  const config = validateConfig();

  const token = await getAccessToken();

  const encodedProductId =
    getEncodedProductInputId(product.id);

  const url =
    `${MERCHANT_API_BASE}/accounts/` +
    `${config.merchantId}/productInputs/` +
    `${encodedProductId}`;

  try {
    await axios.delete(url, {
      params: {
        dataSource: getDataSourceName(),
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },

      timeout: 30000,
    });

    return {
      success: true,
      productId: product.id,
    };
  } catch (error) {
    /*
      Product already missing from Google = okay.
    */
    if (error?.response?.status === 404) {
      return {
        success: true,
        productId: product.id,
        alreadyDeleted: true,
      };
    }

    throw error;
  }
};

/* =========================================================
   BULK SYNC PRODUCTS

   Processes 10 products at once instead of sending
   thousands of simultaneous requests.
========================================================= */

export const bulkSyncProductsToGoogle = async (
  products,
  concurrency = 10
) => {
  validateConfig();

  const results = [];

  for (
    let index = 0;
    index < products.length;
    index += concurrency
  ) {
    const batch = products.slice(
      index,
      index + concurrency
    );

    const batchResults = await Promise.all(
      batch.map(async (product) => {
        try {
          const googleResult =
            await syncProductToGoogle(product);

          return {
            productId: product.id,
            name: product.name,
            success: true,
            googleResource:
              googleResult?.name || null,
          };
        } catch (error) {
          return {
            productId: product.id,
            name: product.name,
            success: false,
            error:
              getMerchantErrorMessage(error),
          };
        }
      })
    );

    results.push(...batchResults);
  }

  const successful = results.filter(
    (item) => item.success
  );

  const failed = results.filter(
    (item) => !item.success
  );

  return {
    total: products.length,
    successful: successful.length,
    failed: failed.length,
    results,
  };
};