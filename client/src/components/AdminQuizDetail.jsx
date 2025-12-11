import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizById } from '../slices/quizSlice';
import api from '../api';

const AdminQuizDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, loading } = useSelector((state) => state.quiz);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0
  });
  const [allQuestions, setAllQuestions] = useState([]);
  const [showExistingQuestions, setShowExistingQuestions] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizById(id));
    fetchAllQuestions();
  }, [dispatch, id]);

  const fetchAllQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setAllQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions");
    }
  };

  const handleAddExistingQuestion = async (questionId) => {
    try {
      const currentQuestionIds = currentQuiz.questions.map(q => q._id);
      const updatedQuestionIds = [...currentQuestionIds, questionId];
      
      await api.put(`/quizzes/${id}`, { questions: updatedQuestionIds });
      dispatch(fetchQuizById(id));
      alert("Question added to quiz!");
    } catch (error) {
      alert("Failed to add question to quiz");
    }
  };

  const resetForm = () => {
    setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswerIndex: 0 });
    setEditingQuestionId(null);
    setShowQuestionForm(false);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestionId) {
        // Update existing question
        await api.put(`/questions/${editingQuestionId}`, questionForm);
        alert('Question updated successfully');
      } else {
        // Create new question
        await api.post(`/quizzes/${id}/question`, questionForm);
        alert('Question added successfully');
      }
      resetForm();
      dispatch(fetchQuizById(id));
    } catch (error) {
      alert('Error saving question');
    }
  };

  const handleEditClick = (question) => {
    setQuestionForm({
      text: question.text,
      options: [...question.options],
      correctAnswerIndex: question.correctAnswerIndex
    });
    setEditingQuestionId(question._id);
    setShowQuestionForm(true);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleDeleteQuestion = async (questionId) => {
      if(window.confirm("Delete this question?")) {
          try {
              await api.delete(`/questions/${questionId}`);
              dispatch(fetchQuizById(id));
          } catch (err) {
              alert("Failed to delete question");
          }
      }
  }

  if (loading || !currentQuiz) return <div>Loading...</div>;

  return (
    <div className="container">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin')}>Back to Dashboard</button>
      <h2>Manage Quiz: {currentQuiz.title}</h2>
      
      <div className="my-4 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => {
          if (showQuestionForm && !editingQuestionId) {
            setShowQuestionForm(false);
          } else {
            resetForm();
            setShowQuestionForm(true);
            setShowExistingQuestions(false);
          }
        }}>
          {showQuestionForm ? 'Cancel' : 'Create New Question'}
        </button>
        
        <button className="btn btn-success" onClick={() => {
            setShowExistingQuestions(!showExistingQuestions);
            setShowQuestionForm(false);
        }}>
            {showExistingQuestions ? 'Hide Question Bank' : 'Add Created Question'}
        </button>
      </div>

      {showExistingQuestions && (
        <div className="card mb-4">
            <div className="card-header bg-light">
                <h4 className="mb-0">Question Bank</h4>
            </div>
            <div className="card-body">
                <div className="list-group">
                    {allQuestions
                        .filter(q => !currentQuiz.questions.some(cq => cq._id === q._id))
                        .map(q => (
                        <div key={q._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{q.text}</strong>
                                <br />
                                <small className="text-muted">Options: {q.options.join(', ')}</small>
                            </div>
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleAddExistingQuestion(q._id)}
                            >
                                Add to Quiz
                            </button>
                        </div>
                    ))}
                    {allQuestions.filter(q => !currentQuiz.questions.some(cq => cq._id === q._id)).length === 0 && (
                        <p className="text-center text-muted my-3">No available questions to add.</p>
                    )}
                </div>
            </div>
        </div>
      )}

      {showQuestionForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>{editingQuestionId ? 'Edit Question' : 'Add Question'}</h4>
            <form onSubmit={handleSaveQuestion}>
              <div className="mb-3">
                <label className="form-label">Question Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Options</label>
                {questionForm.options.map((opt, index) => (
                  <div key={index} className="input-group mb-2">
                    <span className="input-group-text">Option {index + 1}</span>
                    <input
                      type="text"
                      className="form-control"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="form-label">Correct Answer (Option Number 1-4)</label>
                <select
                  className="form-select"
                  value={questionForm.correctAnswerIndex}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswerIndex: parseInt(e.target.value) })}
                >
                  {questionForm.options.map((_, index) => (
                    <option key={index} value={index}>Option {index + 1}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                {editingQuestionId ? 'Update Question' : 'Save Question'}
              </button>
            </form>
          </div>
        </div>
      )}

      <h3>Questions</h3>
      {currentQuiz.questions && currentQuiz.questions.length > 0 ? (
        <div className="list-group">
          {currentQuiz.questions.map((q, index) => (
            <div key={q._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h5>{index + 1}. {q.text}</h5>
                    <ul>
                        {q.options.map((opt, i) => (
                            <li key={i} className={i === q.correctAnswerIndex ? "text-success fw-bold" : ""}>
                                {opt}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(q)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No questions yet.</p>
      )}
    </div>
  );
};

export default AdminQuizDetail;
