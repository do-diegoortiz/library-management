import React, { useState } from 'react';
import BookForm from './BookForm';
import { Book } from '../interfaces/Book';
import { Borrowing } from '../interfaces/Borrowing';
import { BookListProps } from '../interfaces/ComponentProps';

const BookList: React.FC<BookListProps> = ({ books, isLibrarian, onCreateBook, onUpdateBook, onDeleteBook, onBorrowBook, borrowings, search, setSearch }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleAddBook = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDeleteBook = async (book: Book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      await onDeleteBook(book.id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingBook) {
      await onUpdateBook(editingBook.id, data);
    } else {
      await onCreateBook(data);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Available Books</h2>
          {isLibrarian && (
            <button
              onClick={handleAddBook}
              className="px-4 py-2 font-medium text-white rounded-md bg-primary hover:bg-blue-700"
            >
              Add Book
            </button>
          )}
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="p-6 overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{book.title}</h3>
              <p className="mb-1 text-gray-600">Author: {book.author}</p>
              <p className="mb-1 text-gray-600">Genre: {book.genre || 'N/A'}</p>
              <p className="mb-1 text-gray-600">ISBN: {book.isbn}</p>
              <p className="text-gray-600">Available Copies: {book.available_copies}</p>
              {isLibrarian && (
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
              {!isLibrarian && book.available_copies > 0 && !borrowings.some(b => b.book_id === book.id && !b.returned) && (
                <div className="mt-4">
                  <button
                    onClick={() => onBorrowBook(book.id)}
                    className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Borrow
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {books.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No books available.</p>
          </div>
        )}
      </div>
      <BookForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialBook={editingBook}
      />
    </div>
  );
};

export default BookList;