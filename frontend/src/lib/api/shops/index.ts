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
  // ...
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

export async function createShop(data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return handleResponse(response);
}

export async function getShops(params?: {
  owner?: string;
  status?: string;
  token?: string;
}) {
  const query = new URLSearchParams();
  if (params?.owner) query.append("owner", params.owner);
  if (params?.status) query.append("status", params.status);

  const headers: HeadersInit = {};
  if (params?.token) {
    headers["Authorization"] = `Bearer ${params.token}`;
  }

  const response = await fetch(
    `${BASE_URL}/market/shops/?${query.toString()}`,
    {
      headers,
    },
  );
  return handleResponse(response);
}

export async function getShop(id: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/`);
  return handleResponse(response);
}

export async function updateShop(id: number, data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return handleResponse(response);
}

export async function deleteShop(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}

export async function resetShop(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/reset/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ confirm: true }),
  });
  return handleResponse(response);
}
