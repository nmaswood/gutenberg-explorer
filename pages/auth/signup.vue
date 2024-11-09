<script setup lang="ts">
import { Terminal } from "lucide-vue-next";

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

const onSubmit = handleSubmit(async (values) => {
  errors.value = new Map<string, { message: InputValidation }>();
  const response = await registerWithEmail(values);
  errors.value = response.errors;
});
</script>

<template>
  <Card class="mx-auto max-w-sm my-4">
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
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
              <Input type="text" placeholder="shadcn" v-bind="componentField" />
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
        <Alert v-if="errors?.size">
          <Terminal class="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <div v-for="[key, value] in errors" :key="key">
              {{ value.message }}
            </div>
          </AlertDescription>
        </Alert>
        <Button type="submit" class="w-full"> Submit </Button>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <NuxtLink
            :to="{
              name: 'auth-login',
            }"
            class="underline"
          >
            Sign in
          </NuxtLink>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
