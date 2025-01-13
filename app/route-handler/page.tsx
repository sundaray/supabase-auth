"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

type DataItem = {
  id: number;
  title: string;
  description: string;
};

export default function RouteHandlerPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);

  const handleFetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/data");

      if (response.redirected) {
        router.push(response.url);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4">
      <div className="flex flex-col items-center space-y-8">
        <Button onClick={handleFetchData} disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 size-4 animate-spin" />
              Fetching...
            </>
          ) : (
            "Fetch Data"
          )}
        </Button>

        {data.length > 0 && (
          <div className="grid gap-4">
            {data.map((item) => (
              <div key={item.id} className="rounded-md border p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
