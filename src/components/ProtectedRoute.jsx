// src/components/ProtectedRoute.jsx
// Wrap any page that requires login with this component

import { isLoggedIn } from "../api/authApi";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}