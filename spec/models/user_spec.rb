require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(user).to be_valid
    end

    it 'requires email' do
      user.email = nil
      expect(user).not_to be_valid
    end

    it 'requires password' do
      user.password = nil
      expect(user).not_to be_valid
    end

    it 'requires role' do
      user.role = nil
      expect(user).not_to be_valid
    end
  end

  describe 'roles' do
    it 'has member role by default' do
      expect(user.member?).to be true
      expect(user.librarian?).to be false
    end

    it 'can be librarian' do
      user.role = :librarian
      expect(user.librarian?).to be true
      expect(user.member?).to be false
    end
  end

  describe 'associations' do
    it 'has many borrowings' do
      expect(user).to have_many(:borrowings).dependent(:destroy)
    end

    it 'has many books through borrowings' do
      expect(user).to have_many(:books).through(:borrowings)
    end
  end
end
