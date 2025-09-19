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
        const response = await axios.get<DashboardData>('http://localhost:3000/api/v1/dashboards', {
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {user?.role === 'librarian' ? (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Librarian Dashboard</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">📚</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Books</dt>
                        <dd className="text-lg font-medium text-gray-900">{data.total_books}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">📖</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Borrowed</dt>
                        <dd className="text-lg font-medium text-gray-900">{data.total_borrowed}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">⏰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Due Today</dt>
                        <dd className="text-lg font-medium text-gray-900">{data.books_due_today}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h4 className="text-lg leading-6 font-medium text-gray-900">Overdue Borrowings</h4>
              </div>
              <ul className="divide-y divide-gray-200">
                {data.overdue_borrowings?.map((borrowing: any) => (
                  <li key={borrowing.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {borrowing.book.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          User: {borrowing.user.email} | Due: {borrowing.due_date}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Member Dashboard</h3>

            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Borrowed Books</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {data.borrowed_books?.map((book: any) => (
                    <li key={book.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{book.title}</p>
                          <p className="text-sm text-gray-500">
                            Due: {book.borrowings[0]?.due_date}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.borrowings[0]?.overdue
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {book.borrowings[0]?.overdue ? 'Overdue' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Overdue Books</h4>
                </div>
                <ul className="divide-y divide-gray-200">
                  {data.overdue_books?.map((book: any) => (
                    <li key={book.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{book.title}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;