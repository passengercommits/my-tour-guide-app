import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Dublin! I'm Connor, your Irish tour guide. Ask me anything about Ireland or Dublin, and I'll make sure your visit is unforgettable!",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#101010",
        color: "#f2f2f2",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* --- Header --- */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #333",
          flexShrink: 0,
          backgroundColor: "#1e1e1e",
        }}
      >
        <img
          src="/myAIImage.png"
          alt="AI Avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "0.5rem",
          }}
        />
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Tour Guide Chat</h1>
      </header>

      {/* --- Chat Area --- */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              // Reduce vertical spacing between messages:
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                margin: "0.25rem 0", // or 0 if you want absolutely no gap
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "0.75rem 1rem",
                  borderRadius: "18px",
                  whiteSpace: "pre-wrap",
                  color: "#fff",
                  backgroundColor: isUser ? "#005dff" : "#333333",
                  fontSize: "1rem",
                  margin: 0, // ensures no extra margin on the bubble itself
                }}
              >
                {isUser ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Override default paragraph margin
                      p: ({ node, ...props }) => (
                        <p style={{ margin: 0 }} {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Footer (Suggested prompts + Input) --- */}
      <footer
        style={{
          borderTop: "1px solid #333",
          padding: "0.5rem",
          flexShrink: 0,
          backgroundColor: "#1e1e1e",
        }}
      >
        {/* Example suggested prompts */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
            opacity: 0.8,
          }}
        >
          {["Where's a good place to eat?", "Hidden gems?", "Best Guinness?"].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setUserInput(prompt)}
              style={{
                backgroundColor: "#3a3a3a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask your tour guide..."
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #555",
              backgroundColor: "#2b2b2b",
              color: "#fff",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: "#005dff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
