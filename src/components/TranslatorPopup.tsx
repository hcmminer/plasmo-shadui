import React from "react";

type TranslatorPopupProps = {
    text: string;
    onClose: () => void;
};

export const TranslatorPopup: React.FC<TranslatorPopupProps> = ({ text, onClose }) => {
    return (
        <div
            className="translator-popup"
            style={{
                position: "absolute",
                top: "100px", // Position as needed
                left: "100px",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                zIndex: 9999,
            }}
        >
            <p style={{ marginBottom: "10px" }}>{text}</p>
            <button
                onClick={onClose}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#555",
                }}
            >
                Close
            </button>
        </div>
    );
};
