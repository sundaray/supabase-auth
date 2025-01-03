import { auth } from "@/auth";

export default async function ServerPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="mt-12 text-center">
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
    <div className="mt-12 text-center">
      <h1 className="text-xl font-medium text-green-600">User Authenticated</h1>
      <p className="mt-4 text-sm">User email: {session?.user?.email}</p>
      <p className="mt-4 font-medium text-gray-700">
        This is a Server Component.
      </p>
    </div>
  );
}
