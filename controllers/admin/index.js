const Order = require("../../models/order");
const Product = require("../../models/product");
const Users = require("../../models/user");
const ExcelJS = require('exceljs');
exports.getAdmin = async (req, res) => {
    function formatNumber(num) {
        if (num == null) {
            return "0";
        }
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    const totalProduct = await Product.count({});
    const totalUsers = await Users.count({});
    const totalOrder = await Order.count({});
    const result = await Order.aggregate([
      {
        $group: {
            _id: null,
            totalPrice: { $sum: "$totalPrice" },
        },
    }, 
    ]);

    const totalPrice = result[0].totalPrice;

    return res.render("admin/index", {
        totalProduct: formatNumber(totalProduct),
        totalUsers: formatNumber(totalUsers),
        totalPrice: formatNumber(totalPrice),
        totalOrder: formatNumber(totalOrder),
    });
};
// list Users

exports.getListUser = (req, res) => {
    Users.find({})
        .then((users) => {
            res.render("admin/ListUsers", { listUsers: users });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.updateUser = (req, res, next) => {
    let userId = req.params.id;
    let level = req.body.level;
    let name = req.body.name;
    Users.findById(userId)
        .then((kietnt) => {
            kietnt.fullname = name;
            kietnt.level = level;
            return kietnt.save();
        })
        .then((result) => {
            res.status(200).json({
                status: "1",
                message: "Cập Nhật Thành Viên Thành Công",
                category: result,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};



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


exports.exportExcel = (req, res, next) => {
  const codeOrder = req.params.codeOrder;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Chi tiết đơn hàng');
  const columExcel = [
    { header: 'STT', key: 'id', width: 20 },
    { header: 'Mã đơn hàng', key: 'codeOrder', width: 10 },
    { header: 'Tên sản phẩm', key: 'title', width: 20 },
    { header: 'Số lượng', key: 'quantity', width: 15 },
    { header: 'Đơn giá', key: 'price', width: 15 },
    { header: 'Thành tiền', key: 'total', width: 15 },
    { header: 'Ghi chú', key: 'comment', width: 15 },
  ];
  Order.findOne({ codeOrder: codeOrder })
    .then((detailOrder) => {
      worksheet.columns = columExcel
      detailOrder?.products?.forEach((itemRow, index) => {
        let total = itemRow?.item.price * itemRow?.quantity
        worksheet.addRow({
          id: ++index,
          codeOrder: detailOrder?.codeOrder,
          title: itemRow?.item?.title,
          quantity: itemRow?.quantity,
          price: itemRow?.item?.price,
          total: total,
          comment: detailOrder?.comment
        })
      })
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent('Chi tiết đơn hàng')}.xlsx"`);
      return workbook.xlsx.write(res);
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
