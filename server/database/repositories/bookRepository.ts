import prisma from "~/server/database/client";
import type { IBook } from "~/types/IBook";
export async function getBookById(id: string) {
  return await prisma.book.findUnique({
    where: {
      id: id,
    },
  });
}
export async function getBooks(params: {
  skip: number;
  take: number;
  search?: string;
}) {
  const books = prisma.book.findMany({
    where: {
      OR: [
        {
          title: {
            contains: params.search,
          },
        },
        {
          author: {
            contains: params.search,
          },
        },
      ],
    },
    skip: params.skip || 0,
    take: params.take || 10,
  });
  const total = prisma.book.count({
    where: {
      OR: [
        {
          title: {
            contains: params.search,
          },
        },
        {
          author: {
            contains: params.search,
          },
        },
      ],
    },
  });
  const [data, count] = await prisma.$transaction([books, total]);
  return { data, count };
}
export async function createBook(data: IBook) {
  const book = await getBookById(data.id);
  if (book) throw new Error("Book already exists");
  return await prisma.book.create({
    data: {
      id: data.id,
      title: data.title,
      author: data.author,
      imageSrc: data.imageSrc,
      content: data.content,
      metadata: data.metadata,
    },
  });
}
export async function updateOrCreateRecentBook(bookId: string, userId: string) {
  const book = await getBookById(bookId);
  if (!book) throw new Error("Book not found");
  return await prisma.recentlyViewedBook.upsert({
    where: {
      userId_bookId: {
        userId: userId,
        bookId: bookId,
      },
    },
    create: {
      userId: userId,
      bookId: bookId,
      lastViewedAt: new Date(),
    },
    update: {
      lastViewedAt: new Date(),
    },
  });
}
export async function getRecentlyViewedBooks(
  userId: string,
  params: {
    skip: number;
    take: number;
  }
) {
  const books = prisma.recentlyViewedBook.findMany({
    where: {
      userId: userId,
    },
    include: {
      book: true,
    },
    skip: params.skip || 0,
    take: params.take || 10,
    orderBy: {
      lastViewedAt: "desc",
    },
  });
  const total = prisma.recentlyViewedBook.count({
    where: {
      userId: userId,
    },
  });
  const [data, count] = await prisma.$transaction([books, total]);
  return { data, count };
}
