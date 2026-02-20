import {Navigate} from "react-router-dom";

export default function ProtectedRoute({children }) {
  const authed = localStorage.getItem("clearsym_authed") === "true";
  if (!authed) return <Navigate to="/signin" replace />;
  return children;
}
