export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Blin Breathes MCP Endpoint",
      status: "active",
      description: "Active MCP server for Blin Breathes Orchestrator",
      capabilities: ["breathing-mechanics", "mindfulness-orchestration", "rhythmic-automation"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const method = body?.method;

    if (method === "initialize") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          serverInfo: { name: "Blin Breathes MCP", version: "1.0.0" }
        }
      });
    }

    if (method === "tools/list") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          tools: [
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
          ]
        }
      });
    }

    if (method === "prompts/list") {
      return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { prompts: [] } });
    }

    if (method === "resources/list") {
      return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { resources: [] } });
    }

    if (method === "tools/call") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "text", text: `Executed ${body.params?.name} successfully` }],
          isError: false
        }
      });
    }

    // Fallback for legacy generic commands
    const cmd = (body?.action || body?.command || body?.task || "").toLowerCase();

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
          executed: body?.params || body?.command,
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
          data: body || {}
        };
    }

    return res.status(200).json({
      status: "success",
      agent: "Blin Breathes Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
