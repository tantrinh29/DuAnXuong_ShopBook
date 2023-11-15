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

  const slug = req.body.slugProduct;
  const quantity = Number(req.body.quantity || 1);

  Product.findOne({ slugProduct: slug })
    .then((product) => {
      if (!product) {
        return res.status(400).json({ message: "Không tìm thấy sản phẩm" });
      }

      let cart = req.session.cart;
      // Nếu giỏ hàng không tồn tại thì tạo mới
      if (!cart) {
        cart = { item: {}, totalQuantity: 0, totalPrice: 0 };
      }
      // +1 và đoạn này khó
      if (cart.item[product._id]) {
        cart.item[product._id].quantity += quantity;
        cart.totalQuantity += quantity;
        cart.totalPrice += Number(product.price) * quantity;
      } else {
        // Thêm mới sản phẩm vào giỏ hàng
        cart.item[product._id] = {
          item: product,
          quantity: quantity,
        };
        cart.totalQuantity += quantity;
        cart.totalPrice += Number(product.price) * quantity;
      }
      req.session.cart = cart;
      return res.status(200).json({
        status: true,
        message: "Thêm Sản Phẩm Thành Công",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        status: false,
        message: "Thêm Sản Phẩm Thất Bại",
      });
    });
  

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
  for (const key in cart.item) {
    products.push(cart.item[key]);
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
    const cartItems = Object.keys(carts.item);
    let totalQuantity = 0;
    let totalPrice = 0;

    // sản phẩm có id trùng với id được truyền vào
    for (let itemId of cartItems) {
      const productToUpdate = carts.item[itemId];
      console.log("Item : ", carts.item);
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
    const cartItems = Object.keys(carts.item);

    for (let itemId of cartItems) {
      if (itemId == deleteIDProduct) {
        const productToDelete = carts.item[itemId];
        carts.totalPrice -=
          productToDelete.item.price * productToDelete.quantity;
        carts.totalQuantity -= productToDelete.quantity;
        delete carts.item[itemId];

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

  const categories = await Category.find({});

  const cart = req.session.cart;
  const email = req.session.email;

  if (!cart) {
    return res.render("checkout", {
      products: [],
      userOrder: {},
      totalPrice: 0,
      categories: categories,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      const userOrder = {
        fullname: user.fullname,
        email: user.email,
      };

      const products = [];
      if (cart && cart.item && Object.keys(cart.item).length !== 0) {
        for (const key in cart.item) {
          products.push(cart.item[key]);
        }
      }

      res.render("checkout", {
        categories: categories,
        products: products,
        totalPrice: cart.totalPrice,
        userOrder: userOrder,
      });
    })
    .catch((err) => {
      console.log(err);
    });

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
