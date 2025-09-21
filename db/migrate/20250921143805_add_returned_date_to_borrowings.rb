class AddReturnedDateToBorrowings < ActiveRecord::Migration[8.0]
  def change
    add_column :borrowings, :returned_date, :date
  end
end
