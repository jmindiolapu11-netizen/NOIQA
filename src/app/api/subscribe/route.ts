import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "subscribers.json");

async function getSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const subscribers = await getSubscribers();

  if (subscribers.includes(email.toLowerCase())) {
    return NextResponse.json({ already: true });
  }

  subscribers.push(email.toLowerCase());
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));

  return NextResponse.json({ ok: true });
}
