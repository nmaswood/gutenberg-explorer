import type { User } from "@prisma/client";
import prisma from "~/server/database/client";
import type { IUser } from "~/types/IUser";

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser(data: IUser) {
  if (!data.email || !data.password || !data.name) {
    throw Error("missing required fields");
  }
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });

  return user;
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
    },
  });
}
