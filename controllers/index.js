const random = require("random-token");
const Product = require("../models/product");
const Comment = require("../models/comment");
const Order = require("../models/order");
const User = require("../models/user");
const Category = require("../models/category");

exports.getIndex = async (req, res) => {
  try {
    const categories = await Category.find({});
    const products = await Product.find({});
    res.render("index", { products: products, categories: categories });
  } catch (err) {
    console.log(err);
  }
};

exports.getDetail = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
  }
};

// get slug category

exports.getProductOfCategory = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
  }
};

// post comment

exports.postComment = async (req, res) => {
  
};

// update comment

exports.updateComment = (req, res, next) => {
  

  
};

// delete comment

exports.deleteComment = (req, res) => {
  
};

// add to cart

exports.addToCart = (req, res) => {
  
};

exports.viewCart = async (req, res) => {
  const categories = await Category.find({});

  const cart = req.session.cart;

  if (!cart) {
    return res.render("cart", {
      products: [],
      totalPrice: 0,
      categories: categories,
    });
  }

  const products = [];
  for (const key in cart.huydev) {
    products.push(cart.huydev[key]);
  }

  res.locals.products = products;
  req.session.totalPrice = cart.totalPrice;
  res.locals.totalPrice = cart.totalPrice;
  console.log(products);
  return res.render("cart", {
    categories: categories,
    products: products,
    totalPrice: cart.totalPrice,
  });
};

exports.updateCart = (req, res) => {
  const { idProduct, quantity } = req.body;
  const carts = req.session.cart;

  if (!carts) {
    return res.status(200).json({
      status: false,
      message: "Không Có Sản Phẩm Nào Ở Đây Huy Nha",
    });
  } else {
    const cartItems = Object.keys(carts.huydev);
    let totalQuantity = 0;
    let totalPrice = 0;

    // sản phẩm có id trùng với id được truyền vào
    for (let itemId of cartItems) {
      const productToUpdate = carts.huydev[itemId];
      console.log("Item : ", carts.huydev);
      console.log("Item ID", itemId);
      if (itemId == idProduct) {
        productToUpdate.quantity = quantity;
        totalQuantity += parseInt(quantity);
        totalPrice += parseInt(productToUpdate.item.price) * parseInt(quantity);
      } else {
        totalQuantity += parseInt(productToUpdate.quantity);
        totalPrice +=
          parseInt(productToUpdate.item.price) *
          parseInt(productToUpdate.quantity);
      }
    }

    // Update Money Quantity
    carts.totalQuantity = totalQuantity;
    carts.totalPrice = totalPrice;

    return res.status(200).json({
      status: true,
      message: `Cập Nhật Sản Phẩm Với ID [${idProduct}] Thành Công`,
    });
  }
};

exports.deleteCart = (req, res) => {
  const { deleteIDProduct } = req.body;
  const carts = req.session.cart;

  if (!carts) {
    return res.status(200).json({
      status: false,
      message: "Không Có Sản Phẩm Nào Ở Đây Huy Nha",
    });
  } else {
    const cartItems = Object.keys(carts.huydev);

    for (let itemId of cartItems) {
      if (itemId == deleteIDProduct) {
        const productToDelete = carts.huydev[itemId];
        carts.totalPrice -=
          productToDelete.item.price * productToDelete.quantity;
        carts.totalQuantity -= productToDelete.quantity;
        delete carts.huydev[itemId];

        return res.status(200).json({
          status: true,
          message: `Xóa Sản Phẩm Với ID [${deleteIDProduct}] Thành Công`,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Xóa Sản Phẩm Thất Bại`,
    });
  }
};

// show view session cart

exports.getviewCheckOut = async (req, res) => {
  
};

// odder
exports.orderCart = async (req, res) => {
  
};

// list order
exports.getListOrder = async (req, res) => {
  
};

exports.getDetailOrder = async (req, res, next) => {
  
};

exports.getStatusComplete = (req, res, next) => {
  
};
