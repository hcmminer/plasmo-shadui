import React, {useState, useEffect, useCallback, useRef} from "react";
import { createRoot } from "react-dom/client";
import { useTranslationStore } from "~store/translationStore";
import "~main.css";

const GeminiContent = () => {
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const { getTranslation, addTranslation } = useTranslationStore();
    const spanRef = useRef<HTMLSpanElement | null>(null);

    const handleTextClick = useCallback((event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text) {
            const range = selection?.getRangeAt(0);
            if (range) {
                // Clean up previous highlights
                cleanupHighlights();

                // Wrap selected text with a span
                if (!spanRef.current) {
                    spanRef.current = document.createElement("span");
                    spanRef.current.className = "highlighted";
                    spanRef.current.textContent = text;
                }

                range.surroundContents(spanRef.current);

                // Get position of the span for tooltip
                const rect = spanRef.current.getBoundingClientRect();
                const cachedTranslation = getTranslation(text);

                if (cachedTranslation) {
                    setSelectedText(text);
                    setTranslatedText(cachedTranslation);
                    setTooltipPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX,
                    });
                } else {
                    chrome.runtime.sendMessage(
                        { type: "TRANSLATE_TEXT", text },
                        (response) => {
                            const translated = response.translatedText || "Không thể dịch được.";
                            setSelectedText(text);
                            setTranslatedText(translated);
                            addTranslation(text, translated);
                            setTooltipPosition({
                                top: rect.bottom + window.scrollY,
                                left: rect.left + window.scrollX,
                            });
                        }
                    );
                }
            }
        } else {
            clearTooltip();
        }
    }, []);

    const clearTooltip = useCallback(() => {
        setSelectedText(null);
        setTranslatedText(null);
        setTooltipPosition(null);
        cleanupHighlights();
    }, []);

    const cleanupHighlights = useCallback(() => {
        document.querySelectorAll(".highlighted").forEach((el) => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ""), el);
            }
        });
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleTextClick);
        return () => {
            document.removeEventListener("click", handleTextClick);
        };
    }, [handleTextClick]);

    const Tooltip = ({ position, text, onClose }) => (
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

    return (
        <>
            {tooltipPosition && translatedText && (
                <Tooltip
                    position={tooltipPosition}
                    text={translatedText}
                    onClose={clearTooltip}
                />
            )}
            <style>{`
        .tooltip {
          position: absolute;
        }
      `}</style>
        </>
    );
};

const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<GeminiContent />);
