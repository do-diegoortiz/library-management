import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import BookList from './components/BookList';
import Borrowings from './components/Borrowings';
import Dashboard from './components/Dashboard';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'books' | 'borrowings'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (!user) {
    return authView === 'login' ? <Login onSwitchToSignup={() => setAuthView('signup')} /> : <Signup onSwitchToLogin={() => setAuthView('login')} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'books':
        return <BookList books={[]} />;
      case 'borrowings':
        return <Borrowings borrowings={[]} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Responsive Navigation Bar - hidden on mobile, flex on md+ */}
      <nav className="bg-white shadow-md hidden md:flex">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Library Management</h1>
            <div className="flex space-x-4">
              <button onClick={() => setCurrentView('dashboard')} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
              <button onClick={() => setCurrentView('books')} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Books</button>
              <button onClick={() => setCurrentView('borrowings')} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Borrowings</button>
              <button onClick={logout} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {renderView()}
      </main>
    </div>
  );
}

export default App;