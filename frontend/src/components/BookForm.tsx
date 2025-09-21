import React, { useState, useEffect } from 'react';
import { Book } from '../interfaces/Book';
import { BookFormData, BookFormErrors, BookFormProps } from '../interfaces/BookFormInterfaces';

const BookForm: React.FC<BookFormProps> = ({ isOpen, onClose, onSubmit, initialBook }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    total_copies: 1,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<BookFormErrors>({});

  useEffect(() => {
    if (initialBook) {
      setFormData({
        title: initialBook.title,
        author: initialBook.author,
        genre: initialBook.genre || '',
        isbn: initialBook.isbn,
        total_copies: initialBook.total_copies,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        total_copies: 1,
      });
    }
    setErrors({});
  }, [initialBook, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BookFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      const errorMessage = error.message.toLowerCase();
      const newErrors: BookFormErrors = {};
      if (errorMessage.includes('isbn')) {
        newErrors.isbn = 'ISBN must be unique';
      }
      if (errorMessage.includes('title')) {
        newErrors.title = 'Title is required';
      }
      if (errorMessage.includes('author')) {
        newErrors.author = 'Author is required';
      }
      if (errorMessage.includes('genre')) {
        newErrors.genre = 'Genre is invalid';
      }
      if (errorMessage.includes('total_copies')) {
        newErrors.total_copies = 'Total copies must be a number >= 0';
      }
      if (Object.keys(newErrors).length === 0) {
        newErrors.title = 'Validation failed'; // Fallback
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{initialBook ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.isbn && <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Total Copies</label>
            <input
              type="number"
              name="total_copies"
              value={formData.total_copies}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white rounded-md bg-primary hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (initialBook ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;