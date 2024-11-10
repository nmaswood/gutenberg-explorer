<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";

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

const onSubmit = handleSubmit(async (values) => {
  errors.value = new Map<string, { message: InputValidation }>();
  const response = await loginWithEmail(values);
  errors.value = response.errors;
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
              <FormLabel>Name</FormLabel>
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
          <Alert v-if="errors?.size" variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <div v-for="[key, value] in errors" :key="key">
                {{ value.message }}
              </div>
            </AlertDescription>
          </Alert>
          <Button type="submit" class="w-full"> Submit </Button>
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
