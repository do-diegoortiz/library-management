# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Demo users
librarian = User.find_or_create_by!(email: 'librarian@example.com') do |u|
  u.password = 'password'
  u.role = :librarian
end

member = User.find_or_create_by!(email: 'member@example.com') do |u|
  u.password = 'password'
  u.role = :member
end

# Demo books
books_data = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', isbn: '9780743273565', total_copies: 5 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', isbn: '9780446310789', total_copies: 3 },
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', isbn: '9780451524935', total_copies: 4 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', isbn: '9780141439518', total_copies: 2 }
]

books_data.each do |data|
  Book.find_or_create_by!(isbn: data[:isbn]) do |book|
    book.title = data[:title]
    book.author = data[:author]
    book.genre = data[:genre]
    book.total_copies = data[:total_copies]
    book.available_copies = data[:total_copies]
  end
end

# Demo borrowings
borrowings_data = [
  { user: member, book: Book.find_by(isbn: '9780743273565'), borrow_date: 7.days.ago, due_date: 7.days.ago + 14.days, returned: false },
  { user: member, book: Book.find_by(isbn: '9780451524935'), borrow_date: 10.days.ago, due_date: 10.days.ago + 14.days, returned: true }
]

borrowings_data.each do |data|
  Borrowing.find_or_create_by!(user: data[:user], book: data[:book], borrow_date: data[:borrow_date], due_date: data[:due_date]) do |b|
    b.returned = data[:returned]
  end
end

puts "Seeded demo data: Librarian (librarian@example.com / password), Member (member@example.com / password)"
