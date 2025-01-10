"use client";

import { useActionState } from "react";

import { Icons } from "@/components/icons";
import { signInWithGoogle } from "@/app/auth-actions";

export function SignUpGoogleForm({ next }: { next: string }) {
  const boundGoogleSignIn = signInWithGoogle.bind(null, next);

  const [formState, formAction, isPending] = useActionState(
    boundGoogleSignIn,
    undefined,
  );

  return (
    <form action={formAction} className="grid gap-2">
      {formState !== undefined && formState?.error && (
        <div className="text-pretty rounded border border-red-200 bg-red-50 p-2 text-center text-sm text-red-600">
          {formState?.message}
        </div>
      )}
      <button
        type="submit"
        className="w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
      >
        {isPending ? (
          <>
            <Icons.loader className="mr-2 inline-block size-3.5 animate-spin" />
          </>
        ) : (
          <Icons.google className="mr-2 inline-block size-5" />
        )}
        Sign up with Google
      </button>
    </form>
  );
}
