<script setup lang="ts">
import { registerWithEmail } from "@/composables/useAuth";
import type { InputValidation } from "@/types/InputValidation";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { registerBodySchema } from "~/server/app/formRequests/RegisterRequest";
definePageMeta({
  middleware: "guest",
  layout: false,
});
const errors: Ref<Map<string, { message: InputValidation }> | undefined> = ref(
  new Map<string, { message: InputValidation }>()
);

const formSchema = toTypedSchema(registerBodySchema);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});
const isLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  errors.value = new Map<string, { message: InputValidation }>();
  const response = await registerWithEmail(values);
  errors.value = response.errors;
  isLoading.value = false;
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl text-center"> Sign Up </CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
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
            Already have an account?
            <NuxtLink
              :to="{
                name: 'auth-login',
              }"
              class="underline"
            >
              Login
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
