const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");

// GET /questions - Authenticated users
router.get("/", verifyUser, questionController.getQuestions);

// GET /questions/:id - Authenticated users
router.get("/:id", verifyUser, questionController.getQuestionById);

// POST /questions - Admin only
router.post("/", verifyUser, verifyAdmin, questionController.createQuestion);

// PUT /questions/:id - Admin only
router.put("/:id", verifyUser, verifyAdmin, questionController.updateQuestion);

// DELETE /questions/:id - Admin only
router.delete("/:id", verifyUser, verifyAdmin, questionController.deleteQuestion);

module.exports = router;
