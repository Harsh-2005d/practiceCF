import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthFinish() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    // optional: clear token from URL
    window.history.replaceState({}, "", "/");

    navigate("/");
  }, [navigate]);

  return <p>Signing you in…</p>;
}
