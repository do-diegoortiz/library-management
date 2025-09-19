require 'rails_helper'

RSpec.describe Borrowing, type: :model do
  let(:user) { create(:user) }
  let(:book) { create(:book, available_copies: 1) }
  let(:borrowing) { build(:borrowing, user: user, book: book) }

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(borrowing).to be_valid
    end

    it 'requires user' do
      borrowing.user = nil
      expect(borrowing).not_to be_valid
    end

    it 'requires book' do
      borrowing.book = nil
      expect(borrowing).not_to be_valid
    end

    it 'sets due_date to 14 days after borrow_date' do
      borrowing.borrow_date = Date.today
      borrowing.save
      expect(borrowing.due_date).to eq(Date.today + 14.days)
    end

    it 'does not allow borrowing unavailable book' do
      book.update(available_copies: 0)
      expect(borrowing).not_to be_valid
      expect(borrowing.errors[:book]).to include("is not available")
    end

    it 'does not allow borrowing the same book multiple times' do
      create(:borrowing, user: user, book: book)
      expect(borrowing).not_to be_valid
      expect(borrowing.errors[:book]).to include("is already borrowed by this user")
    end

    it 'requires due_date after borrow_date' do
      borrowing.borrow_date = Date.today
      borrowing.due_date = Date.yesterday
      expect(borrowing).not_to be_valid
    end
  end

  describe 'associations' do
    it 'belongs to user' do
      expect(borrowing).to belong_to(:user)
    end

    it 'belongs to book' do
      expect(borrowing).to belong_to(:book)
    end
  end

  describe 'callbacks' do
    it 'decrements available_copies when created' do
      expect { borrowing.save }.to change { book.reload.available_copies }.by(-1)
    end

    it 'increments available_copies when returned' do
      borrowing.save
      borrowing.update(returned: true)
      expect(book.reload.available_copies).to eq(book.total_copies)
    end
  end

  describe 'scopes' do
    let(:overdue_borrowing) { create(:borrowing, due_date: 1.day.ago, returned: false) }
    let(:active_borrowing) { create(:borrowing, due_date: Date.tomorrow, returned: false) }
    let(:returned_borrowing) { create(:borrowing, returned: true) }

    it 'finds overdue borrowings' do
      expect(Borrowing.overdue).to include(overdue_borrowing)
      expect(Borrowing.overdue).not_to include(active_borrowing, returned_borrowing)
    end

    it 'finds borrowings by user' do
      expect(Borrowing.borrowed_by_user(user)).to include(active_borrowing)
      expect(Borrowing.borrowed_by_user(user)).not_to include(returned_borrowing)
    end
  end

  describe 'methods' do
    it 'is overdue when due_date passed and not returned' do
      borrowing.due_date = 1.day.ago
      borrowing.save
      expect(borrowing).to be_overdue
    end

    it 'is not overdue when returned' do
      borrowing.returned = true
      borrowing.save
      expect(borrowing).not_to be_overdue
    end
  end
end
