import "../styles/navbar.css";
import {Link} from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">PracticeCF</div>

        <div className="navbar-actions">
          <Link to="/" >Home</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
