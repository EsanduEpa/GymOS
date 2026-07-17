const TOKEN_KEY = "gymos_access_token";
const REFRESH_TOKEN_KEY = "gymos_refresh_token";
const USER_KEY = "gymos_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setToken(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  // Also set as cookie for middleware access
  document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Remove cookie
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function setUser(user: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  const exp = decoded.exp as number;
  return Date.now() >= exp * 1000;
}

export function getUserRole(token: string): string | null {
  const decoded = parseJwt(token);
  if (!decoded) return null;
  return (decoded.role as string) || null;
}

export function getRoleDashboardPath(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin";
    case "GYM_OWNER":
    case "GYM_ADMIN":
      return "/gym";
    case "TRAINER":
      return "/trainer";
    case "MEMBER":
      return "/member";
    default:
      return "/login";
  }
}
