import { Book } from "./Book";
import { Borrowing } from "./Borrowing";

export interface BookListProps {
  books: Book[];
  isLibrarian: boolean;
  onCreateBook: (data: any) => Promise<void>;
  onUpdateBook: (id: number, data: any) => Promise<void>;
  onDeleteBook: (id: number) => Promise<void>;
  onBorrowBook: (id: number) => Promise<void>;
  borrowings: Borrowing[];
  search: string;
  setSearch: (search: string) => void;
}

export interface BorrowingsProps {
  borrowings: Borrowing[];
  isLibrarian: boolean;
  onReturnBook: (id: number) => Promise<void>;
}

export interface LoginProps {
  onSwitchToSignup: () => void;
}

export interface SignupProps {
  onSwitchToLogin: () => void;
}
