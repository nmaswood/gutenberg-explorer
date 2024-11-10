export interface IBook {
  id: string;
  title: string;
  author: string;
  imageSrc?: string;
  content?: string;
  metadata: {
    [key: string]: {
      text: string;
      href?: string;
    }[];
  };
}
export interface IRecentBook {
  id: string;
  userId: string;
  bookId: string;
  createdAt: Date;
  book: IBook;
  lastViewedAt: string;
}
