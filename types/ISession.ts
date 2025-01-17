import type { User } from "@prisma/client";

export interface ISession {
  authToken?: string;
  user?: User;
  userId?: string;
}
