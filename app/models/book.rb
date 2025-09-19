class Book < ApplicationRecord
  has_many :borrowings, dependent: :destroy
  has_many :users, through: :borrowings

  validates :title, :author, :genre, :isbn, presence: true
  validates :isbn, uniqueness: true
  validates :total_copies, :available_copies, numericality: { greater_than_or_equal_to: 0 }

  before_validation :set_available_copies, on: :create

  scope :search_by_title, ->(query) { where("title ILIKE ?", "%#{query}%") }
  scope :search_by_author, ->(query) { where("author ILIKE ?", "%#{query}%") }
  scope :search_by_genre, ->(query) { where("genre ILIKE ?", "%#{query}%") }

  def available?
    available_copies > 0
  end

  private

  def set_available_copies
    self.available_copies = total_copies if new_record?
  end
end
