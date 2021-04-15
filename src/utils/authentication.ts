export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

export function getToken(): string | null {
  const token = window.localStorage.getItem("token");
  return token;
}
