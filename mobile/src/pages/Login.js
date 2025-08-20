import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess }) => { // receive onLoginSuccess prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://5000-vishalp143-chatapp-4hkje45j63g.ws-us121.gitpod.io/auth/login",
        { email, password }
      );

      console.log(res.data);
      setMessage("Login successful!");

      // Pass the user object to App
      if (res.data.user && onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }

      // Optionally save token for protected routes
      // localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err.response?.data);
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
        <button type="submit" style={{ padding: 8, width: "100%" }}>
          Login
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
