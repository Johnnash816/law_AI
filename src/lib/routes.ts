const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
const ADMIN_ROUTES = ["/admin"];
export const isPublicRoute = (path: string) => {
  // Return true if route is in PUBLIC ROUTES
  return PUBLIC_ROUTES.find((route) => path.startsWith(route));
};

export const isAdminRoute = (path: string) => {
  // Return true if route is in ADMIN ROUTES
  return ADMIN_ROUTES.find((route) => path.startsWith(route));
};
