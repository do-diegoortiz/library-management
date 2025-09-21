import { DashboardBorrowing } from "./Borrowing";

export interface DashboardData {
  total_books?: number;
  total_borrowed?: number;
  borrowed_books?: DashboardBorrowing[];
  overdue_books?: DashboardBorrowing[];
}
