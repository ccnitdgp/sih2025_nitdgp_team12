import express from "express";

const router = express.Router();

const languageMap = {
  auto: "auto-detect",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  or: "Odia",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
  bn: "Bengali",
  pa: "Punjabi",
  ur: "Urdu",
  en: "English",
};

router.post("/", async (req, res) => {
  try {
    const { audio, sourceLanguage, targetLanguage } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "Audio data is required" });
    }

    const sourceLangName = languageMap[sourceLanguage] || sourceLanguage;
    const targetLangName = languageMap[targetLanguage] || targetLanguage;

    const apiKey = process.env.GOOGLE_GEMIN_API;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const combinedResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    sourceLanguage === "auto"
                      ? `Transcribe the audio and translate it to ${targetLangName}. Return ONLY valid JSON in this exact format: {"original": "transcribed text here", "translated": "translated text here"}`
                      : `Transcribe the audio that is spoken in ${sourceLangName} and translate it to ${targetLangName}. Return ONLY valid JSON in this exact format: {"original": "transcribed text here", "translated": "translated text here"}`,
                },
                {
                  inlineData: {
                    mimeType: "audio/webm",
                    data: audio,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      },
    );

    if (!combinedResponse.ok) {
      const errorData = await combinedResponse.json();
      if (combinedResponse.status === 429) {
        return res.status(429).json({ error: "API rate limit exceeded. Please try again in a moment." });
      }
      throw new Error(`API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const responseData = await combinedResponse.json();
    const resultText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let result = { original: "", translated: "" };
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError, "Response:", resultText);
      return res.status(500).json({ error: "Failed to parse translation response" });
    }

    if (!result.original || !result.translated) {
      throw new Error("Missing transcription or translation in response");
    }

    return res.json({
      original: result.original.trim(),
      translated: result.translated.trim(),
    });
  } catch (error) {
    console.error("[v0] Translation error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Translation failed" });
  }
});

export default router;