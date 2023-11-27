const User = require("../models/user");
const random = require("random-token");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.createUser = (req, res, next) => {
  const { fullname, password, repassword, email } = req.body;
  if (fullname == "" || password == "" || repassword == "" || email == "") {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } else {
    if (password !== repassword) {
      return res
        .status(200)
        .json({ status: false, message: "Mật khẩu nhập lại không khớp!" });
    } else {
      // Mã hóa mật khẩu
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Có lỗi xảy ra trong quá trình mã hóa mật khẩu",
          });
        }
        var token = random(24);
        const users = new User({
          fullname,
          password: hash,
          email,
          token: token,
        });
        users
          .save()
          .then((result) => {
            res.status(201).json({
              status: true,
              message: "Đăng Ký Thành Công",
            });
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      });
    }
  }
};

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(200)
      .json({ status: false, message: "Không Được Để Trống" });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Tài khoản không tồn tại",
        });
      }

      // So sánh mật khẩu đã mã hóa với mật khẩu người dùng nhập vào
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: false,
            message: "Có lỗi xảy ra trong quá trình đăng nhập",
          });
        }
        console.log("Kết quả của bcrypt.compare:", result);

        if (result) {
          req.session.loggedin = true;
          req.session.email = email;
          res.locals.email = email;
          console.log(res.locals.email);
          return res.status(200).json({
            status: true,
            message: "Đăng nhập thành công",
          });
        } else {
          return res
            .status(200)
            .json({ status: false, message: "Đăng nhập thất bại" });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getForgotPassword = (req, res, next) => {
  res.render("auth/forgot-password");
};

exports.postForgotPassword = (req, res, next) => {
  const { email } = req.body;
  let resetToken; // Di chuyển khai báo lên đầu hàm

  // Tạo mã xác nhận (reset token)
  resetToken = crypto.randomBytes(20).toString("hex"); // Di chuyển gán giá trị vào đây

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.send(`
          <script>
            alert("Email không tồn tại. Vui lòng kiểm tra lại!");
            window.location.href = "/forgot-password";
          </script>
        `);
      }

      // Lưu mã xác nhận vào cơ sở dữ liệu
      user.resetToken = resetToken;
      return user.save();
    })
    .then((result) => {
      // Gửi email với mã xác nhận
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dinhtrinh5678@gmail.com ",
          pass: "oamdcbbrfbesdwdx",
        },
      });

      const mailOptions = {
        from: "dinhtrinh5678@gmail.com",
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `<p>Nhấn vào <a href="http://localhost:3333/reset-password/${resetToken}">đây</a> để đặt lại mật khẩu.</p>`,
      };

      return transporter.sendMail(mailOptions);
    })
    .then((info) => {
      res.send(`
      <script>
        alert("Email đã được gửi với hướng dẫn đặt lại mật khẩu. Đang chuyển hướng đến Gmail...");
        window.location.href = "https://mail.google.com/";
      </script>
    `);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
    });
};

exports.getResetPassword = (req, res, next) => {
  const resetToken = req.params.resetToken;

  // Kiểm tra tính hợp lệ của mã xác nhận
  User.findOne({
    resetToken: resetToken,
  })
    .then((user) => {
      console.log("User:", user); // Log giá trị user để kiểm tra
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "Mã xác nhận không hợp lệ" });
      }

      // Hiển thị trang để người dùng nhập mật khẩu mới
      res.render("auth/reset-password", { resetToken: resetToken });
    })
    .catch((err) => {
      res.status(500).json({ status: false, message: "Có lỗi xảy ra" });
    });
};

exports.postResetPassword = (req, res, next) => {
  const resetToken = req.body.resetToken;
  const newPassword = req.body.newPassword;

  if (!newPassword || newPassword.trim() === "") {
    return res
      .status(400)
      .json({ status: false, message: "Mật khẩu mới không hợp lệ" });
  }

  bcrypt
    .hash(newPassword, 10)
    .then((hashedPassword) => {
      console.log("hashedPassword", hashedPassword);
      return User.findOneAndUpdate(
        { resetToken: resetToken },
        { $set: { password: hashedPassword, resetToken: "" } },
        { new: true } 
      );
    })
    .then((updatedUser) => {
      console.log(updatedUser)
      if (!updatedUser) {
        return res
          .status(400)
          .json({ status: false, message: "Mã xác nhận không hợp lệ" });
      }

      // Gửi phản hồi thành công
      const script = `<script>alert("Đặt mật khẩu Thành Công"); window.location.href = '/login';</script>`;
      res.status(200).send(script);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({
          status: false,
          message: "Có lỗi xảy ra khi cập nhật mật khẩu",
        });
    });
};
