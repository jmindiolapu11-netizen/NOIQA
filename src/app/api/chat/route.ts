import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat-helpers";
import { isValidProfile, type TeacherProfile } from "@/lib/constants";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { messages, profile } = body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    profile: TeacherProfile;
  };

  if (!messages?.length || !isValidProfile(profile)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(profile);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const content = textBlock ? textBlock.text : "No pude generar una respuesta.";

  return NextResponse.json({ content });
}
