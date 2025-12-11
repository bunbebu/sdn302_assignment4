import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchQuizzes } from '../slices/quizSlice';
import api from '../api';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state) => state.quiz);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', newQuiz);
      setMessage('Quiz created successfully!');
      setNewQuiz({ title: '', description: '' });
      setShowQuizForm(false);
      dispatch(fetchQuizzes());
    } catch (error) {
      setMessage('Error creating quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/quizzes/${id}`);
        dispatch(fetchQuizzes());
      } catch (error) {
        alert('Error deleting quiz');
      }
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {message && <div className="alert alert-info">{message}</div>}
      
      <div className="my-4">
        <button className="btn btn-primary" onClick={() => setShowQuizForm(!showQuizForm)}>
          {showQuizForm ? 'Cancel' : 'Create New Quiz'}
        </button>
      </div>

      {showQuizForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Create Quiz</h4>
            <form onSubmit={handleCreateQuiz}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Save Quiz</button>
            </form>
          </div>
        </div>
      )}

      <h3>Manage Quizzes</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>
              <td>{quiz.description}</td>
              <td>
                <Link to={`/admin/quiz/${quiz._id}`} className="btn btn-info btn-sm me-2">
                  Manage Questions
                </Link>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
