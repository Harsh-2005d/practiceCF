import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../axios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/auth/me");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">PracticeCF</div>

        <div className="navbar-actions">
          <Link to="/">Home</Link>

          {isLoggedIn && <Link to="/profile">Profile</Link>}

          {!isLoggedIn ? (
            <button onClick={loginWithGoogle}>Sign in with Google</button>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
