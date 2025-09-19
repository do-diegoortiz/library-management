class AddAvailableCopiesToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :available_copies, :integer
  end
end
