import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini API lazily to prevent startup crashes when key is missing or undefined
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key || "PLACEHOLDER_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Custom AI Matchmaking and Diagnostics
  app.post("/api/ai/matchmake", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Job description is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback mockup responses if API key is missing (helps developer mode or partial setups)
        return res.json({
          recommendedArtisanCategory: "electrician",
          confidence: "high",
          explanation: "Fallback: Gemini API key is not configured. Based on common domestic defaults, this issue relates to electrical supply lines.",
          immediateSafetyTips: [
            "Ensure the main power switch is off before touching any sockets.",
            "Do NOT use wet hands or stand in water.",
            "Use insulated tools if handling any covers."
          ],
          preliminaryQuestions: [
            "Are other appliances on the same board working?",
            "Did you hear a popping sound when it failed?"
          ]
        });
      }

      const response = await getAiClient().models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Inspect the following domestic problem described by a home-owner / office worker in Ghana.
Identify which key artisan category (one of: "electrician", "plumber", "carpenter", "painter", "mechanic") is best suited to fix it.
Provide a clear analysis of why, along with key safety warnings.

Customer Issue description: "${description}"`,
        config: {
          systemInstruction: "You are an expert domestic engineering assistant in Ghana. Your goal is to guide homeowners on which tradesperson to hire and ensure they remain safe.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedArtisanCategory: {
                type: Type.STRING,
                description: "Must be exactly one of: electrician, plumber, carpenter, painter, mechanic",
              },
              confidence: {
                type: Type.STRING,
                description: "Must be: high, medium, or low",
              },
              explanation: {
                type: Type.STRING,
                description: "Brief, professional explanation on why this artisan category was picked.",
              },
              immediateSafetyTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 immediate precautions or safety measures the user should take before the artisan arrives.",
              },
              preliminaryQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 questions the customer can ask themselves or inspect to clarify the scope for the artisan.",
              },
            },
            required: [
              "recommendedArtisanCategory",
              "confidence",
              "explanation",
              "immediateSafetyTips",
              "preliminaryQuestions",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text returned from Gemini API");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (error: any) {
      console.error("Matchmake API Error:", error);
      res.status(500).json({ error: error.message || "Failed to parse matchmaking diagnostics" });
    }
  });

  // API 2: Ghanaian Local Repair Cost Estimator (GHS)
  app.post("/api/ai/estimate-cost", async (req, res) => {
    try {
      const { category, subservice, issueDescription } = req.body;
      if (!category) {
        return res.status(400).json({ error: "Artisan category is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          estimatedRangeGhs: { min: 150, max: 350 },
          laborCostEstimateGhs: { min: 100, max: 200 },
          materialsEstimateGhs: { min: 50, max: 150 },
          typicalDuration: "1 - 2 hours",
          costFactors: [
            "Type of replacement parts requested.",
            "Distance traveled by the artisan to your location in Ghana.",
            "Emergency off-hours booking fee."
          ],
          materialsRequired: [
            "Standard replacement supplies",
            "Insulating / plumbing sealants"
          ]
        });
      }

      const response = await getAiClient().models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide a fair-market pricing estimate in Ghana Cedis (GHS / GH₵) for the specified repair request.
Assume current market rates in Ghana urban zones (like Accra, Kumasi, Takoradi). Keep quotes reasonable and reflecting honest local marketplace averages.

Category: ${category}
Subservice / Job: ${subservice || "General Repair"}
Issue Details: ${issueDescription || "Not provided"}`,
        config: {
          systemInstruction: "You are an experienced local estimator and pricing auditor working in Ghana's skilled trades sector. You know the current pricing trends for labor, parts, and materials in GH₵ (Ghana Cedis).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedRangeGhs: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.INTEGER, description: "Lower bound in GH₵" },
                  max: { type: Type.INTEGER, description: "Upper bound in GH₵" },
                },
                required: ["min", "max"],
              },
              laborCostEstimateGhs: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.INTEGER, description: "Lower bound for labor in GH₵" },
                  max: { type: Type.INTEGER, description: "Upper bound for labor in GH₵" },
                },
                required: ["min", "max"],
              },
              materialsEstimateGhs: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.INTEGER, description: "Lower bound for materials/accessories in GH₵" },
                  max: { type: Type.INTEGER, description: "Upper bound for materials/accessories in GH₵" },
                },
                required: ["min", "max"],
              },
              typicalDuration: {
                type: Type.STRING,
                description: "e.g., '2 - 4 hours' or '1 - 2 days'",
              },
              costFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 local Ghanaian cost variables (e.g., quality of local vs imported pipes, Suame Magazine spare parts levels, transport to Accra central)",
              },
              materialsRequired: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of common hardware materials required for this issue in Ghana.",
              },
            },
            required: [
              "estimatedRangeGhs",
              "laborCostEstimateGhs",
              "materialsEstimateGhs",
              "typicalDuration",
              "costFactors",
              "materialsRequired",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text returned from Gemini API");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (error: any) {
      console.error("Estimate Cost API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate market cost estimate" });
    }
  });

  // API 3: Job Brief Optimizer Explorer
  app.post("/api/ai/optimize-brief", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Rough description is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          title: "Standard Repair Request",
          optimizedDescription: "Fallback: AI key not set. Rough issue: " + description,
          scopeOfWork: [
            "Perform troubleshooting diagnosis upon arrival.",
            "Explain estimated repair needs before proceeding.",
            "Execute fixing and perform quality validation check."
          ],
          suggestedMilestones: [
            "Initial inspections and fault location",
            "Dismantling and application of fixes",
            "Final operational test and site clean-up"
          ]
        });
      }

      const response = await getAiClient().models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Transform this rough request description into a clear, structured, professional job brief:
Rough user text: "${description}"`,
        config: {
          systemInstruction: "You are a professional project coordinator helping customers create concise, detailed work orders for skilled handymen and mechanics.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Short professional title (e.g., 'Kitchen Sink Siphon & Drainage Pipe Replacement')",
              },
              optimizedDescription: {
                type: Type.STRING,
                description: "A beautifully polished, concise description with bullets highlighting the exact issues found.",
              },
              scopeOfWork: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 explicit technical jobs the artisan is expected to complete package-wise.",
              },
              suggestedMilestones: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 recommended payment/status milestones (e.g. 'Fault confirmed', 'Primary fitting completed', 'Final dry run approval')",
              },
            },
            required: ["title", "optimizedDescription", "scopeOfWork", "suggestedMilestones"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text returned from Gemini API");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (error: any) {
      console.error("Optimize Brief API Error:", error);
      res.status(500).json({ error: error.message || "Failed to optimize booking brief" });
    }
  });

  // Client SPA serving using Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ghana Artisan Marketplace Server running on http://localhost:${PORT}`);
  });
}

startServer();
