import React, { useState, useRef, useEffect } from "react";

type Message = { text: string; sender: "me" | "other person" };

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);

  //임의 채팅 확인용
  const getBotResponse = (message: string): string => {
    return message.includes("안녕")
      ? "안녕하세요! 😊"
      : "잘 이해하지 못했어요. 😅";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { text: input, sender: "me" }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages([
        ...newMessages,
        { text: getBotResponse(input), sender: "other person" },
      ]);
    }, 500);
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        width: "300px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
              background: msg.sender === "me" ? "#4CAF50" : "#eee",
              color: msg.sender === "me" ? "white" : "black",
              padding: "8px 12px",
              borderRadius: "15px",
              marginBottom: "5px",
              maxWidth: "70%",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "5px",
            padding: "8px",
            border: "none",
            background: "#007bff",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;
