"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ApiTest() {
  const [data, setData] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/hello/");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({
        message: "Failed to connect to backend. Make sure it's running!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Button
        onClick={fetchData}
        className="rounded-xl font-medium shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95 px-6 py-6 h-auto text-lg"
        disabled={loading}
      >
        {loading ? "Checking connection..." : "Test Backend Connection"}
      </Button>
      {data && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-zinc-300 font-mono text-sm">{data.message}</p>
        </div>
      )}
    </div>
  );
}
