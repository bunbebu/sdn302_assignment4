const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// GET /quizzes
exports.getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find().populate("questions");
  res.json(quizzes);
};

// GET /quizzes/:id   ← ĐÃ THÊM
exports.getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate("questions");
  res.json(quiz);
};

// POST /quizzes
exports.createQuiz = async (req, res) => {
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.json(quiz);
};

// PUT /quizzes/:id
exports.updateQuiz = async (req, res) => {
  const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE /quizzes/:id
exports.deleteQuiz = async (req, res) => {
  // 1. Tìm quiz trước
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  // 2. Xóa tất cả questions thuộc quiz
  await Question.deleteMany({ _id: { $in: quiz.questions } });

  // 3. Xóa quiz
  await Quiz.findByIdAndDelete(req.params.id);

  res.json({ message: "Quiz and questions deleted" });
};

// GET /quizzes/:quizId/populate?keyword=capital
exports.populateQuizByKeyword = async (req, res) => {
  const keyword = "capital"; // cố định theo đề

  const quiz = await Quiz.findById(req.params.quizId).populate({
    path: "questions",
    match: { keywords: keyword }
  });

  res.json(quiz);
};

// POST /quizzes/:quizId/question → thêm 1 câu hỏi
exports.addSingleQuestionToQuiz = async (req, res) => {
  const newQuestion = await Question.create(req.body);

  const quiz = await Quiz.findById(req.params.quizId);
  quiz.questions.push(newQuestion._id);
  await quiz.save();

  res.json(newQuestion);
};

// POST /quizzes/:quizId/questions → thêm nhiều câu hỏi
exports.addMultipleQuestionsToQuiz = async (req, res) => {
  const createdQuestions = await Question.insertMany(req.body);

  const ids = createdQuestions.map(q => q._id);

  const quiz = await Quiz.findById(req.params.quizId);
  quiz.questions.push(...ids);
  await quiz.save();

  res.json(createdQuestions);
};
