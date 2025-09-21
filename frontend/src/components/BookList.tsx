import React, { useState } from 'react';
import BookForm from './BookForm';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available_copies: number;
  genre?: string;
}

interface BookListProps {
  books: Book[];
  isLibrarian: boolean;
  onCreateBook: (data: any) => Promise<void>;
  onUpdateBook: (id: number, data: any) => Promise<void>;
  onDeleteBook: (id: number) => Promise<void>;
  search: string;
  setSearch: (search: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, isLibrarian, onCreateBook, onUpdateBook, onDeleteBook, search, setSearch }) => {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Available Books</h2>
          {isLibrarian && (
            <button
              onClick={handleAddBook}
              className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-1">Author: {book.author}</p>
              <p className="text-gray-600 mb-1">Genre: {book.genre || 'N/A'}</p>
              <p className="text-gray-600 mb-1">ISBN: {book.isbn}</p>
              <p className="text-gray-600">Available Copies: {book.available_copies}</p>
              {isLibrarian && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books available.</p>
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