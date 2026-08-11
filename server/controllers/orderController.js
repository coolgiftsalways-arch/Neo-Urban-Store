import Order from "../models/Order.js";
import Cart from "../models/cart.js";

export const placeOrder = async (req, res) => {

  try {

    const cart = await Cart.find();

    if(cart.length === 0){

      return res.status(400).json({
        message:"Cart is Empty"
      });

    }

    const subtotal = cart.reduce(

      (acc,item)=>

      acc + item.price * item.quantity,

      0

    );

    const shipping =
      subtotal > 499 ? 0 : 40;

    const tax =
      Math.round(subtotal * 0.05);

    const total =
      subtotal + shipping + tax;

    const order = await Order.create({

      ...req.body,

      items: cart,

      subtotal,

      shipping,

      tax,

      total,

    });

    await Cart.deleteMany();

    res.status(201).json(order);

  }

  catch(err){

    res.status(500).json(err);

  }

};