"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { requestPasswordReset } from "@/app/password-reset-actions";
import { forgotPasswordSchema } from "@/schema";

export function ForgotPasswordForm() {
  const [lastResult, formAction, isPending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: forgotPasswordSchema });
    },
  });
  return (
    <div className="mx-auto mt-16 px-4 sm:mx-auto sm:max-w-sm">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Forgot Password
      </h2>
      <form
        className="mt-12"
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
      >
        <div className="grid gap-4">
          {form.errors && (
            <div className="rounded border border-red-200 bg-red-50 py-2 text-center text-sm text-red-600">
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
            />
            <div className="mt-1 text-sm text-red-600">
              {fields.email.errors}
            </div>
          </div>
          <Button className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send password reset link"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
