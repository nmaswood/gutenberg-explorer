import { useRouter, useState } from "#app";
import type { FormValidation } from "~/types/FormValidation";
import type { ISession } from "~/types/ISession";
import type { IUser } from "~/types/IUser";
import useErrorMapper from "./useErrorMapper";

export const useAuthCookie = () => useCookie("auth_token");

export async function useUser(): Promise<IUser | null> {
  const authCookie = useAuthCookie().value;
  const user = useState<IUser | null>("user");

  if (authCookie && !user.value) {
    const cookieHeaders = useRequestHeaders(["cookie"]);

    const { data } = await useFetch<IUser>(`/api/auth/getByAuthToken`, {
      headers: cookieHeaders as HeadersInit,
    });

    user.value = data.value;
  }

  return user.value;
}

export async function useIsLoggedIn() {
  const user = await useUser();

  if (!user) {
    return false;
  }

  if (user?.id == null) {
    return false;
  }

  return true;
}

export async function userLogout() {
  const cookieHeaders = useRequestHeaders(["cookie"]);
  await useFetch("/api/auth/logout", {
    headers: cookieHeaders as HeadersInit,
  });
  useState("user").value = null;
  await useRouter().push("/login");
}

export async function registerWithEmail(body: {
  name: string;
  email: string;
  password: string;
}): Promise<FormValidation> {
  const { data, error } = await useFetch<ISession>("/api/auth/register", {
    method: "POST",
    body,
  });
  if (error.value) {
    return useErrorMapper(error.value?.data.data);
  }
  useState("user").value = data.value?.user;
  await useRouter().push("/");

  return { hasErrors: false, loggedIn: true };
}

export async function loginWithEmail(body: {
  email: string;
  password: string;
}): Promise<FormValidation> {
  const { data, error } = await useFetch("/api/auth/login", {
    method: "POST",
    body,
  });
  if (error.value) {
    return useErrorMapper(error.value?.data.data);
  }
  if (!data.value?.id) {
    throw Error("something went wrong");
  }
  useState("user").value = data.value;
  await useRouter().push("/");
  return { hasErrors: false, loggedIn: true };
}
