import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { ModelMapping } from "./server/providers";
import { callGrok } from "./server/grok";
import { callGemini } from "./server/gemini";
import { callOpenAI } from "./server/openai";
import { callMeta } from "./server/meta";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", upload.array('attachments'), async (req, res) => {
    try {
      const { provider, plan, message } = req.body;
      const files = req.files as Express.Multer.File[];
      
      const model = ModelMapping[provider]?.[plan as keyof typeof ModelMapping[typeof provider]];
      if (!model) {
        return res.status(400).json({ error: `Invalid provider (${provider}) or plan (${plan})` });
      }

      let response = "";
      switch (provider) {
        case 'grok': response = await callGrok(model, message, files); break;
        case 'gemini': response = await callGemini(model, message, files); break;
        case 'openai': response = await callOpenAI(model, message, files); break;
        case 'meta': response = await callMeta(model, message, files); break;
        default: return res.status(400).json({ error: "Provider not implemented" });
      }
      res.json({ response });
    } catch (e: any) {
      console.error("Chat Error:", e);
      res.status(500).json({ error: e.message || "Internal server error" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
