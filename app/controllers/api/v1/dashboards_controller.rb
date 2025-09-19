class Api::V1::DashboardsController < ApplicationController
  before_action :authenticate_user!

  def index
    if current_user.librarian?
      dashboard_data = {
        total_books: Book.count,
        total_borrowed: Borrowing.where(returned: false).count,
        books_due_today: Borrowing.where(due_date: Date.today, returned: false).count,
        overdue_borrowings: Borrowing.overdue,
        members_with_overdue: User.joins(:borrowings).where(borrowings: { returned: false }).where(borrowings: { due_date: Date.today - 1..Date.today }).distinct
      }
    else
      dashboard_data = {
        borrowed_books: current_user.books,
        overdue_books: current_user.borrowings.overdue
      }
    end

    render json: dashboard_data, status: :ok
  end
end
