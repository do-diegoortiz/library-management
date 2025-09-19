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
- Node.js (v16+) and npm
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
   rails server -p 3000
   ```
   The API will be available at http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The frontend will be available at http://localhost:3001

## Localhost Testing

To test the full system locally:

1. Ensure both backend (Rails on port 3000) and frontend (React on 3001) are running as per setup.
2. Open http://localhost:3001 in your browser.
3. Login with demo credentials (librarian or member).
4. Test flows:
   - Librarian: Add/edit/delete books via BookForm, view dashboard stats/overdues.
   - Member: Search/browse books, borrow available ones, check personal dashboard.
   - Integration: Borrow a book → Verify availability updates in backend (check via API or console).
5. API Testing: Use curl/Postman for endpoints, e.g.:
   ```
   curl -X POST http://localhost:3000/api/v1/auth/sign_in \
     -H "Content-Type: application/json" \
     -d '{"user":{"email":"librarian@example.com","password":"password"}}'
   ```
6. Run tests: Backend `bundle exec rspec`; Frontend `cd frontend && npm test`.

If CORS errors, verify config/initializers/cors.rb allows localhost:3001.

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

## Debugging

### Backend (Rails)

1. View logs: `tail -f log/development.log`.
2. Rails console: `rails c` – Test models/queries, e.g., `Book.all`.
3. Debug gem: Add `debugger` in code, run server, interact via console.
4. DB queries: `rails dbconsole` or enable logging in console.
5. Tests: `rspec spec/`; Security: `bin/brakeman`.

### Frontend (React)

1. Browser DevTools: Console for errors, Network for API calls.
2. React DevTools extension: Inspect components/props/state.
3. Logging: Add `console.log` in hooks/components.
4. VS Code debugger: Breakpoints in .tsx files.
5. Tests: `npm test`.

Common: Check proxy in package.json for API calls; verify JWT tokens.

## Style Improvements Guide

Current UI is basic; enhance for better UX.

### Identification

- Inspect components: Plain lists/forms in BookList, Dashboard, Login.
- Audit: Use Lighthouse for accessibility/performance; test responsiveness.
- Issues: No themes, grids, icons; default browser styles.

### Application

1. Add global theme in index.css (CSS variables for colors/fonts).
2. Per-component: Use Tailwind (install via npm) or custom CSS modules.
   - Login: Card layout with padding, styled inputs/buttons.
   - BookList: Grid cards for books, flex search form.
   - Dashboard: Stat cards, tables for lists; color-code overdues.
3. Tools: Tailwind IntelliSense, Prettier; add react-icons.
4. Test: Hot reload, mobile emulation.

Backup with git before changes.

## Deployment

Uses Kamal for Docker-based deployment to VPS.

### Prerequisites

- VPS (e.g., DigitalOcean) with Docker, SSH.
- Domain pointed to VPS IP.
- Docker Hub account.

### Configuration

Edit config/deploy.yml:

- image: your-docker/library_management
- servers: VPS IP
- proxy host: yourdomain.com
- registry username/password (use secrets).

Create .kamal/secrets:

- KAMAL_REGISTRY_PASSWORD=token
- LIBRARY_MANAGEMENT_DATABASE_PASSWORD=pass
- RAILS_MASTER_KEY=from credentials

External DB recommended (e.g., RDS).

### Steps

1. bundle install (for kamal).
2. kamal init/setup (provisions server).
3. cd frontend && npm run build (for static assets).
4. kamal deploy (builds/pushes image, deploys).
5. kamal app exec bin/rails db:migrate db:seed (if needed).
6. Access: https://yourdomain.com

Alternatives: Heroku (git push), Render (Docker).

Logs: kamal logs; Rollback: kamal rollback.

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
