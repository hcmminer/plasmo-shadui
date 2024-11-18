import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { TranslatorPopup } from "~components/TranslatorPopup";
import { useTranslationStore } from "~store/translationStore";

const GeminiContent = () => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const { getTranslation, addTranslation } = useTranslationStore();

  const handleTextClick = (event: MouseEvent) => {
    // Ignore clicks inside the popup
    if ((event.target as HTMLElement).closest(".translator-popup")) {
      return;
    }

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text) {
      const cachedTranslation = getTranslation(text);
      if (cachedTranslation) {
        setSelectedText(text);
        setTranslatedText(cachedTranslation);
      } else {
        chrome.runtime.sendMessage(
            { type: "TRANSLATE_TEXT", text },
            (response) => {
              setSelectedText(text);
              const translated = response.translatedText || "Không thể dịch được.";
              setTranslatedText(translated);
              addTranslation(text, translated);
            }
        );
      }
    } else {
      // Clear popup if no text is selected
      setSelectedText(null);
      setTranslatedText(null);
    }
  };

  const handleClosePopup = () => {
    setSelectedText(null);
    setTranslatedText(null);
  };

  useEffect(() => {
    document.addEventListener("click", handleTextClick);
    return () => {
      document.removeEventListener("click", handleTextClick);
    };
  }, []);

  return (
      <>
        {selectedText && translatedText && (
            <TranslatorPopup
                text={translatedText}
                onClose={handleClosePopup}
            />
        )}
      </>
  );
};



// Render GeminiContent
const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<GeminiContent />);
