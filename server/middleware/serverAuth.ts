import type { H3Event } from "h3";
import { authCheck } from "../app/services/userService";

export default eventHandler(async (event) => {
  const isAllowed = await protectAuthRoute(event);

  if (!isAllowed) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }
});

async function protectAuthRoute(event: H3Event): Promise<boolean> {
  const protectedRoutes = ["/api/book"];
  if (
    !event?.path ||
    !protectedRoutes.some((route) => event.path.startsWith(route))
  ) {
    return true;
  }

  return await authCheck(event);
}
