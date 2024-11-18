const GOOGLE_API_KEY = "AIzaSyAjemEfWe9DBRcCamZ7OaxzpGKKOoQZcQo"; // Thay YOUR_API_KEY bằng API key của bạn
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;

// Nhận yêu cầu từ content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TRANSLATE_TEXT") {
    const { text } = message;

    // Prompt để yêu cầu API trả về bản dịch cụ thể
    const prompt = `Translate the following English text to Vietnamese without additional context: "${text}"`;

    fetch(GEMINI_API_URL, {
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
    })
      .then((response) => response.json())
      .then((data) => {
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể dịch được.";
        console.log("content: ", content)
        sendResponse({ translatedText: content });
      })
      .catch((error) => {
        console.error("Gemini API error:", error);
        sendResponse({ error: "Có lỗi xảy ra trong quá trình gọi API." });
      });

    return true; // Giữ sendResponse chờ kết quả async
  }
});
