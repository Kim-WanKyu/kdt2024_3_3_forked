import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface ListPopupProps {
  deliveryList: { delivery: string; count: string }[];
  onClose: () => void;
}

const ListPopup: React.FC<ListPopupProps> = ({ deliveryList, onClose }) => {
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)", // 반투명 배경
        zIndex: 9998,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        ref={popupRef}
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "300px",
          maxHeight: "400px",
          overflowY: "auto",
          zIndex: 9999,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <div
          style={{
            fontSize: "18px",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          배달부 리스트
        </div>
        <div>
          {deliveryList.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              <Link to={"/chatPage"}>
                <strong>{msg.delivery}:</strong> {msg.count}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPopup;
