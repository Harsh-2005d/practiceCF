const BACKEND_URL = "http://localhost:3000";

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
