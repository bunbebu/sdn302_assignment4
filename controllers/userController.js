const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /users - Admin only (middleware handles authorization)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// POST /users - quick helper to create a user (no auth for testing)
exports.createUser = async (req, res, next) => {
  try {
    const normalizeBool = value => {
      if (typeof value === "string") {
        const lowered = value.trim().toLowerCase();
        if (lowered === "true") return true;
        if (lowered === "false") return false;
      }
      return Boolean(value);
    };

    if (!req.body.username || !req.body.password) {
      const err = new Error("Username and password are required");
      err.status = 400;
      return next(err);
    }

    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      password: hashed,
      admin: normalizeBool(req.body.admin)
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};

// POST /login - simple login by username/password, returns JWT
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const err = new Error("Username and password are required");
      err.status = 400;
      return next(err);
    }

    const user = await User.findOne({ username });
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const match = await bcrypt.compare(password, user.password || "");
    if (!match) {
      const err = new Error("Invalid password or username!");
      err.status = 401;
      return next(err);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
};

