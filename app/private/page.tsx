import { createClient } from "@/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="px-4 text-center">
      <h1 className="text-lg text-xl font-semibold text-green-600">
        User Authenticated
      </h1>
      <p className="mt-4 text-sm">User email: {user?.email}</p>
      <p className="mt-4 text-pretty font-medium text-muted-foreground">
        This page is only accessible to authenticated users.
      </p>
    </div>
  );
}
