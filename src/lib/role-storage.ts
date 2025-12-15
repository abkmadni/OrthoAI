export type UserRole = "admin" | "dentist" | "staff";

const KEY = "orthoai_role";

export function getStoredRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(KEY);
  if (value === "dentist" || value === "staff" || value === "admin") return value as UserRole;
  return null;
}

export function setStoredRole(role: UserRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, role);
}

export function clearStoredRole() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
