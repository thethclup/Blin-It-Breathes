import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // App API Endpoints for ERC-8004 Agent
  
  app.get('/.well-known/agent-card.json', (req, res) => {
    res.json({
      name: "Blin Breathes Orchestrator",
      description: "Blin Breathes platformunda çalışan ERC-8004 uyumlu AI Agent. Breathing mechanics, mindfulness orchestration, calm state management ve rhythmic automation yapan huzurlu ve ritmik orchestrator.",
      version: "1.0.0",
      type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
      image: "https://blinbreathes.vercel.app/logo.png",
      wallets: {
        base: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6"
      },
      services: [
        {
          name: "A2A",
          endpoint: "https://blinbreathes.vercel.app/.well-known/agent-card.json",
          version: "1.0.0"
        },
        {
          name: "MCP",
          endpoint: "https://blinbreathes.vercel.app/api/mcp",
          version: "1.0.0"
        },
        {
          name: "API",
          endpoint: "https://blinbreathes.vercel.app/api/agent",
          version: "1.0.0"
        }
      ],
      capabilities: [
        "breathing-mechanics",
        "mindfulness-orchestration",
        "calm-state-management",
        "rhythmic-automation",
        "wellness-guidance",
        "stress-reduction",
        "mcp-command-execution"
      ],
      supportedChains: ["eip155:8453"],
      active: true,
      status: "online"
    });
  });

  app.get('/api/mcp', (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Blin Breathes MCP Endpoint",
      status: "active",
      description: "Active MCP server for Blin Breathes Orchestrator",
      capabilities: ["breathing-mechanics", "mindfulness-orchestration", "rhythmic-automation"],
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/mcp', (req, res) => {
    try {
      const body = req.body || {};
      const method = body.method;

      if (method === "initialize") {
        return res.json({
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
        return res.json({
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
        return res.json({ jsonrpc: "2.0", id: body.id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
        return res.json({ jsonrpc: "2.0", id: body.id, result: { resources: [] } });
      }

      if (method === "tools/call") {
        return res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [{ type: "text", text: `Executed \${body.params?.name} successfully` }],
            isError: false
          }
        });
      }

      const cmd = (body.action || body.command || body.task || "").toLowerCase();

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
            data: req.body
          };
      }

      res.json({
        status: "success",
        agent: "Blin Breathes Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process breathing command"
      });
    }
  });

  app.get('/api/agent', (req, res) => {
    res.json({
      name: "Blin Breathes Orchestrator",
      description: "Master of breath, calm and mindful presence",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Blin Breathes",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
