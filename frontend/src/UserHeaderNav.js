import React from "react";
import { useNavigate } from "react-router-dom";

const UserHeaderNav = ({ username, setActivePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="navbar-brand">Quiz App</div>

        {/* Mobil uyumlu hamburger butonu */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userNavbar"
          aria-controls="userNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Açılır kapanır içerik */}
        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {username && (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">
                    Welcome, {username}!
                  </span>
                </li>

                {/* 🔹 Quiz Listesi Butonu */}
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link text-light"
                    onClick={() => setActivePage("dashboard")}
                  >
                    Quiz List
                  </button>
                </li>

                {/* 🔹 Solved Quizzes Butonu */}
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link text-light"
                    onClick={() => setActivePage("solved-quizzes")}
                  >
                    Solved Quizzes
                  </button>
                </li>
              </>
            )}
          </ul>

          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserHeaderNav;
