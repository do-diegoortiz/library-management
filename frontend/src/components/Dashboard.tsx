import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface DashboardData {
  total_books?: number;
  total_borrowed?: number;
  books_due_today?: number;
  overdue_borrowings?: any[];
  members_with_overdue?: any[];
  borrowed_books?: any[];
  overdue_books?: any[];
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/dashboards', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {user?.role === 'librarian' ? (
        <div>
          <h3>Librarian Dashboard</h3>
          <p>Total Books: {data.total_books}</p>
          <p>Total Borrowed: {data.total_borrowed}</p>
          <p>Books Due Today: {data.books_due_today}</p>
          <h4>Overdue Borrowings</h4>
          <ul>
            {data.overdue_borrowings?.map((borrowing: any) => (
              <li key={borrowing.id}>
                Book: {borrowing.book.title} - User: {borrowing.user.email} - Due: {borrowing.due_date}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>Member Dashboard</h3>
          <h4>Borrowed Books</h4>
          <ul>
            {data.borrowed_books?.map((book: any) => (
              <li key={book.id}>
                {book.title} - Due: {book.borrowings[0]?.due_date} - {book.borrowings[0]?.overdue ? 'Overdue' : 'Active'}
              </li>
            ))}
          </ul>
          <h4>Overdue Books</h4>
          <ul>
            {data.overdue_books?.map((book: any) => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;