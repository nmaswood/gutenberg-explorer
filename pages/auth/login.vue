<script setup lang="ts">
import { loginWithEmail } from "@/composables/useAuth";
import { loginBodySchema } from "@/server/app/formRequests/LoginRequest";
import type { InputValidation } from "@/types/InputValidation";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
definePageMeta({
  middleware: "guest",
  layout: false,
});
const errors: Ref<Map<string, { message: InputValidation }> | undefined> = ref(
  new Map<string, { message: InputValidation }>()
);

const formSchema = toTypedSchema(loginBodySchema);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});
const isLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  errors.value = new Map<string, { message: InputValidation }>();
  const response = await loginWithEmail(values);
  errors.value = response.errors;
  isLoading.value = false;
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl text-center"> Login </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="***"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <BaseError v-if="errors?.size" :errors="errors" />

          <Button type="submit" class="w-full">
            <div class="flex items-center gap-3">
              <span
                v-if="isLoading"
                class="loader mx-auto border-white dark:border-black h-5 w-5"
              />

              Submit
            </div>
          </Button>
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <NuxtLink
              :to="{
                name: 'auth-signup',
              }"
              class="underline"
            >
              Sign up
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
