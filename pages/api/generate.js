import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { industry, goal } = req.body;

  if (!industry || !goal) {
    return res.status(400).json({ error: "Missing industry or goal" });
  }

  const prompt = `
You are a startup strategy expert. Based on the user's input, generate a unique startup name, a 2-3 sentence description, and a 4-step strategic plan.

Industry: ${industry}
Goal: ${goal}

Respond in JSON format like this:
{
  "name": "Startup Name",
  "description": "Short description...",
  "plan": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ..."
  ]
}
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const parsed = JSON.parse(chat.choices[0].message.content || "{}");
    res.status(200).json(parsed);
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

