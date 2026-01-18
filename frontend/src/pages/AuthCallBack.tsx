import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        `${BACKEND_URL}/auth/google/callback?code=${code}`
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        navigate("/login");
      }
    }

    finishLogin();
  }, [navigate]);

  return <p>Signing you in…</p>;
}
