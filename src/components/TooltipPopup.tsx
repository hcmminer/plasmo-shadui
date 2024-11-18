import React from "react";

type TooltipPopupProps = {
    text: string;
    x: number;
    y: number;
    onClose: () => void;
};

export const TooltipPopup: React.FC<TooltipPopupProps> = ({
                                                              text,
                                                              x,
                                                              y,
                                                              onClose,
                                                          }) => {
    return (
        <div
            className="absolute z-50 p-2 bg-white shadow-md rounded-md border border-gray-200"
            style={{ top: y, left: x }}
            role="tooltip"
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
};
