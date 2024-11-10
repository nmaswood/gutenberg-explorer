<script setup lang="ts">
import { Theme } from "@/types/ITheme";
import { CircleUser, Menu, Moon, Sun } from "lucide-vue-next";
import { userLogout } from "~/composables/useAuth";
const logout = userLogout;
const colorMode = useColorMode();
const setColorTheme = (newTheme: Theme) => {
  colorMode.preference = newTheme;
};
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <header
      class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
    >
      <nav
        class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <NuxtLink
          to="/"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Books
        </NuxtLink>
      </nav>
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <NuxtLink
              to="/"
              class="text-muted-foreground transition-colors hover:text-foreground"
            >
              Books
            </NuxtLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div class="ml-auto flex items-center gap-2">
        <Button
          v-if="$colorMode.value == Theme.LIGHT"
          variant="secondary"
          size="icon"
          class="rounded-full"
          @click="setColorTheme(Theme.DARK)"
        >
          <Sun class="h-5 w-5" />
        </Button>
        <Button
          v-else
          variant="secondary"
          size="icon"
          class="rounded-full"
          @click="setColorTheme(Theme.LIGHT)"
        >
          <Moon class="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-6"
    >
      <NuxtPage />
    </main>
  </div>
</template>
