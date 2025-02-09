"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { SignUpGoogleForm } from "@/components/signup-google-form";
import { SignUpEmailForm } from "@/components/signup-email-form";
import { SignUpEmailPasswordForm } from "@/components/signup-email-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  return (
    <div className="px-4 sm:mx-auto sm:max-w-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-primary">
        Get started
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">Create a new account</p>
      <div className="mt-12 grid gap-4">
        <SignUpGoogleForm next={next} />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm text-muted-foreground">
            <span className="bg-background px-2">or</span>
          </div>
        </div>
        <Tabs defaultValue="email-link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email-link">Email Link</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="email-link">
            <SignUpEmailForm next={next} />
          </TabsContent>
          <TabsContent value="password">
            <SignUpEmailPasswordForm next={next} />
          </TabsContent>
        </Tabs>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-blue-600 hover:text-blue-500"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
