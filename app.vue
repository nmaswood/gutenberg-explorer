<script setup lang="ts">
import { useUser } from "~/composables/useAuth";
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:finish", () => {
  window.scrollTo(0, 0);
});
await useUser();
</script>
<template>
  <NuxtLoadingIndicator />

  <div class="dark:bg-black min-h-screen dark:text-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
