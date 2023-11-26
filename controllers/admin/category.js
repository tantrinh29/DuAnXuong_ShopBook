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
        const script = `<script>alert("Thêm Danh Mục Thành Công"); window.location.href = '/admin/category';</script>`;
      res.status(200).send(script);
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
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
      const script = `<script>alert("Sửa Danh Mục Thành Công"); window.location.href = '/admin/category';</script>`;
      res.status(200).send(script);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteCategory = (req, res, next) => {
  const cateId = req.params.cateId;
  Category.deleteOne({ _id: cateId })
    .then((post) => {
      if (post.deletedCount > 0) {
        // Include a script in the response to show an alert
        const script = `<script>alert("Xóa Danh Mục Thành Công"); window.location.href = '/admin/category';</script>`;
        res.status(200).send(script);
      } else {
        const error = new Error("Không tìm thấy Danh mục này");
        error.statusCode = 404;
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

