import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInsights } from "@/lib/insights/engine";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currentData, previousData } = body;

  if (process.env.OPENAI_API_KEY && currentData) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a Google Analytics expert. Analyze the data and provide 3-5 actionable insights in bullet points. Be specific with numbers.",
            },
            {
              role: "user",
              content: `Analyze this GA4 data: ${JSON.stringify(currentData, null, 2)}`,
            },
          ],
          max_tokens: 400,
        }),
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content ?? "";
      return NextResponse.json({
        insights: content.split("\n").filter((l: string) => l.trim()),
      });
    } catch {
      // fall through to rule-based
    }
  }

  const insights = generateInsights(currentData, previousData ?? currentData);
  return NextResponse.json({ insights });
}
