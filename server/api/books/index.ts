import { defineEventHandler, type EventHandlerRequest, type H3Event } from "h3";
import { getBooks } from "~/server/database/repositories/bookRepository";
export default defineEventHandler(
  async (event: H3Event<EventHandlerRequest>) => {
    const query = getQuery(event);
    const skip = query?.skip ? parseInt(query?.skip as string) : 0;
    const take = query?.take ? parseInt(query?.take as string) : 10;
    const search = query?.search as string;
    return await getBooks({
      skip,
      take,
      search,
    });
  }
);
