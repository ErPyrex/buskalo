import type { Product } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getProducts(shopId?: string): Promise<Product[]> {
  try {
    const url = shopId
      ? `${BASE_URL}/market/products/?shop_id=${shopId}`
      : `${BASE_URL}/market/products/`;

    const response = await fetch(url, {
      cache: "no-store",
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

export async function createProduct(data: any, token: string) {
  const response = await fetch(`${BASE_URL}/market/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export async function updateProduct(id: number, data: any, token: string) {
  const response = await fetch(`${BASE_URL}/market/products/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/market/products/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return true;
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/market/categories/`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}
