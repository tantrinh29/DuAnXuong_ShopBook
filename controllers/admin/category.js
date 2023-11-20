const slug = require("url-slug");
const Category = require("../../models/category");

exports.listCategory = (req, res, next) => {
  Category.find({})
    .then((huyit) => res.render("admin/ListCategory", { showCategory: huyit }))
    .catch(next);
};

exports.addCategory = (req, res, next) => {
  let categoryName = req.body.categoryName;
  let categorySlug = slug(categoryName);
  if (categoryName == "") {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } 
  else {
    const cate = new Category({
      categoryName,
      categorySlug,
    });
    console.log("Category : ", cate);
    cate
      .save()
      .then((result) => {
        res.status(201).json({
          status: true,
          message: "Thêm Danh Mục Thành Công",
          category: result,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.updateCategory = (req, res, next) => {};

exports.deleteCategory = (req, res, next) => {};
