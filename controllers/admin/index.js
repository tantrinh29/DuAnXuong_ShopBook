const Order = require("../../models/order");

// list order
exports.getListOrder = (req, res) => {
    Order.find({})
      .then((order) => {
        res.render("admin/ListOrder", { orders: order });
        console.log(order);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  
exports.getDetailOrder = (req, res, next) => {
    const codeOrder = req.params.codeOrder;
    Order.findOne({ codeOrder: codeOrder })
      .then((huydev) => {
        res.render("admin/DetailOrder", { detailOrders: huydev });
        console.log(huydev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
exports.updateOrder = (req, res, next) => {
    const idOrder = req.params.id;
    Order.findById(idOrder)
      .then((huyit) => {
        huyit.status = "Delivering";
        return huyit.save();
      })
      .then((result) => {
        res.status(200).json({
          status: true,
          message: "Giao Hàng Thành Công",
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  