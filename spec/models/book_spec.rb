require 'rails_helper'

RSpec.describe Book, type: :model do
  let(:book) { build(:book) }

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(book).to be_valid
    end

    it 'requires title' do
      book.title = nil
      expect(book).not_to be_valid
    end

    it 'requires author' do
      book.author = nil
      expect(book).not_to be_valid
    end

    it 'requires genre' do
      book.genre = nil
      expect(book).not_to be_valid
    end

    it 'requires isbn' do
      book.isbn = nil
      expect(book).not_to be_valid
    end

    it 'requires unique isbn' do
      create(:book, isbn: book.isbn)
      expect(book).not_to be_valid
    end

    it 'requires total_copies to be non-negative' do
      book.total_copies = -1
      expect(book).not_to be_valid
    end

    it 'sets available_copies to total_copies on create' do
      book = create(:book, total_copies: 5)
      expect(book.available_copies).to eq(5)
    end
  end

  describe 'associations' do
    it 'has many borrowings' do
      expect(book).to have_many(:borrowings).dependent(:destroy)
    end

    it 'has many users through borrowings' do
      expect(book).to have_many(:users).through(:borrowings)
    end
  end

  describe 'scopes' do
    let(:book1) { create(:book, title: 'Test Book 1') }
    let(:book2) { create(:book, title: 'Test Book 2') }

    it 'searches by title' do
      expect(Book.search_by_title('Test')).to include(book1, book2)
    end

    it 'searches by author' do
      book1.update(author: 'Test Author')
      expect(Book.search_by_author('Test')).to include(book1)
    end

    it 'searches by genre' do
      book1.update(genre: 'Fiction')
      expect(Book.search_by_genre('Fiction')).to include(book1)
    end
  end

  describe 'methods' do
    it 'is available when available_copies > 0' do
      book.available_copies = 1
      expect(book).to be_available
    end

    it 'is not available when available_copies = 0' do
      book.available_copies = 0
      expect(book).not_to be_available
    end
  end
end
