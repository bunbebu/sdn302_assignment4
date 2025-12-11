const Question = require("../models/Question");

// GET /questions
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

// POST /questions
exports.createQuestion = async (req, res, next) => {
  try {
    // Set author from authenticated user (Admin)
    const question = new Question({
      ...req.body,
      author: req.user._id
    });
    await question.save();
    res.json(question);
  } catch (err) {
    next(err);
  }
};

// PUT /questions/:id
exports.updateQuestion = async (req, res, next) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /questions/:id
exports.deleteQuestion = async (req, res, next) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    next(err);
  }
};

//GET /questions/:id
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    next(err);
  }
};
