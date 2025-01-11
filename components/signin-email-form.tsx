"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

import { emailSchema } from "@/schema";
import { signInWithEmail } from "@/app/auth-actions";

export function SignInEmailForm({ next }: { next: string }) {
  const boundSignInWithEmail = signInWithEmail.bind(null, next);

  const [lastResult, formAction, isPending] = useActionState(
    boundSignInWithEmail,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: emailSchema });
    },
  });
  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={formAction}
      className="grid gap-4"
      noValidate
    >
      {form.errors && (
        <div className="p-2 text-center text-sm text-red-600">
          {form.errors}
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          defaultValue={lastResult?.initialValue?.email as string}
          placeholder="you@example.com"
        />
        <div className="text-sm text-red-600">{fields.email.errors}</div>
      </div>
      <Button disabled={isPending}>
        {isPending ? (
          <>
            <Icons.loader className="size-3 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
