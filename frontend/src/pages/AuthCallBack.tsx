import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          navigate("/login");
          return;
        }

        const res = await api.get("/api/auth/google/callback", {
          params: { code },
        });

        const data = res.data;

        if (!data?.token) {
          navigate("/login");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (!data.user?.handle) {
          navigate("/profile");
        } else {
          navigate("/");
        }
      } catch {
        navigate("/login");
      }
    };

    finishLogin();
  }, [navigate]);

  return <p>Signing you in…</p>;
}
