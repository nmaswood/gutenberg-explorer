<template>
  <Alert variant="destructive">
    <AlertCircle class="w-4 h-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      <div v-for="[key, value] in errors" :key="key">
        {{ value.message }}
      </div>
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import type { InputValidation } from "../types/InputValidation";
defineProps<{
  errors: Map<string, { message: InputValidation }>;
}>();
</script>

<style scoped></style>
