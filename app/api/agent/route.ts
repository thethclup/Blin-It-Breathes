import { NextResponse } from 'next/server';

/**
 * Blin Breathes Orchestrator - Agent Info Endpoint
 * 
 * Bu endpoint, agent'in temel kimlik ve durum bilgilerini sağlar.
 * ERC-8004 uyumlu keşif, A2A discovery ve platform entegrasyonları için kullanılır.
 */

export async function GET() {
  return NextResponse.json({
    name: "Blin Breathes Orchestrator",
    description: "Master of breath, calm and mindful presence",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Blin Breathes",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      received: body,
      agent: "Blin Breathes Orchestrator",
      message: "Agent info request processed"
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
