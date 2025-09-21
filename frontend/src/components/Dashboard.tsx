import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardData {
  total_books?: number;
  total_borrowed?: number;
  borrowed_books?: any[];
  overdue_books?: any[];
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

  const stats = user?.role === 'librarian' ? [
    { name: 'Total Books', value: dashboardData.total_books?.toString() || '0' },
    { name: 'Active Borrowings', value: dashboardData.total_borrowed?.toString() || '0' },
    { name: 'Available Copies', value: 'N/A' }, // Could calculate if needed
  ] : [
    { name: 'My Borrowed Books', value: dashboardData.borrowed_books?.length?.toString() || '0' },
    { name: 'Overdue Books', value: dashboardData.overdue_books?.length?.toString() || '0' },
    { name: 'Total Books', value: dashboardData.total_books?.toString() || '0' },
  ];


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
};

export default Dashboard;