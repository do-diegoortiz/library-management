# Library Management System

This is a full-stack library management system built with Ruby on Rails API backend and React frontend.

## Features

### Backend

- User authentication with Devise and JWT
- Role-based authorization (Librarian and Member)
- Book management (CRUD operations for librarians)
- Borrowing and returning books with availability tracking
- Search books by title, author, genre
- Dashboard for librarians (stats, overdue books) and members (their borrowings)
- RESTful API endpoints
- PostgreSQL database
- RSpec tests for models

### Frontend

- React with TypeScript
- Integration with Rails API
- Authentication and authorization handling
- Book CRUD operations
- Borrowing interface
- Dashboard views for different roles
- Responsive design

## Setup Instructions

### Prerequisites

- Ruby 3.4.6
- Node.js and npm
- PostgreSQL

### Backend Setup

1. Clone the repository
2. Navigate to the project root
3. Install gems:
   ```
   bundle install
   ```
4. Create and migrate database:
   ```
   rails db:create db:migrate
   ```
5. Seed the database with demo data:

   ```
   rails db:seed
   ```

   Demo credentials:

   - Librarian: librarian@example.com / password
   - Member: member@example.com / password

6. Start Rails server:
   ```
   rails server
   ```
   The API will be available at http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install additional dependencies:
   ```
   npm install react-router-dom axios
   ```
3. Start the development server:
   ```
   npm start
   ```
   The frontend will be available at http://localhost:3001

## API Endpoints

### Authentication

- POST /users/sign_in (login)
- POST /users/sign_up (register)

### Books

- GET /api/v1/books (list books, search with ?search=term&search_type=title/author/genre)
- GET /api/v1/books/:id (show book)
- POST /api/v1/books (create book - librarian only)
- PUT /api/v1/books/:id (update book - librarian only)
- DELETE /api/v1/books/:id (delete book - librarian only)

### Borrowings

- GET /api/v1/borrowings (list borrowings)
- POST /api/v1/borrowings (create borrowing - member)
- PUT /api/v1/borrowings/:id (return borrowing - librarian only)

### Dashboard

- GET /api/v1/dashboards (dashboard data based on user role)

## Architecture Overview

### Backend

- **Models**: User (with roles), Book, Borrowing
- **Controllers**: API::V1::BooksController, API::V1::BorrowingsController, API::V1::DashboardsController
- **Authentication**: Devise with JWT for API
- **Database**: PostgreSQL with associations between models
- **Testing**: RSpec for models and controllers

### Frontend

- **Routing**: React Router for navigation
- **State Management**: Context API for authentication state
- **API Integration**: Axios for HTTP requests
- **Components**: Login, BookList, BookForm, Dashboard

## Testing

Run backend tests:

```
bundle exec rspec
```

Run frontend tests:

```
cd frontend
npm test
```

## GenAI Tools Section

### Prompt for Task Management API

**Prompt:**
"Create a Ruby on Rails API for a simple task management system. The system should have User model with authentication, Task model with title, description, status (pending, in_progress, completed), and assigned_to user_id. Include CRUD operations for tasks with authorization (users can only manage their own tasks). Use Devise for authentication and RSpec for testing. Provide model validations, controller actions, routes, and basic test examples. Use PostgreSQL database. Make it RESTful with JSON responses and proper status codes."

**Generated Code Sample:**

I'll use this prompt with an AI tool to generate the code. For demonstration, here's what the generated code might look like:

**Model - Task:**

```ruby
class Task < ApplicationRecord
  belongs_to :user
  enum status: { pending: 0, in_progress: 1, completed: 2 }, default: :pending

  validates :title, presence: true, length: { maximum: 100 }
  validates :description, presence: true, length: { maximum: 500 }

  scope :for_user, ->(user) { where(user: user) }
end
```

**Controller - TasksController:**

```ruby
class Api::V1::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :update, :destroy]

  def index
    tasks = current_user.tasks
    render json: tasks, status: :ok
  end

  def create
    task = current_user.tasks.build(task_params)
    if task.save
      render json: task, status: :created
    else
      render json: { errors: task.errors }, status: :unprocessable_entity
    end
  end

  # ... other actions
end
```

**Validation and Improvement:**
The generated code looks good for a basic task management system. Improvements:

- Add timestamps to Task model
- Add due_date field
- Add authorization for admin users
- Add pagination to index
- Add more comprehensive tests including factory_bot examples

This demonstrates using AI to bootstrap a Rails API quickly, then iterating on the output to add features and improve code quality.

## Presentation Materials

### User Story

**As a Librarian, I want to:**

- Add, edit, delete books
- View all books and their availability
- View all borrowings and overdue items
- View dashboard with statistics

**As a Member, I want to:**

- View all books
- Search books by title, author, genre
- Borrow available books
- View my borrowed books and due dates
- View overdue books

### Architecture Diagrams

**Database Schema:**

- Users: id, email, role, password_digest
- Books: id, title, author, genre, isbn, total_copies, available_copies
- Borrowings: id, user_id, book_id, borrow_date, due_date, returned

**API Flow:**
Frontend -> API Endpoints -> Models -> Database

**Component Structure:**
App
├── Components
│ ├── Auth
│ ├── Books
│ ├── Borrowings
│ └── Dashboard
├── Services
│ └── ApiClient
└── Utils
└── AuthHelper

### Demo Flow

1. **Backend Demo:**

   - Start Rails server
   - Test API endpoints with Postman or curl
   - Login as librarian/member
   - Create/view books and borrowings

2. **Frontend Demo:**

   - Start React app
   - Login as different users
   - Browse books, search, borrow
   - View dashboard based on role

3. **End-to-End:**
   - Librarian adds a book
   - Member searches and borrows the book
   - Librarian views overdue items
   - Member views their dashboard

The system demonstrates role-based access control, database relationships, API integration, and responsive UI.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/yourusername/library_management.

## License

The application is available as open source under the terms of the MIT License.
