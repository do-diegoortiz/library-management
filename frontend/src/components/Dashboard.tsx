import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Borrowing {
  id: number;
  due_date: string;
  book: {
    title: string;
  };
}

interface DashboardData {
  total_books?: number;
  total_borrowed?: number;
  borrowed_books?: Borrowing[];
  overdue_books?: Borrowing[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/dashboards', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'librarian') {
    const stats = [
      { name: 'Total Books', value: dashboardData.total_books?.toString() || '0' },
      { name: 'Active Borrowings', value: dashboardData.total_borrowed?.toString() || '0' },
      { name: 'Available Copies', value: 'N/A' }, // Could calculate if needed
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <p className="text-gray-600 text-sm font-medium">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-gray-500">Placeholder for recent borrowings and returns.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h2>
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Borrowed Books</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.borrowed_books?.map((borrowing) => (
              <div key={borrowing.id} className="bg-white shadow-md rounded-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{borrowing.book?.title}</h4>
                <p className="text-gray-600 mb-1">Due Date: {new Date(borrowing.due_date).toLocaleDateString()}</p>
              </div>
            )) || []}
          </div>
          {(!dashboardData.borrowed_books || dashboardData.borrowed_books.length === 0) && (
            <p className="text-gray-500">No borrowed books.</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overdue Books</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.overdue_books?.map((borrowing) => (
              <div key={borrowing.id} className="bg-red-50 shadow-md rounded-lg p-6 border border-red-200">
                <h4 className="text-xl font-semibold text-red-900 mb-2">{borrowing.book?.title}</h4>
                <p className="text-red-600 mb-1">Due Date: {new Date(borrowing.due_date).toLocaleDateString()}</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              </div>
            )) || []}
          </div>
          {(!dashboardData.overdue_books || dashboardData.overdue_books.length === 0) && (
            <p className="text-gray-500">No overdue books.</p>
          )}
        </div>
      </div>
    );
  }
};

export default Dashboard;