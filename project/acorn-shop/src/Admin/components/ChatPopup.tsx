import React, { useEffect, useRef } from "react";

interface ChatPopupProps {
  chatTitle: string;
  messages: { sender: string; text: string }[];
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({
  chatTitle,
  messages,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        height: "400px",
        background: "white",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>{chatTitle}</h3>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "8px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPopup;
