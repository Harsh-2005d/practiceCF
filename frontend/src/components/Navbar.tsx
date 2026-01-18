import "../styles/navbar.css";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">PracticeCF</div>

        <div className="navbar-actions">
          <Link to="/">Home</Link>

          {isLoggedIn && <Link to="/profile">Profile</Link>}

          {!isLoggedIn ? (
            <button
              onClick={() => {
                window.location.href = `${BACKEND_URL}/api/auth/google`;
              }}
            >
              Sign in with Google
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
