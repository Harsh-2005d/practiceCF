import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom";

export default function AuthFinish() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return <p>Signing you in…</p>;
}
