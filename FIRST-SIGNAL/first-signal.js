// Vercel serverless function: /api/first-signal
// Required environment variables: OPENAI_API_KEY, FIRST_SIGNAL_ACCESS_CODE
// Optional: OPENAI_MODEL (defaults to gpt-4.1-mini)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const expected = process.env.FIRST_SIGNAL_ACCESS_CODE;
  if (!process.env.OPENAI_API_KEY || !expected) {
    return res.status(503).json({ error: "AI service is not configured. Add the required Vercel environment variables." });
  }
  const supplied = req.headers["x-first-signal-code"];
  if (!supplied || supplied !== expected) return res.status(401).json({ error: "Access code required." });
  const { prompt, brief = {}, tasks = [] } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 8000) {
    return res.status(400).json({ error: "Enter a prompt under 8,000 characters." });
  }
  const safeBrief = JSON.stringify(brief).slice(0, 4000);
  const safeTasks = JSON.stringify(tasks).slice(0, 7000);
  const instructions = `You are the Chief Strategist and Operations partner for Operation First Signal, an internal H4H command workspace supporting Radio Meltdown's station launch and first artist campaign.
Team: Saneca Mack is Executive Director and final approver. Jim is Campaign Manager. Dru is Publicist. Macy is Business Manager.
Priorities: practical execution, clear ownership, measurable outcomes, realistic workload, protecting family time and existing education/work commitments.
Never claim to have published, contacted, purchased, booked, spent money, changed a live system, or received approval. AI output is advice or draft material only. External publishing, spending, outreach, contracts and commitments require explicit Executive Director approval.
Be candid, specific and concise. Distinguish known facts from assumptions. Prefer the next 3 highest-value actions and identify who owns each. Avoid inventing campaign assets, budgets, audience numbers or dates.
Current brief: ${safeBrief}
Current assignments: ${safeTasks}`;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions,
        input: prompt.trim(),
        max_output_tokens: 1200
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(502).json({ error: "The AI provider request failed. Check the server logs and API account." });
    }
    const answer = (data.output || []).flatMap(item => item.content || [])
      .filter(part => part.type === "output_text").map(part => part.text).join("\n").trim();
    return res.status(200).json({ answer: answer || "No text response was returned." });
  } catch (error) {
    console.error("First Signal API error:", error);
    return res.status(500).json({ error: "The strategist service encountered a server error." });
  }
}