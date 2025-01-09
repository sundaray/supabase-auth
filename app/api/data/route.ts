import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const callbackUrl = encodeURIComponent("/route-handler");
    redirect(`/signin?from=${callbackUrl}`);
  }

  const data = [
    {
      id: 1,
      title: "Protected Resource 1",
      description: "This is a secret piece of data.",
    },
    {
      id: 2,
      title: "Protected Resource 2",
      description: "This is another secret piece of data.",
    },
  ];

  return Response.json({ success: true, data });
}
