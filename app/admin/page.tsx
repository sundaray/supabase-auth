import { createClient } from "@/supabase/server";
import { getUserRoleServer } from "@/lib/get-user-role-server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { role } = await getUserRoleServer();

  if (user && role !== "admin") {
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-semibold text-red-600">
          Admin Access Only
        </h1>
        <p className="mt-4 text-pretty font-medium text-muted-foreground">
          This page is only accessible to authenticated users having
          &quot;admin&quot; status.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 text-center">
      <h1 className="text-lg font-semibold text-green-600">Welcome Admin</h1>
      <p className="mt-4 text-sm">User email: {user?.email}</p>
      <p className="mt-4 text-pretty font-medium text-muted-foreground">
        This page is only accessible to authenticated users having
        &quot;admin&quot; status.
      </p>
    </div>
  );
}
