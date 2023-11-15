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
  
};

exports.deleteCategory = (req, res, next) => {
  
};
