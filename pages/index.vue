<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { getBooks, getRecentlyViewedBooks } from "~/composables/useBook";
import type { IBook, IRecentBook } from "~/types/IBook";

import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const booksPage = ref(+(route.query.page || 1) || 1);
const recentBooksPage = ref(+(route.query.recentBooksPage || 1) || 1);
const take = ref(3);
const search = ref((route.query.search || "") as string);
const searchField = ref((route.query.search || "") as string);
await Promise.all([
  getBooks({
    skip: (booksPage.value - 1) * take.value,
    take: take.value,
    search: search.value,
  }),
  getRecentlyViewedBooks({
    skip: (recentBooksPage.value - 1) * take.value,
    take: take.value,
  }),
]);
const books: Ref<{ data: IBook[]; count: number }> = useState("books", () => ({
  data: [],
  count: 0,
}));
const recentBooks: Ref<{ data: IRecentBook[]; count: number }> = useState(
  "recentBooks",
  () => ({
    data: [] as IRecentBook[],
    count: 0,
  })
);
const refetchBooks = async () => {
  await getBooks({
    skip: (booksPage.value - 1) * take.value,
    take: take.value,
    search: searchField.value,
  });
};
const refetchRecentBooks = async () => {
  await getRecentlyViewedBooks({
    skip: (recentBooksPage.value - 1) * take.value,
    take: take.value,
  });
};
watch(booksPage, () => {
  refetchBooks();
});
watch(recentBooksPage, () => {
  refetchRecentBooks();
});
let timeout: NodeJS.Timeout;
watch(search, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchField.value = search.value;
    refetchBooks();
  }, 500);
});
const searchBookId = ref("");
const router = useRouter();
const goToSpecifcBook = () => {
  if (searchBookId.value) {
    router.push({
      name: "bookId",
      params: { bookId: searchBookId.value },
    });
  }
};
watch([searchField, booksPage, recentBooksPage], () => {
  router.replace({
    query: {
      search: searchField.value.length ? searchField.value : undefined,
      booksPage: booksPage.value > 1 ? booksPage.value : undefined,
      recentBooksPage:
        recentBooksPage.value > 1 ? recentBooksPage.value : undefined,
    },
  });
});
</script>
<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3 justify-between">
      <Input
        v-model="searchBookId"
        type="text"
        placeholder="Know the book id? Search here"
        class="w-60"
        @keydown.enter="goToSpecifcBook"
      />
      <Button @click="goToSpecifcBook">Go</Button>
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2 justify-between">
        <h1
          class="text-center text-5xl font-extrabold text-gray-900 dark:text-gray-400 ml-4"
        >
          Books
        </h1>

        <Input v-model="search" type="text" placeholder="Search" class="w-40" />
      </div>
      <template v-if="books.data.length">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2"
        >
          <BookCard v-for="book in books.data" :key="book.id" :book="book" />
        </div>
        <Pagination
          v-if="books.count > take"
          v-slot="{ page }"
          :total="books.count"
          :sibling-count="1"
          :default-page="1"
          :items-per-page="take"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationPrev @click="booksPage--" />
            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  class="w-10 h-10 p-0"
                  :variant="item.value === page ? 'default' : 'outline'"
                  @click="booksPage = item.value"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>
            <PaginationNext @click="booksPage++" />
          </PaginationList>
        </Pagination>
      </template>
      <Card v-else>
        <CardHeader>
          <CardTitle>No Books Available</CardTitle>
        </CardHeader>
        <CardContent>
          {{
            searchField
              ? "No books found for your search stored in our system, try searching for another book."
              : "No books stored in our system, try search for a book by it's id."
          }}
        </CardContent>
      </Card>
    </div>

    <div v-if="recentBooks.data.length" class="flex flex-col gap-3">
      <h1
        class="text-center text-5xl font-extrabold text-gray-900 dark:text-gray-400 ml-4"
      >
        Recent Books
      </h1>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2"
      >
        <BookCard
          v-for="recentBook in recentBooks.data"
          :key="recentBook.id"
          :book="recentBook.book"
          :last-viewed="recentBook.lastViewedAt"
        />
      </div>
      <Pagination
        v-if="recentBooks.count > take"
        v-slot="{ page }"
        :total="recentBooks.count"
        :sibling-count="1"
        :default-page="1"
        :items-per-page="take"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationPrev @click="recentBooksPage--" />
          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-10 h-10 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
                @click="recentBooksPage = item.value"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext @click="recentBooksPage++" />
        </PaginationList>
      </Pagination>
    </div>
  </div>
</template>
