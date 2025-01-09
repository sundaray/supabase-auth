"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@conform-to/react";
import { Icons } from "@/components/icons";

import { resetUserPassword } from "@/app/password-reset-actions";
import { resetPasswordSchema } from "@/schema";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Bind the token and email to the action
  const boundResetPassword = resetUserPassword.bind(null, token!, email!);
  const [lastResult, formAction, isPending] = useActionState(
    boundResetPassword,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
  });
  return (
    <div className="mx-auto mt-16 px-4 sm:max-w-sm">
      <h1 className="text-center text-2xl font-bold">Reset Password</h1>
      <form
        className="mt-12"
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
      >
        <div className="grid gap-4">
          {form.errors && (
            <div className="rounded border border-red-200 bg-red-50 p-2 text-center text-sm text-red-600">
              {form.errors}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              defaultValue={lastResult?.initialValue?.newPassword as string}
            />
            <div className="mt-1 text-sm text-red-600">
              {fields.newPassword.errors}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Confirm new password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              name="confirmNewPassword"
              defaultValue={
                lastResult?.initialValue?.confirmNewPassword as string
              }
            />
            <div className="mt-1 text-sm text-red-600">
              {fields.confirmNewPassword.errors}
            </div>
          </div>
          <Button className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
