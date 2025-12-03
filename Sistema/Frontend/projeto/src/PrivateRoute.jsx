import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = JSON.parse(localStorage.getItem("token"));

  // Se não tiver token → envia para login
  if (!token || !token.access) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
