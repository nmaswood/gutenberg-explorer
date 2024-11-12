import { defineEventHandler, type EventHandlerRequest, type H3Event } from "h3";
import sendDefaultErrorResponse from "~/server/app/errors/responses/DefaultErrorsResponse";
import { getUserBySessionToken } from "~/server/app/services/sessionService";
import { getRecentlyViewedBooks } from "~/server/database/repositories/bookRepository";
export default defineEventHandler(
  async (event: H3Event<EventHandlerRequest>) => {
    const query = getQuery(event);
    const skip = query?.skip ? parseInt(query?.skip as string) : 0;
    const take = query?.take ? parseInt(query?.take as string) : 10;
    const authToken = getCookie(event, "auth_token") ?? null;
    if (authToken == null)
      return await sendDefaultErrorResponse(
        event,
        "Unauthorized",
        403,
        "You must be logged in"
      );

    const user = await getUserBySessionToken(authToken);
    if (!user)
      return await sendDefaultErrorResponse(
        event,
        "Unauthorized",
        403,
        "You must be logged in"
      );

    return await getRecentlyViewedBooks(user?.id, {
      skip,
      take,
    });
  }
);
