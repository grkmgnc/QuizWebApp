import React from "react";

export const HeaderNav = ({ username, onNavSelect, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="navbar-brand">Admin Panel</div>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => onNavSelect("show-question")}
              >
                Manage Quizzes
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => onNavSelect("generate-quiz")}
              >
                Create New Quiz
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => onNavSelect("validate-answer")}
              >
                User Responses
              </button>
            </li>
            {username && (
              <li className="nav-item">
                <span className="nav-link text-light">
                  Welcome, {username}!
                </span>
              </li>
            )}
          </ul>

          <button className="btn btn-outline-light ms-lg-3" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};