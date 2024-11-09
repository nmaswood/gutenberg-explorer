<script setup lang="ts">
import type { IBook } from "../types/IBook";

defineProps<{
  book: IBook;
  lastViewed?: string;
}>();
</script>
<template>
  <NuxtLink
    :to="{
      name: 'bookId',
      params: { bookId: book.id },
    }"
  >
    <Card class="overflow-hidden h-full">
      <CardHeader>
        <CardTitle>{{ book.title }}</CardTitle>
        <CardDescription>
          {{ book.author }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-2">
          <img
            alt="Book image"
            class="aspect-square w-full rounded-md object-cover"
            :src="book.imageSrc || '/placeholder.svg'"
            width="300"
          />
        </div>
      </CardContent>
      <CardFooter v-if="lastViewed" class="mt-auto">
        <span class="text-sm font-semibold">
          {{
            new Date(lastViewed).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </span>
      </CardFooter>
    </Card>
  </NuxtLink>
</template>

<style scoped></style>
