import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizById } from '../slices/quizSlice';

const QuizDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, loading, error } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    currentQuiz.questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswerIndex) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!currentQuiz) return null;

  if (submitted) {
    return (
      <div className="container text-center mt-5">
        <h2>Quiz Completed!</h2>
        <h3>Your Score: {score} / {currentQuiz.questions.length}</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">{currentQuiz.title}</h2>
      {currentQuiz.questions.map((question, index) => (
        <div key={question._id} className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Question {index + 1}: {question.text}</h5>
            <div className="mt-3">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${question._id}`}
                    id={`q${question._id}-opt${optIndex}`}
                    checked={answers[question._id] === optIndex}
                    onChange={() => handleOptionChange(question._id, optIndex)}
                  />
                  <label className="form-check-label" htmlFor={`q${question._id}-opt${optIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button 
        className="btn btn-success mb-5" 
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== currentQuiz.questions.length}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizDetail;
