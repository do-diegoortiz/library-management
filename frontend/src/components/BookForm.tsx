import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface BookFormProps {
  book?: any;
  onSuccess?: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSuccess }) => {
  const { token, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: book ? book.title : '',
    author: book ? book.author : '',
    genre: book ? book.genre : '',
    isbn: book ? book.isbn : '',
    total_copies: book ? book.total_copies : '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = book ? `http://localhost:3000/api/v1/books/${book.id}` : 'http://localhost:3000/api/v1/books';
      const method = book ? 'put' : 'post';
      const response = await axios[method](url, {
        book: formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (onSuccess) {
        onSuccess();
      } else if (book) {
        navigate('/books');
      } else {
        setFormData({
          title: '',
          author: '',
          genre: '',
          isbn: '',
          total_copies: '',
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  if (!isLibrarian) {
    return <div>Access denied. Only librarians can manage books.</div>;
  }

  return (
    <div className="book-form">
      <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            required
          />
        </div>
        <div>
          <label>ISBN:</label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Total Copies:</label>
          <input
            type="number"
            value={formData.total_copies}
            onChange={(e) => setFormData({ ...formData, total_copies: e.target.value })}
            required
            min="0"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
        </button>
        {book && (
          <button type="button" onClick={() => navigate('/books')} disabled={loading}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default BookForm;