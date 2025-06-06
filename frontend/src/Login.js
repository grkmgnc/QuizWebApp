import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getDecodedToken } from "./utils/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt_token");
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username: username,
        password: password
      }, {
        headers: {} // 👈 override edip boş gönder
      });


      if (!response.data?.token) {
        setError("Giriş başarısız. Yanıt hatalı.");
        return;
      }
      console.log("Gelen cevap:", response.data)
      const token = response.data.token;
      localStorage.setItem("jwt_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const decodedToken = getDecodedToken();
      const role = decodedToken?.role;

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "USER") {
        navigate("/user-dashboard");
      } else {
        setError("Geçersiz kullanıcı rolü");
      }

    } catch (error) {
        console.error("Login hatası:", error);

        if (error.response) {
          const data = error.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (typeof data?.message === "string") {
            setError(data.message);
          } else {
            setError("Sunucu hatası");
          }

        } else {
          setError("Bağlantı hatası");
        }
      }

  };

  const goToRegister = () => navigate("/register");

return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Log In
          </button>

          {error && (
            <div className="alert alert-danger mt-3 text-center" role="alert">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <button className="btn btn-sm text-primary fw-semibold border-0 bg-transparent"
            onClick={goToRegister}>
              Register
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;