import React from 'react';

interface Borrowing {
  id: number;
  bookTitle: string;
  borrowDate: string;
  returnDate?: string;
  returned: boolean;
}

interface BorrowingsProps {
  borrowings: Borrowing[];
}

const Borrowings: React.FC<BorrowingsProps> = ({ borrowings }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Borrowings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {borrowings.map((borrowing) => (
            <div
              key={borrowing.id}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{borrowing.bookTitle}</h3>
              <p className="text-gray-600 mb-1">Borrow Date: {borrowing.borrowDate}</p>
              {borrowing.returnDate && <p className="text-gray-600 mb-4">Return Date: {borrowing.returnDate}</p>}
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                borrowing.returned
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {borrowing.returned ? 'Returned' : 'Borrowed'}
              </span>
              {!borrowing.returned && (
                <button className="ml-2 bg-accent hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors mt-2">
                  Return Book
                </button>
              )}
            </div>
          ))}
        </div>
        {borrowings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No borrowings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Borrowings;