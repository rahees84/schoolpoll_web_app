import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // refresh to update nav
  };

  const renderUserAvatar = () => {
    const firstChar = user?.name?.charAt(0)?.toUpperCase() || '?';

    return (
      <div className="dropdown">
        <button
          className="btn btn-light rounded-circle fw-bold text-primary"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            fontSize: '1.2rem',
            lineHeight: '40px',
            textAlign: 'center'
          }}
          title={user.name}
        >
          {firstChar}
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link className="navbar-brand" to="/">🏫 School Poll</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav align-items-center">
          {user ? (
            <>
              <li className="nav-item">
  <Link className="nav-link" to="/candidates">
    <i className="fas fa-users me-1"></i> Candidates
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/voters">
    <i className="fas fa-id-card me-1"></i> Voters
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/poll">
    <i className="fas fa-user-check me-1"></i> Polling Panel
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/voting-machine">
    <i className="fas fa-check-square me-1"></i> Voting Machine
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/result">
    <i className="fas fa-chart-bar me-1"></i> Result
  </Link>
</li>
<li className="nav-item ms-3">
  {renderUserAvatar()}
</li>

            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login"><i className="fas fa-sign-in-alt me-1"></i> Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup"><i className="fas fa-user-plus me-1"></i> Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
