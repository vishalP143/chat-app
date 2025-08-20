import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

// Connect to backend Socket.IO
const socket = io("http://localhost:5000"); 

const Chat = ({ user, conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");

  // Load previous messages and setup socket listeners
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://5000-vishalp143-chatapp-4hkje45j63g.ws-us121.gitpod.io/messages/${conversationId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    // Join conversation room
    socket.emit("joinConversation", conversationId);

    // Listen for new messages
    socket.on("message:new", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicator
    socket.on("typing:start", (typingUser) => {
      setTypingUser(typingUser);
    });

    socket.on("typing:stop", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("message:new");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [conversationId]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!text) return;

    socket.emit("message:send", {
      conversationId,
      sender: user.id,
      text,
    });

    // Stop typing when message sent
    socket.emit("typing:stop", user.username);

    setText("");
  };

  // Emit typing events
  const handleTyping = (e) => {
    setText(e.target.value);
    if (e.target.value) {
      socket.emit("typing:start", user.username);
    } else {
      socket.emit("typing:stop", user.username);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "20px auto" }}>
      <h2>Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "scroll",
          marginBottom: 10,
        }}
      >
        {messages.map((msg) => (
          <div key={msg._id || Math.random()} style={{ marginBottom: 8 }}>
            <strong>{msg.sender === user.id ? "You" : msg.sender}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      {typingUser && <p><em>{typingUser} is typing...</em></p>}
      <form onSubmit={handleSend} style={{ display: "flex" }}>
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 5 }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
