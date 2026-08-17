import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
  try {
    const {
      cartId,
      productId,
      name,
      category,
      image,
      price,
      quantity,
    } = req.body;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const existing = await Cart.findOne({
      cartId,
      productId,
    });

    if (existing) {
      existing.quantity += Number(
        quantity || 1
      );

      await existing.save();

      return res.json(existing);
    }

    const cart = await Cart.create({
      cartId,
      productId,
      name,
      category,
      image,
      price,
      quantity: Number(quantity || 1),
    });

    res.status(201).json(cart);
  } catch (err) {
    console.error(
      "❌ ADD CART ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cartId } = req.query;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const cart = await Cart.find({
      cartId,
    });

    res.json(cart);
  } catch (err) {
    console.error(
      "❌ GET CART ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const {
      cartId,
      quantity,
    } = req.body;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const cart =
      await Cart.findOneAndUpdate(
        {
          _id: req.params.id,
          cartId,
        },
        {
          quantity:
            Number(quantity),
        },
        {
          new: true,
        }
      );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.json(cart);
  } catch (err) {
    console.error(
      "❌ UPDATE CART ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }axios.delete(`${API_URL}/api/cart/clear`)
};

export const deleteCart = async (
  req,
  res
) => {
  try {
    const { cartId } = req.query;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const deleted =
      await Cart.findOneAndDelete({
        _id: req.params.id,
        cartId,
      });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    console.error(
      "❌ DELETE CART ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE /api/cart/clear
export const clearCart = async (
  req,
  res
) => {
  try {
    const { cartId } = req.query;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const result =
      await Cart.deleteMany({
        cartId,
      });

    console.log(
      `🧹 Cart ${cartId} cleared: ${result.deletedCount} item(s)`
    );

    res.status(200).json({
      success: true,
      message:
        "Cart cleared successfully",
      deletedCount:
        result.deletedCount,
    });
  } catch (err) {
    console.error(
      "❌ CLEAR CART ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: err.message,
    });
  }
};
