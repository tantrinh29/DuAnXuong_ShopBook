const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");
const indexController = require("../controllers/index");
const Category = require("../models/category");
const vnpayController = require("../controllers/vnpayControllers");

// check login
function checkLoggedIn(req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", indexController.getIndex);
router.get("/detail/:slug", indexController.getDetail);
router.post("/postComment", indexController.postComment);
router.post("/updateComment", indexController.updateComment);
router.post("/deleteComment", indexController.deleteComment);
router.post("/addToCart", indexController.addToCart);
router.get("/cart", indexController.viewCart);
router.post("/updateCart", indexController.updateCart);
router.post("/deleteCart", indexController.deleteCart);
router.get("/checkout", checkLoggedIn, indexController.getviewCheckOut);
router.post("/orderCart", indexController.orderCart);

router.get("/listOrder", checkLoggedIn, indexController.getListOrder);
router.get(
  "/detailOrder/:codeOrder",
  checkLoggedIn,
  indexController.getDetailOrder
);
router.get(
  "/statusOrder/:id",
  checkLoggedIn,
  indexController.getStatusComplete
);

router.get("/categories/:slug", indexController.getProductOfCategory);

router.get("/register", async (req, res, next) => {
  const categories = await Category.find({});
  res.render("auth/register", { categories: categories });
});

router.get("/login", async (req, res, next) => {
  const categories = await Category.find({});
  res.render("auth/login", { categories: categories });
});

router.get("/forgot-password", userController.getForgotPassword);
router.post("/forgot-password", userController.postForgotPassword);
router.get("/reset-password", userController.getResetPassword);
router.get("/reset-password/:resetToken", userController.getResetPassword);
router.post("/reset-password", userController.postResetPassword);

router.post("/postCreateUser", userController.createUser);
router.post("/postLoginUser", userController.loginUser);
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

// api vnpay
router.post("/orderPayment/:payment", vnpayController.orderPayment);

router.get("/ttonline", async (req, res, next) => {
  try {
    const categories = await Category.find({});
    
    const paymentMethod = req.query.paymentMethod || '';
    const vnpAmount = req.query.vnp_Amount || '';
    const vnpBankCode = req.query.vnp_BankCode || '';
    const vnpTransactionNo = req.query.vnp_TransactionNo || '';

    res.render("ttonline", {
      categories: categories,
      paymentMethod: paymentMethod,
      vnpAmount: vnpAmount,
      vnpBankCode: vnpBankCode,
      vnpTransactionNo: vnpTransactionNo,
    });
  } catch (error) {
    console.error("Lỗi truy vấn MongoDB:", error);
    next(error);
  }
});
module.exports = router;
