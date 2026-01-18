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
        `${BACKEND_URL}/api/auth/google/callback?code=${code}`
      );

      const data = await res.json();

      if (!data.token) {
        navigate("/login");
        return;
      }

      // store auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (!data.user.handle) {
        navigate("/set-handle");
      } else {
        navigate("/");
      }
    }

    finishLogin();
  }, [navigate]);

  return <p>Signing you in…</p>;
}
