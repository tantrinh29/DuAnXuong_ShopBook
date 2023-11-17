const slug = require("url-slug");
const Category = require("../../models/category");

exports.listCategory = (req, res, next) => {
  Category.find({})
    .then((huyit) => res.render("admin/ListCategory", { showCategory: huyit }))
    .catch(next);
};

exports.addCategory = (req, res, next) => {
  
};

exports.updateCategory = (req, res, next) => {
  let cateId = req.params.cateId;
  let categoryName = req.body.categoryName;
  let categorySlug = slug(categoryName);
  Category.findById(cateId)
    .then((huyit) => {
      huyit.categoryName = categoryName;
      huyit.categorySlug = categorySlug;
      return huyit.save();
    })
    .then((result) => {
      res.status(200).json({
        status: "1",
        message: "Cập Nhật Danh Mục Thành Công",
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

exports.deleteCategory = (req, res, next) => {
  
};
