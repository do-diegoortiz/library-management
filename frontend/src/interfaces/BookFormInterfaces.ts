export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  total_copies: number;
}

export interface BookFormErrors {
  title?: string;
  author?: string;
  genre?: string;
  isbn?: string;
  total_copies?: string;
}

export interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
  initialBook?: import("./Book").Book | null;
}
