const slug = require("url-slug");
const Comment = require("../../models/comment");
const Product = require("../../models/product");

exports.listComment = async (req, res, next) => {
  try {

    res.render("admin/ListComment", { showComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = (req, res, next) => {
  
};
