import type { Product } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/market/products/`, {
      cache: "no-store", // Ensure we get fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}
