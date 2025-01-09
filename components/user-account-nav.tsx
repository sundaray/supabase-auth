import React from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "@/components/sign-out";
import { createClient } from "@/supabase/server";

export async function UserAccountNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/signin"
        className={buttonVariants({
          size: "sm",
        })}
      >
        Sign in
      </Link>
    );
  }

  console.log("User in server component: ", user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {/* <AvatarImage src={user?.image || undefined} /> */}
          <AvatarFallback>
            {user!.email!.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
