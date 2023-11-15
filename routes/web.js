const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");
const indexController = require("../controllers/index");
const Category = require("../models/category");



router.get("/", indexController.getIndex);

router.post("/addToCart", indexController.addToCart);
router.get("/cart", indexController.viewCart);
router.post("/updateCart", indexController.updateCart);
router.post("/deleteCart", indexController.deleteCart);
router.get("/checkout",  indexController.getviewCheckOut);












module.exports = router;
