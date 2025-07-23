//
// All REST API operations: registration, login, profile, and CRUD tasks
//
const API_BASE =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"; // fallback dev value

// Helper for parsing JSON or error
async function parseResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { detail: "Invalid response" };
  }
  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data;
}

// PUBLIC_INTERFACE
export async function register({ username, email, password }) {
  // Replace endpoints with actual ones when backend is available
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function updateProfile(token, profile) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function fetchTasks(token) {
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function createTask(token, data) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function updateTask(token, id, data) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteTask(token, id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse(res);
}

