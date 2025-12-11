const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify user token and load user info into req.user
exports.verifyUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("No authorization token provided");
      err.status = 401;
      return next(err);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Find user and attach to request
    const user = await User.findById(decoded.id);
    
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      err.status = 401;
      err.message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
      err.status = 401;
      err.message = "Token expired";
    } else {
      err.status = err.status || 500;
    }
    next(err);
  }
};

// Verify if user has Admin privileges
exports.verifyAdmin = (req, res, next) => {
  try {
    // verifyUser should be called before verifyAdmin in middleware chain
    // so req.user should be available
    if (!req.user) {
      const err = new Error("User authentication required");
      err.status = 401;
      return next(err);
    }

    // Check if user is admin
    if (req.user.admin === true) {
      next();
    } else {
      const err = new Error("You are not authorized to perform this operation!");
      err.status = 403;
      next(err);
    }
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

// Verify if user is the author of a question
exports.verifyAuthor = async (req, res, next) => {
  try {
    // verifyUser should be called before verifyAuthor in middleware chain
    if (!req.user) {
      const err = new Error("User authentication required");
      err.status = 401;
      return next(err);
    }

    const Question = require("../models/Question");
    const questionId = req.params.id || req.params.questionId;

    if (!questionId) {
      const err = new Error("Question ID is required");
      err.status = 400;
      return next(err);
    }

    // Find the question
    const question = await Question.findById(questionId);
    
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }

    // Check if user is the author
    // Compare ObjectIds - convert both to strings for comparison
    if (question.author && question.author.toString() === req.user._id.toString()) {
      next();
    } else {
      const err = new Error("You are not the author of this question");
      err.status = 403;
      next(err);
    }
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

