import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">PracticeCF</div>

        <div className="navbar-actions">
          <button>Home</button>
          <button>Dashboard</button>
          <button>Profile</button>
          <button className="logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
