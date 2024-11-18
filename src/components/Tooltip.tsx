// Tooltip.tsx
import React from "react";

interface TooltipProps {
    position: { top: number; left: number };
    text: string;
    onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({position, text, onClose}) => (
    <div
        className="absolute p-2 bg-white shadow-md rounded-md border"
        style={{
            top: position.top,
            left: position.left,
            zIndex: 9999
        }}
    >
        <p className="text-gray-800">{text}</p>
        <button
            className="mt-1 text-blue-500 hover:underline"
            onClick={onClose}
        >
            Close
        </button>
    </div>
);

export default Tooltip;