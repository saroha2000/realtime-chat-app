
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function ChatApp() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("Alice");
  const [recipient, setRecipient] = useState("Bob");

  useEffect(() => {
    socket.emit("register", username);

    socket.on("receive_message", (data) => {
      setChat(prev => [...prev, `${data.from}: ${data.message}`]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", {
      from: username,
      to: recipient,
      message: message
    });
    setChat(prev => [...prev, `Me: ${message}`]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat with {recipient}</h2>
      <div>
        {chat.map((msg, i) => <p key={i}>{msg}</p>)}
      </div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatApp;
