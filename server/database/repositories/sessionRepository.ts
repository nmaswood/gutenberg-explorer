import type { User } from "@prisma/client";
import prisma from "~/server/database/client";
import type { ISession } from "~/types/ISession";

export async function createSession(sessionData: ISession): Promise<ISession> {
  if (!sessionData.authToken) {
    throw Error("missing auth token for session");
  }
  if (!sessionData.userId) {
    throw Error("missing user id for session");
  }

  return await prisma.session.create({
    data: {
      userId: sessionData.userId,
      authToken: sessionData.authToken,
    },
  });
}

export async function getSessionByAuthToken(
  authToken: string
): Promise<ISession> {
  const user: User | undefined =
    (await getUserByAuthToken(authToken)) || undefined;

  return { authToken, user };
}

async function getUserByAuthToken(authToken: string): Promise<User | null> {
  return prisma.session
    .findUnique({
      where: {
        authToken: authToken,
      },
    })
    .user();
}
