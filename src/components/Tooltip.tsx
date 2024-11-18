// Tooltip.tsx
import React from "react";

interface TooltipProps {
    position: { top: number; left: number };
    text: string;
    onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ position, text, onClose }) => (
    <div
        className="tooltip absolute z-50 p-2 bg-white shadow-md rounded-md border"
        style={{
            top: position.top,
            left: position.left,
        }}
    >
        <p className="text-sm text-gray-800">{text}</p>
        <button
            className="mt-1 text-xs text-blue-500 hover:underline"
            onClick={onClose}
        >
            Close
        </button>
    </div>
);

export default Tooltip;