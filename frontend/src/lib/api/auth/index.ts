const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function login(credentials: any) {
  const response = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.error || "Invalid credentials",
    );
  }
  return response.json();
}

export async function register(data: any) {
  const response = await fetch(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // DRF typically returns error details in the response body
    const errorMessage =
      Object.values(errorData).flat().join(" ") || "Registration failed";
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchProfile(token: string) {
  const response = await fetch(`${BASE_URL}/auth/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Could not fetch profile");
  return response.json();
}

export async function updateProfile(data: FormData, token: string) {
  const response = await fetch(`${BASE_URL}/auth/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      Object.values(errorData).flat().join(" ") || "Update failed";
    throw new Error(errorMessage);
  }
  return response.json();
}
