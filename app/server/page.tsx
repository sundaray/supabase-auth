import { createClient } from "@/supabase/server";

export default async function ServerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-medium text-red-600">
          User Not Authenticated
        </h1>
        <p className="mt-4 text-sm">User email: Not available</p>
        <p className="text-sm">User role: Not available</p>
        <p className="mt-4 font-medium text-gray-700">
          This is a Server Component.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-xl font-medium text-green-600">User Authenticated</h1>
      <p className="mt-4 text-sm">User email: {user?.email}</p>
      <p className="mt-4 font-medium text-gray-700">
        This is a Server Component.
      </p>
    </div>
  );
}
