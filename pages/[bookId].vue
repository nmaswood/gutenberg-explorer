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
import { Slash, Terminal } from "lucide-vue-next";
import { getBook, getBookAnalysis } from "~/composables/useBook";
import type { IBook } from "~/types/IBook";
import type { InputValidation } from "~/types/InputValidation";
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
  analysisLoading.value = true;
  await getBookAnalysis(bookId as string, book.value.content);
  analysisLoading.value = false;
};
</script>
<template>
  <div class="flex flex-col gap-6">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/"> Books </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{{ book?.title || `book-${bookId}` }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Alert v-if="errors?.size">
      <Terminal class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div v-for="[key, value] in errors" :key="key">
          {{ value.message }}
        </div>
      </AlertDescription>
    </Alert>
    <div v-else class="flex flex-col gap-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
      >
        <h1 class="text-2xl font-bold">{{ book.title }}</h1>
        <Button variant="outline" @click="downloadFile">Download</Button>
      </div>
      <div class="flex flex-col md:flex-row gap-2 md:items-start">
        <img class="min-w-52" :src="book.imageSrc" alt="book cover" />
        <Table>
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
      v-if="!analysis"
      class="flex flex-col sm:flex-row gap-3 justify-between sm:items-center"
    >
      <div>Need to analyze the book? Click the button.</div>
      <Button
        class="w-32"
        :disable="analysisLoading"
        :disabled="analysisLoading"
        @click="analysisHandler"
      >
        <span
          v-if="analysisLoading"
          class="loader mx-auto border-black h-5 w-5"
        />

        <span v-else> Analysis book </span>
      </Button>
    </div>
  </div>
</template>

<style>
.loader {
  border-style: solid;
  border-width: 0.25rem;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
