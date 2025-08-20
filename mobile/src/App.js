import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(true); // toggle between login/register
  const [user, setUser] = useState(null); // store logged-in user

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // user is logged in → show Chat page
  };

  // For simplicity, fixed conversation ID
  const conversationId = "conversation_1";

  // If user is logged in, show Chat page
  if (user) {
    return <Chat user={user} conversationId={conversationId} />;
  }

  return (
    <div className="App">
      {showLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Register onRegisterSuccess={() => setShowLogin(true)} />
      )}

      <div style={{ marginTop: 20 }}>
        {showLogin ? (
          <p>
            Don't have an account?{" "}
            <button onClick={() => setShowLogin(false)}>Register</button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setShowLogin(true)}>Login</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
