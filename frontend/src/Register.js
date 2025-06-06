import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); // önceki mesajları temizle

    try {
      // 🔹 1. Kayıt isteği
      const registerResponse = await axios.post("/api/register", {
        username,
        email,
        password,
      });

      console.log("Kayıt başarılı:", registerResponse.data);

      // 🔹 2. Kayıt başarılıysa login dene
      try {
        const loginResponse = await axios.post("/api/login", {
          username,
          password,
        });

        const token = loginResponse.data.token || loginResponse.data;
        localStorage.setItem("token", token);

        setMessage("✅ Kayıt ve giriş başarılı! Yönlendiriliyor...");
        return navigate("/user-dashboard");
      } catch (loginError) {
        console.error("Giriş hatası:", loginError);
        setMessage("Kayıt başarılı ama giriş yapılamadı.");
      }

    } catch (registerError) {
      const msg = registerError.response?.data;
      const status = registerError.response?.status;

      console.error("Kayıt hatası:", registerError);

      if (status === 409) {
        setMessage("❗ " + msg);
      } else {
        setMessage("Sunucu hatası! Lütfen tekrar deneyin.");
      }
    }
  };

 return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "100%", maxWidth: "450px" }}>
        <h3 className="text-center mb-4">Register</h3>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        {message && (
          <div
            className={`alert mt-3 text-center ${
              message.startsWith("✅")
                ? "alert-success"
                : message.startsWith("❗")
                ? "alert-warning"
                : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <button className="btn btn-sm text-primary fw-semibold border-0 bg-transparent"
            style={{ textDecoration: "none" }}
            onClick={() => navigate("/login")}>
              Log In
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
