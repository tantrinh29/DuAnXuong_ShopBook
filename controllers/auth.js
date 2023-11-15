// Import các module và model cần thiết
const User = require("../models/user"); // Chắc chắn rằng đường dẫn đến model user là đúng
const random = require("random-token"); // Sử dụng để tạo token ngẫu nhiên
const bcrypt = require("bcrypt"); // Thư viện bcrypt để băm mật khẩu



// Hàm xử lý đăng nhập người dùng
exports.loginUser = (req, res, next) => {
  const { email, password } = req.body; // Lấy thông tin email và password từ request body

  // Kiểm tra xem email hoặc password có trống không
  if (email == "" || password == "") {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } else {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên email
    User.findOne({ email: email })
      .then((user) => {
        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
          return res.status(200).json({
            status: false,
            message: "Tài khoản không tồn tại",
          });
        }

        // So sánh mật khẩu đã băm từ yêu cầu với mật khẩu đã băm trong cơ sở dữ liệu
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            // Nếu mật khẩu khớp, đánh dấu người dùng đã đăng nhập và lưu thông tin email vào session
            req.session.loggedin = true;
            req.session.email = email;
            res.locals.email = email; // Lưu thông tin email vào biến locals của response
            console.log(res.locals.email);
            return res.status(200).json({
              status: true,
              message: "Đăng nhập thành công",
            });
          } else {
            // Nếu mật khẩu không khớp, trả về thông báo đăng nhập thất bại
            return res
              .status(200)
              .json({ status: false, message: "Đăng nhập thất bại" });
          }
        });
      })
      .catch((err) => {
        // Xử lý lỗi nếu có
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

