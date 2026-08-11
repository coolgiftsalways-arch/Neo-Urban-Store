import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const existing = await Cart.findOne({
      productId: req.body.productId,
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();

      return res.json(existing);
    }

    const cart = await Cart.create(req.body);

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find();

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        quantity: req.body.quantity,
      },
      { new: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};