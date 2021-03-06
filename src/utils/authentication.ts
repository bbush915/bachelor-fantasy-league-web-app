export function isAuthenticated(): boolean {
  const token = window.localStorage.getItem("token");
  return !!token;
}
