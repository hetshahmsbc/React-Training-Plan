import type { Department } from "./types";

// Each department gets its own brand color (used for avatars + badges).
export const departmentColor: Record<Department, string> = {
  Engineering: "#6366f1", // indigo
  Design: "#ec4899", // pink
  Sales: "#f59e0b", // amber
  HR: "#10b981", // green
};

// "Aisha Khan" -> "AK"
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts[0] === "") return "?";
  return parts
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
