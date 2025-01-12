"use client";

import { useState, useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { signUpWithEmailAndPassword } from "@/app/auth-actions";
import { signUpEmailPasswordSchema } from "@/schema";

export function SignUpEmailPasswordForm({ next }: { next: string }) {
  const boundSignUpWithEmailAndPassword = signUpWithEmailAndPassword.bind(
    null,
    next,
  );

  const [lastResult, formAction, isPending] = useActionState(
    boundSignUpWithEmailAndPassword,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: signUpEmailPasswordSchema,
      });
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate>
      {form.errors && (
        <div className="text-pretty py-2 text-sm text-red-600">
          {form.errors}
        </div>
      )}
      <div className="grid gap-4">
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
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              defaultValue={lastResult?.initialValue?.password as string}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground outline-offset-0 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPasswordVisible ? (
                <Icons.eyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Icons.eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="text-sm text-red-500">{fields.password.errors}</div>
        </div>
        <Button disabled={isPending}>
          {isPending ? (
            <>
              <Icons.loader className="size-3 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>
    </form>
  );
}
