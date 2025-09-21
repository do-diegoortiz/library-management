export interface Borrowing {
  id: number;
  book_id: number;
  bookTitle: string;
  borrowDate: string;
  returnDate?: string;
  returned: boolean;
}

export interface DashboardBorrowing {
  id: number;
  due_date: string;
  book: {
    title: string;
  };
}
