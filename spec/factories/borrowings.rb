FactoryBot.define do
  factory :borrowing do
    user { nil }
    book { nil }
    borrow_date { "2025-09-19" }
    due_date { "2025-09-19" }
    returned { false }
  end
end
