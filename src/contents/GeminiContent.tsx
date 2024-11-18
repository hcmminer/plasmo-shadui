import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useTranslationStore } from "~store/translationStore";
import "~main.css";

const GeminiContent = () => {
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const { getTranslation, addTranslation } = useTranslationStore();

    const handleTextClick = (event: MouseEvent) => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text) {
            const range = selection?.getRangeAt(0);
            if (range) {
                // Clean up previous highlights
                cleanupHighlights();

                // Wrap selected text with a span
                const span = document.createElement("span");
                span.className = "highlighted";
                span.textContent = text;

                range.surroundContents(span);

                // Get position of the span for tooltip
                const rect = span.getBoundingClientRect();
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
    };

    const clearTooltip = () => {
        setSelectedText(null);
        setTranslatedText(null);
        setTooltipPosition(null);
        cleanupHighlights();
    };

    const cleanupHighlights = () => {
        document.querySelectorAll(".highlighted").forEach((el) => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ""), el);
            }
        });
    };

    useEffect(() => {
        document.addEventListener("click", handleTextClick);
        return () => {
            document.removeEventListener("click", handleTextClick);
        };
    }, []);

    return (
        <>
            {tooltipPosition && translatedText && (
                <div
                    className="tooltip absolute z-50 p-2 bg-white shadow-md rounded-md border"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                    }}
                >
                    <p className="text-sm text-gray-800">{translatedText}</p>
                    <button
                        className="mt-1 text-xs text-blue-500 hover:underline"
                        onClick={clearTooltip}
                    >
                        Close
                    </button>
                </div>
            )}
            <style>{`
        .highlighted {
          background-color: yellow;
          font-weight: bold;
        }
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
