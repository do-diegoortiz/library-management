class ChangeReturnedDefaultInBorrowings < ActiveRecord::Migration[8.0]
  def change
    change_column_default :borrowings, :returned, from: nil, to: false
  end
end
