const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { verifyUser, verifyAdmin } = require("../middleware/authenticate");

// GET all quizzes - Authenticated users
router.get("/", verifyUser, quizController.getQuizzes);

// GET quiz by id - Authenticated users
router.get("/:id", verifyUser, quizController.getQuizById);

// Requirement 3 → POPULATE theo keyword - Authenticated users
router.get("/:quizId/populate", verifyUser, quizController.populateQuizByKeyword);

// CREATE quiz - Admin only
router.post("/", verifyUser, verifyAdmin, quizController.createQuiz);

// UPDATE quiz - Admin only
router.put("/:id", verifyUser, verifyAdmin, quizController.updateQuiz);

// DELETE quiz - Admin only
router.delete("/:id", verifyUser, verifyAdmin, quizController.deleteQuiz);

// Requirement 4 → thêm 1 câu hỏi - Admin only
router.post("/:quizId/question", verifyUser, verifyAdmin, quizController.addSingleQuestionToQuiz);

// Requirement 5 → thêm nhiều câu hỏi - Admin only
router.post("/:quizId/questions", verifyUser, verifyAdmin, quizController.addMultipleQuestionsToQuiz);

module.exports = router;
