require 'rails_helper'

RSpec.describe "Api::V1::Borrowings", type: :request do
  let(:librarian) { create(:user, role: :librarian) }
  let(:member) { create(:user, role: :member) }
  let(:book) { create(:book, available_copies: 1) }
  let(:borrowing) { create(:borrowing, user: member, book: book) }

  def auth_headers(user)
    { 'Authorization' => "Bearer #{user.generate_jwt}" }
  end

  describe "GET /api/v1/borrowings" do
    context 'as librarian' do
      it 'returns all borrowings' do
        get api_v1_borrowings_path, headers: auth_headers(librarian)
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body).size).to eq(2) # from seeds
      end
    end

    context 'as member' do
      it 'returns only user's borrowings' do
        get api_v1_borrowings_path, headers: auth_headers(member)
        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body).size).to eq(1) # member has 1 borrowing from seeds
      end
    end
  end

  describe "GET /api/v1/borrowings/:id" do
    context 'as librarian' do
      it 'returns a borrowing' do
        get api_v1_borrowing_path(borrowing), headers: auth_headers(librarian)
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['book_id']).to eq(book.id)
      end
    end

    context 'as member' do
      it 'returns user's borrowing' do
        get api_v1_borrowing_path(borrowing), headers: auth_headers(member)
        expect(response).to have_http_status(:ok)
      end

      it 'returns 404 for other user's borrowing' do
        other_borrowing = create(:borrowing, user: create(:user), book: create(:book))
        get api_v1_borrowing_path(other_borrowing), headers: auth_headers(member)
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /api/v1/borrowings" do
    let(:valid_borrowing_params) do
      {
        borrowing: {
          book_id: book.id,
          borrow_date: Date.today
        }
      }
    end

    context 'as member' do
      it 'creates a new borrowing' do
        expect {
          post api_v1_borrowings_path, params: valid_borrowing_params, headers: auth_headers(member)
        }.to change(Borrowing, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['due_date']).to eq(Date.today + 14.days)
      end

      it 'returns error if book not available' do
        book.update(available_copies: 0)
        post api_v1_borrowings_path, params: valid_borrowing_params, headers: auth_headers(member)
        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)['errors']).to include('Book is not available')
      end

      it 'returns error if already borrowed' do
        create(:borrowing, user: member, book: book)
        post api_v1_borrowings_path, params: valid_borrowing_params, headers: auth_headers(member)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors']).to include('Book is already borrowed by this user')
      end
    end

    context 'as librarian' do
      it 'returns access denied for create' do
        post api_v1_borrowings_path, params: valid_borrowing_params, headers: auth_headers(librarian)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "PUT /api/v1/borrowings/:id" do
    context 'as librarian' do
      it 'returns a borrowing' do
        put api_v1_borrowing_path(borrowing), params: { borrowing: { returned: true } }, headers: auth_headers(librarian)
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['returned']).to be true
      end
    end

    context 'as member' do
      it 'returns 404 for update' do
        put api_v1_borrowing_path(borrowing), params: { borrowing: { returned: true } }, headers: auth_headers(member)
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
