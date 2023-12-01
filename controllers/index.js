const random = require("random-token");
const Product = require("../models/product");
const Comment = require("../models/comment");
const Order = require("../models/order");
const User = require("../models/user");
const Category = require("../models/category");
const VnPayModel = require("../models/vnpay");

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
    const slug = req.params.slug;
    const product = await Product.findOne({ slugProduct: slug });
    const categories = await Category.find({});
    const products = await Product.find({});
    const comments = await Comment.find({
      slugProduct: slug, // Bình luận theo slug của sản phẩm
    });
    // console.log("Comments : ", comments);

    res.render("detail", {
      detailProducts: product,
      comments: comments,
      products: products,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
};

// get slug category

exports.getProductOfCategory = async (req, res) => {
  try {
    const slugCate = req.params.slug;
    const productOfCategory = await Product.find({ categoryName: slugCate });
    const categories = await Category.find({});

    if (!productOfCategory) {
      res.status(404).render("404", { pageTitle: "Không tìm thấy sản phẩm" });
    } else {
      res.render("categories", {
        products: productOfCategory,
        categories: categories,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// post comment

exports.postComment = async (req, res) => {
  if (!req.session.loggedin) {
    return res
      .status(200)
      .json({ status: false, message: "Vui Lòng Đăng Nhập Để Tiếp Tục" });
  } else {
    if (req.body.star == "" || req.body.message == "") {
      res.status(200).json({ status: false, message: "Không Được Để Trống" });
    } else {
      const commentLenght = await Comment.count({
        email: req.session.email,
      });
      console.log(
        "Tổng Comment Của Email : ",
        req.session.email,
        "Là : ",
        commentLenght
      );
      if (commentLenght >= 5) {
        res.json({ status: false, message: "Bình Luận Quá 5 Lần !" });
      } else {
        const comment = new Comment({
          email: req.session.email,
          rating: req.body.star,
          comment: req.body.message,
          slugProduct: req.body.slugProduct,
        });
        comment
          .save()
          .then((result) => {
            // console.log(result);
            res.json({ status: true, message: "Bình Luận Thành Công" });
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ status: false, message: "Lỗi Bình Luận Ròi" });
          });
      }
    }
  }
};

// update comment

exports.updateComment = (req, res, next) => {
  if (!req.session.loggedin) {
    return res.status(200).json({
      status: false,
      message: "Vui Lòng Đăng Nhập Để Tiếp Tục",
    });
  }

  if (req.body.editlistcomment == "") {
    return res.status(200).json({
      status: false,
      message: "Không Được Để Trống",
    });
  }

  Comment.findOne({ _id: req.body.idEditComment, email: req.session.email })
    .then((comment) => {
      if (null) {
        return res.status(200).json({
          status: false,
          message: "Không Tìm Thấy Bình Luận",
        });
      } else {
        comment.comment = req.body.editlistcomment;
        return comment.save();
      }
    })
    .then(() => {
      return res.status(200).json({
        status: true,
        message: "Cập Nhật Bình Luận Thành Công",
      });
    })
    .catch((err) => {
      // console.log(err);
      return res.status(200).json({
        status: false,
        message: "Không Được Edit Bình Luận Của Người Ta!",
      });
    });
};

// delete comment

exports.deleteComment = (req, res) => {
  if (!req.session.loggedin) {
    return res.status(200).json({
      status: false,
      message: "Vui Lòng Đăng Nhập Để Tiếp Tục",
    });
  }
  // console.log(req.body.idDeleteComment);
  // console.log(req.session.email);
  Comment.findOne({ _id: req.body.idDeleteComment, email: req.session.email })
    .then((comment) => {
      console.log(comment); // output : null
      if (null) {
        return res.status(200).json({
          status: false,
          message: "Không Tìm Thấy Bình Luận",
        });
      }

      return Comment.deleteOne({ _id: comment._id });
    })
    .then(() => {
      return res.status(200).json({
        status: true,
        message: "Xóa Bình Luận Thành Công",
      });
    })
    .catch((err) => {
      // console.log('cc',err);
      return res.status(200).json({
        status: false,
        message: "Không Được Xóa Bình Luận Của Người Ta!",
      });
    });
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
        cart = { huydev: {}, totalQuantity: 0, totalPrice: 0 };
      }
      // +1 và đoạn này khó
      if (cart.huydev[product._id]) {
        cart.huydev[product._id].quantity += quantity;
        cart.totalQuantity += quantity;
        cart.totalPrice += Number(product.price) * quantity;
      } else {
        // Thêm mới sản phẩm vào giỏ hàng
        cart.huydev[product._id] = {
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
      if (cart && cart.huydev && Object.keys(cart.huydev).length !== 0) {
        for (const key in cart.huydev) {
          products.push(cart.huydev[key]);
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

const createVnpayPayment = async (orderData) => {

  try {
    const result = await VnPayModel.create({
      vnp_Amount: orderData.vnp_Amount,
      vnp_BankTranNo: orderData.vnp_BankCode,
      vnp_TransactionNo: orderData.vnp_BankTranNo,
    });

    return result._id;
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán Vnpay:", error);
    throw error;
  }
};

const createOrder = async (
  email,
  productsList,
  cart,
  vnpayID,
  paymentMethod,
  address,
  phone,
  comment
) => {
  try {
    const orderData = new Order({
      emailOrder: email,
      codeOrder: random(5).toUpperCase(),
      products: productsList,
      totalPrice: cart.totalPrice || 0,
      status: "Processed",
      paymentMethod: paymentMethod,
      vnpayID: vnpayID,
      address: address,
      phone: phone,
      comment: comment,
    });
    await orderData.save();
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};
exports.orderCart = async (req, res) => {
  const { email, cart, address, phone, comment } = req.session;
  console.log(req.body);
  try {
    const productsList = Object.values(cart.huydev);
    const vnpayID =
      req.body.paymentMethod === "vnpay"
        ? await createVnpayPayment({
            vnp_Amount: req.body.vnpAmount,
            vnp_BankCode: req.body.vnpBankCode,
            vnp_BankTranNo: req.body.vnpTransactionNo,
          })
        : null;
    await createOrder(
      email,
      productsList,
      cart,
      vnpayID,
      req.body.paymentMethod,
      address,
      phone,
      comment
    );

    // Xóa giỏ hàng sau khi đặt hàng thành công
    req.session.cart = {};
    
    return res.status(200).json({
      status: true,
      message: `Đặt Hàng Với Email [${email}] Thành Công`,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: false,
      message: `Đã có lỗi xảy ra trong quá trình đặt hàng.`,
    });
  }
};

// list order
exports.getListOrder = async (req, res) => {
  const categories = await Category.find({});
  const email = req.session.email;
  Order.find({ emailOrder: email })
    .then((order) => {
      // order.products.forEach((product) => {
      //   console.log("Tên sản phẩm:", product.item.title);
      //   console.log("Số lượng:", product.quantity);
      //   console.log("Giá:", product.item.price * product.quantity);
      // });
      res.render("listOrder", { orders: order, categories: categories });
      console.log(order);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDetailOrder = async (req, res, next) => {
  const categories = await Category.find({});

  const codeOrder = req.params.codeOrder;
  Order.findOne({ codeOrder: codeOrder })
    .then((huydev) => {
      res.render("listDetailOrder.ejs", {
        detailOrders: huydev,
        categories: categories,
      });
      console.log(huydev);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStatusComplete = (req, res, next) => {
  const idOrder = req.params.id;
  Order.findById(idOrder)
    .then((huyit) => {
      huyit.status = "Complete";
      return huyit.save();
    })
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Nhận Hàng Thành Công",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};