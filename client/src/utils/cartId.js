const getCartId = () => {
  let cartId = localStorage.getItem("neoUrbanCartId");

  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("neoUrbanCartId", cartId);
  }

  return cartId;
};

export default getCartId;