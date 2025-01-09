import { auth } from "@/auth"
 
export default async function AdminPage() {
  const session = await auth()
 
  if (session?.user?.role === "user") {
    return (
      <div className="mx-auto mt-12 max-w-lg text-center">
        <h1 className="text-xl font-medium text-red-600">Admin Access Only</h1>
        <p className="mt-4 text-pretty font-medium text-gray-700">
          This page is only accessible to authenticated users having
          &quot;admin&quot; status.
        </p>
      </div>
    )
  }
 
  return (
    <h1 className="mt-12 text-center text-xl font-medium text-green-600">
      Welcome Admin
    </h1>
  )
}