const Order = require("../../models/order");

// list order
exports.getListOrder = (req, res) => {
  Order.find({})
    .then((order) => {
      res.render("admin/ListOrder", { orders: order  });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDetailOrder = (req, res, next) => {
  const codeOrder = req.params.codeOrder;
  Order.findOne({ codeOrder: codeOrder })
    .then((detailOrder) => {
      res.render("admin/DetailOrder", { detailOrders: detailOrder });
    })
    .catch((err) => {
      console.log(err);
    });
};

// update status order
exports.updateOrder = (req, res, next) => {
  const idOrder = req.params.id;
  const {status} = req.body
  
  Order.findOneAndUpdate(
    { _id: idOrder },
    { $set: { status: status } },
    { new: true } 
  )
  .then((order) => {
    if (!order) {
      const error = new Error("Đơn hàng không được tìm thấy");
      error.statusCode = 404;
      throw error;
    }
    res.redirect('back');
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

// delete order
exports.deleteOrder = (req, res, next) => {
  const idOrder = req.params.id;
  Order.findOneAndDelete(
    { _id: idOrder },
    { new: true } 
  )
  .then((order) => {
    if (!order) {
      const error = new Error("Đơn hàng không được tìm thấy");
      error.statusCode = 404;
      throw error;
    }
    res.redirect('back');
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};