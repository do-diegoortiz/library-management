const API_BASE = 'http://localhost:3000/api/v1'; // Adjust if backend port differs

// Utility functions
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.add('hidden');
  });
  document.getElementById(viewId).classList.remove('hidden');
}

function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
}

function clearError(elementId) {
  document.getElementById(elementId).textContent = '';
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Auth functions
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function login(email, password) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ user: { email, password } })
  }).then(data => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showView('login');
}

// Load initial view
document.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    showView('dashboard');
    loadDashboard();
  } else {
    showView('login');
  }

  // Login form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    clearError('loginError');

    try {
      await login(email, password);
      showView('dashboard');
      loadDashboard();
    } catch (error) {
      showError('loginError', error.message);
    }
  });

  // Logout
  document.getElementById('logout').addEventListener('click', logout);

  // Navigation
  document.getElementById('booksBtn').addEventListener('click', () => {
    showView('books');
    loadBooks();
  });

  document.getElementById('borrowingsBtn').addEventListener('click', () => {
    showView('borrowings');
    loadBorrowings();
  });

  // Add book button
  document.getElementById('addBookBtn').addEventListener('click', () => {
    document.getElementById('addBookForm').classList.remove('hidden');
  });

  // Cancel add book
  document.getElementById('cancelAdd').addEventListener('click', () => {
    document.getElementById('addBookForm').classList.add('hidden');
    document.getElementById('bookForm').reset();
  });

  // Add book form
  document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookData = {
      book: {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        available_copies: parseInt(document.getElementById('availableCopies').value)
      }
    };

    try {
      await apiCall('/books', {
        method: 'POST',
        body: JSON.stringify(bookData)
      });
      document.getElementById('addBookForm').classList.add('hidden');
      document.getElementById('bookForm').reset();
      loadBooks();
    } catch (error) {
      showError('booksError', error.message);
    }
  });
});

// Dashboard
async function loadDashboard() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const dashboardData = await apiCall('/dashboards');

    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
      <h2>Welcome, ${user.name || user.email}</h2>
      <div class="stats">
        <p>Total Books: ${dashboardData.total_books}</p>
        <p>Available Books: ${dashboardData.available_books}</p>
        <p>Active Borrowings: ${dashboardData.active_borrowings}</p>
      </div>
    `;
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

// Books
async function loadBooks() {
  try {
    const books = await apiCall('/books');
    const list = document.getElementById('booksList');
    list.innerHTML = books.map(book => `
      <div class="book-item">
        <div>
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>ISBN: ${book.isbn}</p>
          <p>Available Copies: ${book.available_copies}</p>
        </div>
        <div class="book-actions">
          <button onclick="borrowBook(${book.id})">Borrow</button>
          <button onclick="returnBook(${book.id})">Return</button>
          <!-- Edit/Delete buttons can be added if needed -->
        </div>
      </div>
    `).join('');
    clearError('booksError');
  } catch (error) {
    showError('booksError', error.message);
  }
}

async function borrowBook(bookId) {
  try {
    await apiCall(`/books/${bookId}/borrow`, { method: 'POST' });
    loadBooks();
  } catch (error) {
    showError('booksError', error.message);
  }
}

async function returnBook(bookId) {
  try {
    await apiCall(`/books/${bookId}/return`, { method: 'POST' });
    loadBooks();
  } catch (error) {
    showError('booksError', error.message);
  }
}

// Borrowings
async function loadBorrowings() {
  try {
    const borrowings = await apiCall('/borrowings');
    const list = document.getElementById('borrowingsList');
    list.innerHTML = borrowings.map(borrowing => `
      <div class="borrowing-item">
        <div>
          <h3>Book: ${borrowing.book_title}</h3>
          <p>Borrowed on: ${new Date(borrowing.borrowed_at).toLocaleDateString()}</p>
          <p>Due Date: ${new Date(borrowing.due_date).toLocaleDateString()}</p>
          <p>Returned: ${borrowing.returned ? 'Yes' : 'No'}</p>
        </div>
        <div class="borrowing-actions">
          ${!borrowing.returned ? `<button onclick="returnBorrowing(${borrowing.id})">Return</button>` : ''}
        </div>
      </div>
    `).join('');
    clearError('borrowingsError');
  } catch (error) {
    showError('borrowingsError', error.message);
  }
}

async function returnBorrowing(borrowingId) {
  try {
    await apiCall(`/borrowings/${borrowingId}/return`, { method: 'PUT' });
    loadBorrowings();
  } catch (error) {
    showError('borrowingsError', error.message);
  }
}