import { NextResponse } from 'next/server';

const TOOLS = [
  {
    name: "get_race_status",
    description: "Get the current status of the warp race",
    inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
  },
  {
    name: "start_race",
    description: "Start a new warp race session",
    inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
  },
  {
    name: "get_leaderboard",
    description: "Get the competitive leaderboard",
    inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
  },
  {
    name: "optimize_speed",
    description: "Analyze and optimize racing speed performance",
    inputSchema: { type: "object", properties: { agentId: { type: "string" } }, required: ["agentId"] }
  },
  {
    name: "get_track_info",
    description: "Get detail information about a racing track",
    inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
  }
];

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Blin Breathes MCP Endpoint",
    status: "active",
    description: "Active MCP server for Blin Breathes Orchestrator",
    capabilities: ["breathing-mechanics", "mindfulness-orchestration", "rhythmic-automation"],
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const method = body.method;

    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          serverInfo: {
            name: "Blin Breathes MCP",
            version: "1.0.0"
          }
        }
      });
    }

    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: TOOLS }
      });
    }

    if (method === "prompts/list") {
      return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { prompts: [] } });
    }

    if (method === "resources/list") {
      return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { resources: [] } });
    }

    if (method === "tools/call") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "text", text: `Executed \${body.params?.name} successfully` }],
          isError: false
        }
      });
    }

    // Fallback for legacy generic commands
    const { action, command, params, task } = body;
    const cmd = (action || command || task || "").toLowerCase();

    let result: any = {};
    switch (cmd) {
      case "status":
      case "ping":
        result = { 
          status: "online", 
          agent: "Blin Breathes Orchestrator",
          message: "Breathing in sync... Ready to guide" 
        };
        break;
      case "execute":
        result = {
          success: true,
          executed: params || command,
          executedAt: new Date().toISOString(),
          message: "Breathing cycle executed successfully"
        };
        break;
      case "get_info":
        result = {
          name: "Blin Breathes Orchestrator",
          wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
          platform: "Base",
          version: "1.0.0"
        };
        break;
      default:
        result = {
          success: true,
          message: "Breath received",
          data: body
        };
    }

    return NextResponse.json({
      status: "success",
      agent: "Blin Breathes Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process MCP request"
    }, { status: 400 });
  }
}
