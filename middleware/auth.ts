import { defineNuxtRouteMiddleware } from "#app";
import { useUser } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (_to) => {
  const user = await useUser();
  if (user == null && user == undefined) {
    return navigateTo("/auth/login");
  }
  return;
});
