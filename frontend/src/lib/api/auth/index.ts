const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function login(credentials: any) {
  const response = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Invalid credentials");
  return response.json();
}

export async function register(data: any) {
  const response = await fetch(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
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
