"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { SignInGoogleForm } from "@/components/signin-google-form";
import { SignInEmailForm } from "@/components/signin-email-form";
import { SignInEmailPasswordForm } from "@/components/signin-email-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  return (
    <div className="sm:mx-auto sm:max-w-[480px]">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
      <div className="mt-10 border px-6 py-12 sm:rounded-lg sm:px-12">
        <div className="grid gap-4">
          <SignInGoogleForm next={next} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm text-muted-foreground">
              <span className="bg-background px-2">Or continue with</span>
            </div>
          </div>
          <Tabs defaultValue="email-link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email-link">Email Link</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="email-link">
              <SignInEmailForm next={next} />
            </TabsContent>
            <TabsContent value="password">
              <SignInEmailPasswordForm next={next} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
