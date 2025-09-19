require 'rails_helper'

RSpec.describe "Api::V1::Books", type: :request do
  let(:librarian) { create(:user, role: :librarian) }
  let(:member) { create(:user, role: :member) }
  let(:book) { create(:book) }

  def auth_headers(user)
    token = JsonWebToken.encode(user_id: user.id)
    { 'Authorization' => "Bearer #{token}" }
  end

  describe "GET /api/v1/books" do
    context 'without authentication' do
      it 'returns books successfully' do
        get api_v1_books_path
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body).size).to eq(4) # from seeds
      end
    end

    context 'with authentication' do
      it 'returns books for authenticated user' do
        get api_v1_books_path, headers: auth_headers(librarian)
        expect(response).to have_http_status(:success)
      end
    end

    context 'search functionality' do
      it 'searches by title' do
        get api_v1_books_path, params: { search: 'Gatsby', search_type: 'title' }
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body).first['title']).to include('Gatsby')
      end

      it 'searches by author' do
        get api_v1_books_path, params: { search: 'Fitzgerald', search_type: 'author' }
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body).first['author']).to include('Fitzgerald')
      end

      it 'searches by genre' do
        get api_v1_books_path, params: { search: 'Fiction', search_type: 'genre' }
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body).first['genre']).to include('Fiction')
      end
    end
  end

  describe "GET /api/v1/books/:id" do
    it 'returns a book successfully' do
      get api_v1_book_path(book), headers: auth_headers(librarian)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['title']).to eq(book.title)
    end

    it 'returns 404 if book not found' do
      get api_v1_book_path(999), headers: auth_headers(librarian)
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/books" do
    let(:valid_book_params) do
      {
        book: {
          title: 'Test Book',
          author: 'Test Author',
          genre: 'Test Genre',
          isbn: '9780000000001',
          total_copies: 5
        }
      }
    end

    context 'as librarian' do
      it 'creates a new book' do
        expect {
          post api_v1_books_path, params: valid_book_params, headers: auth_headers(librarian)
        }.to change(Book, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['title']).to eq('Test Book')
      end

      it 'returns validation errors if invalid' do
        post api_v1_books_path, params: { book: { title: nil } }, headers: auth_headers(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors']).to include('Title can't be blank')
      end
    end

    context 'as member' do
      it 'returns access denied' do
        post api_v1_books_path, params: valid_book_params, headers: auth_headers(member)
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('Access denied')
      end
    end
  end

  describe "PUT /api/v1/books/:id" do
    let(:update_params) do
      {
        book: {
          total_copies: 10
        }
      }
    end

    context 'as librarian' do
      it 'updates book successfully' do
        put api_v1_book_path(book), params: update_params, headers: auth_headers(librarian)
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['total_copies']).to eq(10)
      end
    end

    context 'as member' do
      it 'returns access denied' do
        put api_v1_book_path(book), params: update_params, headers: auth_headers(member)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE /api/v1/books/:id" do
    context 'as librarian' do
      it 'deletes book successfully' do
        delete api_v1_book_path(book), headers: auth_headers(librarian)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'as member' do
      it 'returns access denied' do
        delete api_v1_book_path(book), headers: auth_headers(member)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
