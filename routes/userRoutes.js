const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");

// GET /users - Admin only
router.get("/", verifyUser, verifyAdmin, controller.getUsers);

// POST /users - create user (testing helper, no auth)
router.post("/", controller.createUser);

// POST /login - returns JWT for given username
router.post("/login", controller.login);

module.exports = router;

