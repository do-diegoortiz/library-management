import React from 'react';
import { Borrowing } from '../interfaces/Borrowing';
import { BorrowingsProps } from '../interfaces/ComponentProps';

const Borrowings: React.FC<BorrowingsProps> = ({ borrowings, isLibrarian, onReturnBook }) => {
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">My Borrowings</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {borrowings.map((borrowing) => (
            <div
              key={borrowing.id}
              className="p-6 bg-white rounded-lg shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{borrowing.bookTitle}</h3>
              <p className="mb-1 text-gray-600">Borrow Date: {borrowing.borrowDate}</p>
              {borrowing.returnDate && <p className="mb-4 text-gray-600">Return Date: {borrowing.returnDate}</p>}
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                borrowing.returned
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {borrowing.returned ? 'Returned' : 'Borrowed'}
              </span>
              {isLibrarian && !borrowing.returned && (
                <button
                  onClick={() => onReturnBook(borrowing.id)}
                  className="px-4 py-2 mt-2 ml-2 font-medium text-white transition-colors rounded-md bg-accent hover:bg-green-700"
                >
                  Return Book
                </button>
              )}
            </div>
          ))}
        </div>
        {borrowings.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No borrowings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Borrowings;