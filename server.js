const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "Trao AI Interview Kit Backend is running",
  });
});

app.post("/api/generate-kit", async (req, res) => {
  try {
    const {
      jobDescription,
      companyWebsite,
      interviewDate,
    } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        error: "Job description is required",
      });
    }

    const prompt = `
You are an expert interview preparation assistant.

Create a personalized interview preparation kit from the following information.

Job Description:
${jobDescription}

Company Website:
${companyWebsite || "Not provided"}

Interview Date:
${interviewDate || "Not provided"}

Return ONLY valid JSON.
Do not use markdown or code fences.

The JSON must have exactly this structure:

{
  "summary": "Short role summary",
  "keySkills": [
    "skill 1",
    "skill 2",
    "skill 3",
    "skill 4",
    "skill 5"
  ],
  "companyResearch": [
    "Important company fact 1",
    "Important company fact 2",
    "Important company fact 3"
  ],
  "technicalQuestions": [
    "Technical interview question 1",
    "Technical interview question 2",
    "Technical interview question 3",
    "Technical interview question 4",
    "Technical interview question 5"
  ],
  "behavioralQuestions": [
    "Behavioral question 1",
    "Behavioral question 2",
    "Behavioral question 3"
  ],
  "systemDesignQuestions": [
    "System design question 1",
    "System design question 2"
  ],
  "studySchedule": [
    {
      "day": "Day 1",
      "focus": "Topic to study"
    },
    {
      "day": "Day 2",
      "focus": "Topic to study"
    },
    {
      "day": "Day 3",
      "focus": "Topic to study"
    }
  ]
}

Make the preparation kit practical and relevant to the job description.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    const text = response.output_text;

    const kit = JSON.parse(text);

    return res.json(kit);
  } catch (error) {
    console.error("Generate kit error:", error);

    return res.status(500).json({
      error: "Failed to generate interview kit",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});