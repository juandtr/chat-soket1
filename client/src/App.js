import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import EmojiPicker from "react-emoji-picker";

const socket = io("/");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
    socket.emit("message", newMessage.body);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji);
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="p-3 bg-zinc-900">
            <h1 className="text-2xl font-bold my-2">Chat React</h1>
          </div>
          <ul className="h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`my-2 p-2 table text-sm rounded-md ${
                  message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
                }`}
              >
                <b>{message.from}</b>: {message.body}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
          <form onSubmit={handleSubmit} className="p-3 bg-zinc-900">
            <div className="relative">
              <input
                name="message"
                type="text"
                placeholder="Write your message..."
                onChange={(e) => setMessage(e.target.value)}
                className="border-2 border-zinc-500 p-2 w-full text-black pr-12"
                value={message}
                autoFocus
              />
              <button
                type="button"
                className="absolute right-0 bottom-0 p-2 focus:outline-none"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😄
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
