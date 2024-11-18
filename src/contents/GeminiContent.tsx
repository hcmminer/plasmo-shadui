import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { TooltipPopup } from "~components/TooltipPopup";
import { useTranslationStore } from "~store/translationStore";
import "~main.css";

const GeminiContent = () => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const { getTranslation, addTranslation } = useTranslationStore();

  const handleTextClick = (event: MouseEvent) => {
    // Ignore clicks inside the tooltip
    if ((event.target as HTMLElement).closest("[role='tooltip']")) return;

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text) {
      const cachedTranslation = getTranslation(text);
      const { clientX, clientY } = event;

      if (cachedTranslation) {
        setSelectedText(text);
        setTranslatedText(cachedTranslation);
        setTooltipPosition({ x: clientX + 10, y: clientY + 10 }); // Adjust for spacing
      } else {
        chrome.runtime.sendMessage(
            { type: "TRANSLATE_TEXT", text },
            (response) => {
              setSelectedText(text);
              const translated = response.translatedText || "Không thể dịch được.";
              setTranslatedText(translated);
              addTranslation(text, translated);
              setTooltipPosition({ x: clientX + 10, y: clientY + 10 });
            }
        );
      }
    } else {
      setSelectedText(null);
      setTranslatedText(null);
      setTooltipPosition(null);
    }
  };

  const handleCloseTooltip = () => {
    setSelectedText(null);
    setTranslatedText(null);
    setTooltipPosition(null);
  };

  useEffect(() => {
    document.addEventListener("click", handleTextClick);
    return () => {
      document.removeEventListener("click", handleTextClick);
    };
  }, []);

  return (
      <>
        {selectedText && translatedText && tooltipPosition && (
            <TooltipPopup
                text={translatedText}
                x={tooltipPosition.x}
                y={tooltipPosition.y}
                onClose={handleCloseTooltip}
            />
        )}
      </>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<GeminiContent />);
