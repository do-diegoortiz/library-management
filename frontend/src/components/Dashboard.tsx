import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardData } from '../interfaces/DashboardInterfaces';

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-primary"></div>
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
      <div className="min-h-screen p-6 bg-gray-50">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
          <p className="text-gray-500">Placeholder for recent borrowings and returns.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">My Dashboard</h2>
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Borrowed Books</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboardData.borrowed_books?.map((borrowing) => (
              <div key={borrowing.id} className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="mb-2 text-xl font-semibold text-gray-900">{borrowing.book?.title}</h4>
                <p className="mb-1 text-gray-600">Due Date: {new Date(borrowing.due_date).toLocaleDateString()}</p>
              </div>
            )) || []}
          </div>
          {(!dashboardData.borrowed_books || dashboardData.borrowed_books.length === 0) && (
            <p className="text-gray-500">No borrowed books.</p>
          )}
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">Overdue Books</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboardData.overdue_books?.map((borrowing) => (
              <div key={borrowing.id} className="p-6 border border-red-200 rounded-lg shadow-md bg-red-50">
                <h4 className="mb-2 text-xl font-semibold text-red-900">{borrowing.book?.title}</h4>
                <p className="mb-1 text-red-600">Due Date: {new Date(borrowing.due_date).toLocaleDateString()}</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
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