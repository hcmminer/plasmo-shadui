// background/messages/translate.ts
import type { PlasmoMessaging } from "@plasmohq/messaging";

const GOOGLE_API_KEY = "AIzaSyAjemEfWe9DBRcCamZ7OaxzpGKKOoQZcQo";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { text } = req.body;

    const prompt = `Translate the following English text to Vietnamese without additional context: "${text}"`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể dịch được.";
        res.send({ translatedText: content });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.send({ error: `Có lỗi xảy ra trong quá trình gọi API: ${error.message}` });
    }
};

export default handler;