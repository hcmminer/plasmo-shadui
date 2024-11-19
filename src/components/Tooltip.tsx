import React from 'react';

interface TooltipProps {
    position: { top: number; left: number };
    text: string;
    onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ position, text, onClose }) => (
    <div
        style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '5px',
            zIndex: 1000,
        }}
    >
        {text}
        <button onClick={onClose}>Close</button>
    </div>
);

export default Tooltip;
