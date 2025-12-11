const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");

// GET /users - Admin only
router.get("/", verifyUser, verifyAdmin, controller.getUsers);

// 🚀 Đã sửa: POST /register - Route Đăng ký người dùng mới
// (Trước đây là POST /)
router.post("/register", controller.createUser);

// POST /login - returns JWT for given username
router.post("/login", controller.login);

module.exports = router;