const Order = require("../../models/order");
const Product = require("../../models/product");
const Users = require("../../models/user");
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
  
};

exports.updateUser = (req, res, next) => {
  
};
// list order
exports.getListOrder = (req, res) => {
  
};

exports.getDetailOrder = (req, res, next) => {
  
};

exports.updateOrder = (req, res, next) => {
  
};
