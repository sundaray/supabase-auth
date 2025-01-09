import { createClient } from "@/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mt-12 text-center">
      <h1 className="text-xl font-medium text-green-600">User Authenticated</h1>
      <p className="mt-4 text-sm">User email: {user?.email}</p>
      <p className="mt-4 text-pretty font-medium text-gray-700">
        This is a private page, only accessible to authenticated users.
      </p>
    </div>
  );
}
