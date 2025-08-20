import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRegisterSuccess }) => { // receive prop from App
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://5000-vishalp143-chatapp-4hkje45j63g.ws-us121.gitpod.io/auth/register",
        { username, email, password }
      );

      console.log(res.data);
      setMessage(res.data.message || "Registration successful!");

      // Call App to switch back to login page
      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess(); // switch to login after 1s
        }, 1000);
      }
    } catch (err) {
      console.error(err.response?.data);
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
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
          Register
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
