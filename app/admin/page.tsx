import { createClient } from "@/supabase/server";
import { getUserRoleServer } from "@/lib/get-user-role-server";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { role } = await getUserRoleServer();

  // Fetch all users from the users table
  // If our admin policy is working, this will return all users
  // If it's not working, it will either return no data or only the admin's own record
  const { data: users, error } = await supabase
    .from("users")
    .select("email, role, id");

  // Add error handling to help debug any policy issues
  if (error) {
    console.error("Error fetching users:", error);
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-semibold text-red-600">
          Error Loading Users
        </h1>
        <p className="mt-4 text-pretty font-medium text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  console.log("Users from database: ", users);

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
      <div className="mt-8">
        <h2 className="text-lg font-semibold">All Users</h2>
        <div className="mx-auto mt-4 max-w-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Email</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-left font-medium">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-right">{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
