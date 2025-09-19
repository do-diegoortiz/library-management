import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Borrowing {
  id: number;
  user: { id: number; email: string };
  book: { id: number; title: string; author: string };
  borrow_date: string;
  due_date: string;
  returned: boolean;
  overdue?: boolean;
}

const Borrowings: React.FC = () => {
  const { user, token } = useAuth();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await axios.get<Borrowing[]>('http://localhost:3000/api/v1/borrowings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBorrowings(response.data);
      } catch (err) {
        setError('Failed to fetch borrowings');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBorrowings();
    }
  }, [token]);

  if (loading) return <div>Loading borrowings...</div>;
  if (error) return <div>Error: {error}</div>;

  const userBorrowings = user?.role === 'member'
    ? borrowings.filter(b => b.user.id === user.id)
    : borrowings;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {user?.role === 'librarian' ? 'All Borrowings' : 'My Borrowings'}
        </h2>

        {userBorrowings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No borrowings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBorrowings.map((borrowing) => (
              <div key={borrowing.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {borrowing.book.title} by {borrowing.book.author}
                  </h3>
                  {user?.role === 'librarian' && (
                    <p className="text-sm text-gray-600 mb-1">User: {borrowing.user.email}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    Borrowed: {new Date(borrowing.borrow_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Due: {new Date(borrowing.due_date).toLocaleDateString()}
                  </p>
                  <p className={`text-sm font-medium ${
                    borrowing.returned
                      ? 'text-green-600'
                      : borrowing.overdue
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}>
                    Status: {borrowing.returned ? 'Returned' : (borrowing.overdue ? 'Overdue' : 'Active')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Borrowings;