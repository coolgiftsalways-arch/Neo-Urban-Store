const CART_ID_KEY = "neoUrbanCartId";

const getCartId = () => {
  let cartId = localStorage.getItem(CART_ID_KEY);

  if (!cartId) {
    cartId = crypto.randomUUID();

    localStorage.setItem(
      CART_ID_KEY,
      cartId
    );
  }

  return cartId;
};

export default getCartId;