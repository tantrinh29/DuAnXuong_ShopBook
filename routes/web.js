const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");
const indexController = require("../controllers/index");
const Category = require("../models/category");

// check login
function checkLoggedIn(req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", indexController.getIndex);

router.post("/addToCart", indexController.addToCart);
router.get("/cart", indexController.viewCart);
router.post("/updateCart", indexController.updateCart);
router.post("/deleteCart", indexController.deleteCart);
router.get("/checkout", checkLoggedIn, indexController.getviewCheckOut);












module.exports = router;
