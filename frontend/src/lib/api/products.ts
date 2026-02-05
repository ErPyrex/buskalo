import type { Product } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage =
      errorData.detail || errorData.error || `HTTP error! status: ${response.status}`;

    // Handle Django REST Framework field-specific validation errors
    if (typeof errorData === "object" && !errorData.detail && !errorData.error) {
      const fieldErrors = Object.entries(errorData)
        .map(([field, errors]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          const messages = Array.isArray(errors) ? errors.join(" ") : errors;
          return `${fieldName}: ${messages}`;
        })
        .join(" | ");
      if (fieldErrors) errorMessage = fieldErrors;
    }

    throw new Error(errorMessage);
  }
  const data = await response.json();
  // Handle DRF pagination
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray(data.results)
  ) {
    return data.results;
  }
  return data;
}

export async function getProducts(shopId?: string): Promise<Product[]> {
  try {
    const url = shopId
      ? `${BASE_URL}/market/products/?shop_id=${shopId}`
      : `${BASE_URL}/market/products/`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    return handleResponse(response);
  } catch (error) {
    console.error("API Error in getProducts:", error);
    throw error; // Re-throw to handle in UI
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${BASE_URL}/market/products/${id}/`, {
      cache: "no-store",
    });

    if (response.status === 404) return null;
    return handleResponse(response);
  } catch (error) {
    console.error("API Error in getProduct:", error);
    throw error;
  }
}

export async function createProduct(data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/market/products/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return handleResponse(response);
}

export async function updateProduct(id: number, data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/market/products/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return handleResponse(response);
}

export async function deleteProduct(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/market/products/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/market/categories/`);
  return handleResponse(response);
}
