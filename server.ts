import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3001", 10);

  app.use(express.json());

  // Keep API keys hidden from client-side
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      // Safe fallback check to prevent system crashes
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        console.warn("GEMINI_API_KEY is missing or placeholder. Running elegant localized copy generator fallback.");
        const textLower = prompt.toLowerCase();
        let fallbackText = "Crafting digital experiences with minimalist styling, clean typography pairings, and custom spacing setups.";
        
        if (textLower.includes("headline") || textLower.includes("heading") || textLower.includes("title")) {
          fallbackText = "Aesthetically Crafted Spaces";
        } else if (textLower.includes("button") || textLower.includes("cta") || textLower.includes("click")) {
          fallbackText = "Claim Your Copy";
        } else if (textLower.includes("cafe") || textLower.includes("bakery") || textLower.includes("pastry")) {
          if (textLower.includes("headline")) {
            fallbackText = "Fresh Sourdough & Warm Roasts Baked Daily";
          } else {
            fallbackText = "Every single bean is direct-purchased from independent high-altitude smallholders in Antioquia and roasted in copper drums in-house.";
          }
        }
        return res.json({ text: fallbackText });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text?.trim() || "" });
    } catch (err: any) {
      console.error("Gemini server-side copywriting failure:", err);
      res.status(500).json({ error: err.message || "Failed to generate content stream" });
    }
  });

  // Vite development middleware vs Static Production bundle
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
