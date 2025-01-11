import { createClient } from "@/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.role === "user") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-xl font-medium text-red-600">Admin Access Only</h1>
        <p className="mt-4 text-pretty font-medium text-gray-700">
          This page is only accessible to authenticated users having
          &quot;admin&quot; status.
        </p>
      </div>
    );
  }

  return (
    <h1 className="text-center text-xl font-medium text-green-600">
      Welcome Admin
    </h1>
  );
}
