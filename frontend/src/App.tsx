import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import BookList from './components/BookList';
import Borrowings from './components/Borrowings';
import Dashboard from './components/Dashboard';
import { useAuth } from './contexts/AuthContext';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available_copies: number;
  genre?: string;
  total_copies?: number;
}

const API_BASE = 'http://localhost:3000/api/v1';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function App() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'books' | 'borrowings'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  useEffect(() => {
    if (currentView === 'books' && user) {
      fetchBooks();
    }
  }, [currentView, user]);

  const fetchBooks = async () => {
    setBooksLoading(true);
    try {
      const data = await apiCall('/books');
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setBooksLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (!user) {
    return authView === 'login' ? <Login onSwitchToSignup={() => setAuthView('signup')} /> : <Signup onSwitchToLogin={() => setAuthView('login')} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'books':
        return booksLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading books...</p>
            </div>
          </div>
        ) : (
          <BookList books={books} />
        );
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