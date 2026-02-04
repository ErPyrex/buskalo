const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function createShop(data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) throw new Error("Failed to create shop");
  return response.json();
}

export async function getShops(params?: { owner?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.owner) query.append("owner", params.owner);
  if (params?.status) query.append("status", params.status);

  const response = await fetch(`${BASE_URL}/market/shops/?${query.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch shops");
  return response.json();
}

export async function getShop(id: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/`);
  if (!response.ok) throw new Error("Failed to fetch shop");
  return response.json();
}

export async function updateShop(id: number, data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) throw new Error("Failed to update shop");
  return response.json();
}

export async function deleteShop(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/market/shops/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete shop");
  return true;
}
