import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslationStore } from '~store/translationStore';
import '~main.css';
import Tooltip from '~components/Tooltip';
import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";

const GeminiContent = () => {
    const [translatedText, setTranslatedText] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const { getTranslation, addTranslation } = useTranslationStore();
    const spanRef = useRef(null);

    const handleTextClick = useCallback(async (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text) {
            const range = selection?.getRangeAt(0);
            if (range) {
                cleanupHighlights();

                if (!spanRef.current) {
                    spanRef.current = document.createElement('span');
                    spanRef.current.className = 'highlighted';
                    spanRef.current.textContent = text;
                }

                range.surroundContents(spanRef.current);

                const rect = spanRef.current.getBoundingClientRect();
                const cachedTranslation = getTranslation(text);

                if (cachedTranslation) {
                    setTranslatedText(cachedTranslation);
                    setTooltipPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX,
                    });
                } else {
                    const response = await sendToBackground({
                        name: "translate",
                        body: { text }
                    });

                    const translated = response.translatedText || 'Không thể dịch được.';
                    setTranslatedText(translated);
                    addTranslation(text, translated);
                    setTooltipPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX,
                    });
                }
            }
        } else {
            clearTooltip();
        }
    }, [getTranslation, addTranslation]);

    const clearTooltip = useCallback(() => {
        setTranslatedText(null);
        setTooltipPosition(null);
        cleanupHighlights();
    }, []);

    const cleanupHighlights = useCallback(() => {
        document.querySelectorAll('.highlighted').forEach((el) => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ''), el);
            }
        });
        spanRef.current = null;
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleTextClick);
        return () => {
            document.removeEventListener('click', handleTextClick);
        };
    }, [handleTextClick]);

    return (
        <>
            {tooltipPosition && translatedText && (
                <Tooltip
                    position={tooltipPosition}
                    text={translatedText}
                    onClose={clearTooltip}
                />
            )}
        </>
    );
};

const root = document.createElement('div');
const shadow = root.attachShadow({ mode: 'open' });
document.body.appendChild(root);
createRoot(shadow).render(<GeminiContent />);