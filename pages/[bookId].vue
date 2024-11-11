<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions.mjs";
import { Slash } from "lucide-vue-next";
import { getBook, getBookAnalysis } from "~/composables/useBook";
import type { IBook } from "~/types/IBook";
import type { InputValidation } from "~/types/InputValidation";
import Separator from "../components/ui/separator/Separator.vue";
const route = useRoute();
const bookId = route.params.bookId;
const errors: Ref<Map<string, { message: InputValidation }> | undefined> = ref(
  new Map<string, { message: InputValidation }>()
);
const response = await getBook(bookId as string);
errors.value = response?.errors;
const book: Ref<IBook> = useState(`book-${bookId}`);
const analysis: Ref<ChatCompletion> = useState(`analysis-${bookId}`);
const text = computed(() =>
  analysis.value?.choices?.[0]?.message?.content?.split("\n")
);
const metaData = computed(() => book.value.metadata);
definePageMeta({
  middleware: "auth",
});
const downloadFile = () => {
  if (!book.value.content) return;
  const blob = new Blob([book.value.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${book.value.title}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
const analysisLoading = ref(false);
const analysisHandler = async () => {
  if (!book.value.content) return;
  analysisLoading.value = true;
  await getBookAnalysis(bookId as string, book.value.content);
  analysisLoading.value = false;
};
</script>
<template>
  <div class="flex flex-col gap-6">
    <Breadcrumb>
      <BreadcrumbList class="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink href="/"> Books </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem class="grow-0 truncate">
          <BreadcrumbPage class="w-full">
            <div class="truncate">
              {{ book?.title || bookId }}
            </div>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <BaseError v-if="errors?.size" :errors="errors" />
    <template v-else>
      <div class="flex flex-col gap-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        >
          <h1 class="text-2xl font-bold">{{ book?.title }}</h1>
          <Button v-if="book.content" variant="outline" @click="downloadFile"
            >Download</Button
          >
        </div>
        <div class="flex flex-col md:flex-row gap-4 md:items-start">
          <img class="min-w-52" :src="book.imageSrc" alt="book cover" />
          <Table class="min-w-96">
            <TableBody>
              <template v-for="(value, key, index) in metaData" :key="index">
                <TableRow v-for="(row, rowIndex) in value" :key="rowIndex">
                  <TableCell class="font-medium capitalize">
                    {{ key }}
                  </TableCell>
                  <TableCell>
                    <NuxtLink
                      v-if="row.href"
                      target="_blank"
                      :to="row.href"
                      class="underline"
                    >
                      {{ row.text }}
                    </NuxtLink>
                    <span v-else>
                      {{ row.text }}
                    </span>
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>
      </div>
      <Separator class="my-4" />
      <template v-if="text">
        <template v-for="(chunk, index) in text" :key="index">
          <div
            v-if="index != text?.length - 1"
            :class="chunk.startsWith('**') ? 'text-xl font-semibold' : ''"
          >
            {{ chunk.replaceAll("**", "") }}
          </div>
        </template>
      </template>
      <div
        v-if="!analysis && book.content"
        class="flex flex-col sm:flex-row gap-3 justify-between sm:items-center"
      >
        <div>Need to analyze the book? Click the button.</div>
        <Button
          class="w-36"
          :disable="analysisLoading"
          :disabled="analysisLoading"
          @click="analysisHandler"
        >
          <div class="flex items-center gap-3">
            <span
              v-if="analysisLoading"
              class="loader mx-auto border-white dark:border-black h-5 w-5"
            />

            Analysis book
          </div>
        </Button>
      </div>
    </template>
  </div>
</template>
