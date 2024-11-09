<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash, Terminal } from "lucide-vue-next";
import { getBook } from "~/composables/useBook";
import type { IBook } from "~/types/IBook";
import type { InputValidation } from "../types/InputValidation";
const route = useRoute();
const bookId = route.params.bookId;
const errors: Ref<Map<string, { message: InputValidation }> | undefined> = ref(
  new Map<string, { message: InputValidation }>()
);
const response = await getBook(bookId as string);
errors.value = response?.errors;
const book: Ref<IBook> = useState(`book-${bookId}`);
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
      <div class="flex flex-col sm:flex-row gap-2 sm:items-start">
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
  </div>
</template>

<style scoped></style>
