class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :user_id, :book_id, presence: true
  validates :returned, inclusion: { in: [ true, false ] }

  validate :book_available
  validate :not_already_borrowed
  validate :due_date_in_future

  before_validation :set_due_date, if: :borrow_date

  after_create :decrement_available_copies
  after_update :increment_available_copies, if: :returned_changed? && returned?

  scope :overdue, -> { where("due_date < ?", Date.today).where(returned: false) }
  scope :borrowed_by_user, ->(user) { where(user: user).where(returned: false) }

  def overdue?
    !returned && due_date < Date.today
  end

  private

  def book_available
    if book && book.available_copies <= 0
      errors.add(:book, "is not available")
    end
  end

  def not_already_borrowed
    if book && user && Borrowing.active.where(user: user, book: book).exists?
      errors.add(:book, "is already borrowed by this user")
    end
  end

  def due_date_in_future
    if due_date && due_date < borrow_date
      errors.add(:due_date, "must be after borrow date")
    end
  end

  def set_due_date
    self.due_date = borrow_date + 14.days
  end

  def decrement_available_copies
    book.decrement!(:available_copies) if book && !returned
  end

  def increment_available_copies
    book.increment!(:available_copies) if book && returned_was(false)
  end

  def self.active
    where(returned: false)
  end
end
