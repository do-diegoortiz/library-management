class Api::V1::BorrowingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_borrowing, only: [ :show, :update ]

  def index
    if current_user.librarian?
      borrowings = Borrowing.all
    else
      borrowings = Borrowing.borrowed_by_user(current_user)
    end
    render json: borrowings, include: :book, status: :ok
  end

  def show
    render json: @borrowing, include: :book, status: :ok
  end

  def create
    if current_user.member?
      borrowing = Borrowing.new(borrowing_params)
      borrowing.user = current_user

      if borrowing.save
        render json: borrowing, include: :book, status: :created
      else
        render json: { errors: borrowing.errors.full_messages }, status: :unprocessable_content
      end
    else
      render json: { error: "Only members can borrow books" }, status: :forbidden
    end
  end

  def update
    if current_user.librarian?
      if @borrowing.update(returned: true, returned_date: Date.today)
        render json: @borrowing, include: :book, status: :ok
      else
        render json: { errors: @borrowing.errors.full_messages }, status: :unprocessable_content
      end
    else
      render json: { error: "Not authorized" }, status: :not_found
    end
  end

  private

  def borrowing_params
    params.require(:borrowing).permit(:book_id, :borrow_date)
  end

  def set_borrowing
    if current_user.librarian?
      @borrowing = Borrowing.find(params[:id])
    else
      @borrowing = Borrowing.borrowed_by_user(current_user).find(params[:id])
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Borrowing not found" }, status: :not_found
  end
end
