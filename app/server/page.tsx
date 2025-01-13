import { createClient } from "@/supabase/server";
import { getUserRoleServer } from "@/lib/get-user-role-server";

export default async function ServerPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { role } = await getUserRoleServer();

  if (error) {
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-medium text-red-600">
          Please sign in to access user details.
        </h1>
        <p className="mt-4 font-medium text-muted-foreground">
          This is a Server Component.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 text-center">
      <h1 className="text-lg font-medium text-green-600">User Authenticated</h1>
      <p className="mt-4 text-sm">User email: {user?.email}</p>
      <p className="text-sm">User role: {role ? role : "Not available"}</p>
      <p className="mt-4 font-medium text-muted-foreground">
        This is a Server Component.
      </p>
    </div>
  );
}
