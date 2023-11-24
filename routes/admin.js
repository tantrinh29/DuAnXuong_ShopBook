const express = require("express");
let router = express.Router();
const indexController = require("../controllers/admin/index");

// ====================== list orders  ====================== //

router.get("/listOrder", indexController.getListOrder);
router.get(
  "/detailOrder/:codeOrder",
  indexController.getDetailOrder
);
router.post("/updateOrder/:id",  indexController.updateOrder);
router.post("/deleteOrder/:id", indexController.deleteOrder);