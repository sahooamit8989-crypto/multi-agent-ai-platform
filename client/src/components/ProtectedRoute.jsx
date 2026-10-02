import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  console.log("========== PROTECTED ROUTE ==========");
  console.log("Current path:", location.pathname);
  console.log("Token exists:", !!token);
  console.log("Token:", token ? "YES" : "NO");
  console.log("=====================================");

  if (!token) {
    console.log("No token found. Redirecting to login.");

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  console.log("Token found. Allowing access.");

  return <Outlet />;
}

export default ProtectedRoute;