// controllers/addressController.js
const Address = require("../models/address");
const Category = require("../models/category");
const mongoose = require("mongoose");

exports.getUserAddresses = async (req, res) => {
  try {
    const categories = await Category.find({});
    const userId = req.session.userID; // Lấy User ID từ session
    console.log("User ID from session:", userId);
    const addresses = await Address.find({ user: userId });
    res.render("user-addresses", {
      addresses: addresses,
      categories: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAddressesPage = async (req, res) => {
  try {
    const categories = await Category.find({});
    // Lấy danh sách địa chỉ từ cơ sở dữ liệu
    const addresses = await Address.find().populate("user");
    res.render("addresses", { addresses, categories: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Trong phương thức thêm địa chỉ
exports.addAddress = async (req, res) => {
  try {
    // Lấy thông tin địa chỉ và User ID từ body của request
    const { street,commune,district, city, country } = req.body;
    const userId = req.session.userID;

    // Tạo đối tượng địa chỉ
    const newAddress = new Address({
      street,
      commune,
      district,
      city,
      country,
      user: userId, // Liên kết địa chỉ với User ID
    });

    // Lưu địa chỉ vào cơ sở dữ liệu
    await newAddress.save();

    res.redirect("/addresses"); // Chuyển hướng về trang quản lý địa chỉ
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getEditAddressPage = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const categories = await Category.find({});
    res.render("edit-address", { address, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Trong phương thức cập nhật địa chỉ sau khi sửa
exports.editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const { street,commune,district, city, country } = req.body;

    await Address.findByIdAndUpdate(addressId, {
      street,
      commune,
      district,
      city,
      country,
    });

    res.redirect('/user-addresses'); // Chuyển hướng sau khi cập nhật thành công
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Trong phương thức xóa địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    console.log("Deleting address with ID:", addressId);

    await Address.findOneAndDelete({ _id: addressId });

    res.redirect("/addresses");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


