import type { ChatCompletion } from "groq-sdk/resources/chat/completions.mjs";
import type { IBook } from "~/types/IBook";

export async function getBook(bookId: string) {
  const cookieHeaders = useRequestHeaders(["cookie"]);

  const { data, error } = await useFetch<{
    content: string;
    metadata: string;
  }>(`/api/books/${bookId}`, {
    method: "GET",

    headers: cookieHeaders as HeadersInit,
  });
  if (error.value) {
    return useErrorMapper(error.value?.data.data);
  }
  if (data.value) {
    useState(`book-${bookId}`).value = data.value;
    useState(`book-${bookId}-error`).value = null;
    await useRouter().push(`/${bookId}`);
  }
}
export async function getBooks(params: {
  skip: number;
  take: number;
  search?: string;
}) {
  const cookieHeaders = useRequestHeaders(["cookie"]);
  const { data, error } = await useFetch<{
    data: IBook[];
    count: number;
  }>(`/api/books`, {
    method: "GET",
    query: params,
    headers: cookieHeaders as HeadersInit,
  });
  if (error.value) {
    return useErrorMapper(error.value?.data.data);
  }
  if (data.value) {
    useState("books").value = data.value;
  }
}
export async function getRecentlyViewedBooks(params: {
  skip: number;
  take: number;
}) {
  const cookieHeaders = useRequestHeaders(["cookie"]);

  const { data, error } = await useFetch<{
    data: IBook[];
    count: number;
  }>(`/api/books/recent`, {
    method: "GET",
    query: params,
    headers: cookieHeaders as HeadersInit,
  });
  if (error.value) {
    return useErrorMapper(error.value?.data.data);
  }
  if (data.value) {
    useState("recentBooks").value = data.value;
  }
}
export async function getBookAnalysis(bookId: string, content: string) {
  const cookieHeaders = useRequestHeaders(["cookie"]);

  const { data, error } = await useFetch<ChatCompletion>(
    `/api/books/${bookId}/analysis`,
    {
      method: "POST",
      headers: cookieHeaders as HeadersInit,
      body: {
        content,
      },
    }
  );
  if (error.value) {
    return useErrorMapper(error.value?.data.data);
  }
  if (data.value) {
    useState(`analysis-${bookId}`).value = data.value;
  }
}
