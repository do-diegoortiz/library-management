import React, { useState, useEffect, useCallback } from 'react';
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
  total_copies: number;
  genre?: string;
}

interface Borrowing {
  id: number;
  book_id: number;
  bookTitle: string;
  borrowDate: string;
  returnDate?: string;
  returned: boolean;
}

const API_BASE = 'http://localhost:3000/api/v1';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        errorMessage = errorData.errors.join(', ');
      }
    } catch (e) {
      // Ignore if can't parse
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

function App() {
  const { user, loading, logout, isLibrarian } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'books' | 'borrowings'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [borrowingsLoading, setBorrowingsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState(() => localStorage.getItem('bookSearch') || '');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    localStorage.setItem('bookSearch', search);
  }, [search]);

  useEffect(() => {
    fetchBooks(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (currentView === 'books' && user) {
      fetchBooks();
      fetchBorrowings();
    }
  }, [currentView, user]);

  useEffect(() => {
    if (currentView === 'borrowings' && user) {
      fetchBorrowings();
    }
  }, [currentView, user]);

  const fetchBooks = useCallback(async (search?: string) => {
    setBooksLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const url = `/books${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await apiCall(url);
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setBooksLoading(false);
    }
  }, []);

  const fetchBorrowings = async () => {
    setBorrowingsLoading(true);
    try {
      const data = await apiCall('/borrowings');
      const mappedData = data.map((borrowing: any) => ({
        id: borrowing.id,
        book_id: borrowing.book.id,
        bookTitle: borrowing.book.title,
        borrowDate: borrowing.borrow_date,
        returnDate: borrowing.returned_date,
        returned: borrowing.returned,
      }));
      setBorrowings(mappedData);
    } catch (error) {
      console.error('Failed to fetch borrowings:', error);
    } finally {
      setBorrowingsLoading(false);
    }
  };

  const createBook = async (bookData: any) => {
    await apiCall('/books', {
      method: 'POST',
      body: JSON.stringify({ book: bookData }),
    });
    await fetchBooks(); // Refresh
  };

  const updateBook = async (id: number, bookData: any) => {
    await apiCall(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ book: bookData }),
    });
    await fetchBooks(); // Refresh
  };

  const deleteBook = async (id: number) => {
    await apiCall(`/books/${id}`, {
      method: 'DELETE',
    });
    await fetchBooks(); // Refresh
  };

  const borrowBook = async (bookId: number) => {
    const borrowDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await apiCall('/borrowings', {
      method: 'POST',
      body: JSON.stringify({ borrowing: { book_id: bookId, borrow_date: borrowDate } }),
    });
    await fetchBooks(); // Refresh available copies
    await fetchBorrowings(); // Refresh user's borrowings
  };

  const returnBook = async (borrowingId: number) => {
    await apiCall(`/borrowings/${borrowingId}`, {
      method: 'PUT',
      body: JSON.stringify({ borrowing: { returned: true } }),
    });
    await fetchBooks(); // Refresh available copies
    await fetchBorrowings(); // Refresh borrowings list
  };

  const onSearchBook = useCallback((search: string) => {
    fetchBooks(search);
  }, [fetchBooks]);

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
          <BookList books={books} isLibrarian={isLibrarian} onCreateBook={createBook} onUpdateBook={updateBook} onDeleteBook={deleteBook} onBorrowBook={borrowBook} borrowings={borrowings} search={search} setSearch={setSearch} />
        );
      case 'borrowings':
        return borrowingsLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading borrowings...</p>
            </div>
          </div>
        ) : (
          <Borrowings borrowings={borrowings} isLibrarian={isLibrarian} onReturnBook={returnBook} />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Responsive Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Library Management</h1>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              <button onClick={() => setCurrentView('dashboard')} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
              <button onClick={() => setCurrentView('books')} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Books</button>
              <button onClick={() => setCurrentView('borrowings')} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Borrowings</button>
              <button onClick={logout} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Logout</button>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              ☰
            </button>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <button onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }} className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
              <button onClick={() => { setCurrentView('books'); setMobileMenuOpen(false); }} className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Books</button>
              <button onClick={() => { setCurrentView('borrowings'); setMobileMenuOpen(false); }} className="block text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Borrowings</button>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Logout</button>
            </div>
          )}
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