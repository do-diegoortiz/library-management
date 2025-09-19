class Api::V1::BooksController < ApplicationController
  before_action :authenticate_user!, except: [ :index, :show ]
  before_action :require_librarian, except: [ :index, :show ]
  before_action :set_book, only: [ :show, :update, :destroy ]

  def index
    books = Book.all
    if params[:search]
      if params[:search_type] == "title"
        books = books.search_by_title(params[:search])
      elsif params[:search_type] == "author"
        books = books.search_by_author(params[:search])
      elsif params[:search_type] == "genre"
        books = books.search_by_genre(params[:search])
      end
    end
    render json: books, status: :ok
  end

  def show
    render json: @book, status: :ok
  end

  def create
    book = Book.new(book_params)
    book.user = current_user if current_user.librarian?

    if book.save
      render json: book, status: :created
    else
      render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @book.update(book_params)
      render json: @book, status: :ok
    else
      render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @book.destroy
      render json: { message: "Book deleted successfully" }, status: :ok
    else
      render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def book_params
    params.require(:book).permit(:title, :author, :genre, :isbn, :total_copies)
  end

  def set_book
    @book = Book.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Book not found" }, status: :not_found
  end

  def require_librarian
    render json: { error: "Access denied" }, status: :forbidden unless current_user&.librarian?
  end
end
