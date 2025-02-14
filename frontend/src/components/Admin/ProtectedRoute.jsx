import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRouteAdmin({ children }) {
  const navigate = useNavigate()
  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    const role = localStorage.getItem("userRole")
    if (loginStatus !== "true" || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
  return children;
}