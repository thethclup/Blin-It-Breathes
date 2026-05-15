# Blink & It Breathes

**Blink & It Breathes** is a tense, psychological horror web3 game based on the primal fear of blinking. You are trapped in a dark, ever-changing liminal space. The horrors hide in the silence, moving only when your eyes are closed. However, stare too long into the darkness, and your sanity will fracture.   

## Lore & Gameplay

* **The Core Mechanism:** Tap and hold to keep your eyes open. Release to blink.
* **The Entities:** The creatures in the shadows *only* move when your eyes are closed. Every blink brings them closer.
* **Sanity:** Your eyes naturally want to rest. Staring into the dark drains your sanity. Low stamina causes extreme hallucinations, screen distortion, and inevitably, death.
* **Survival:** Balance blinking to regain your sanity while ensuring the creatures don't reach you. You must survive.

## Platform Integration (Base Mainnet)

The game is fully equipped to interact with the **Base Mainnet** using modern Web3 standards.
* **ERC-8021 Transaction Attribution:** Gameplay records are sent with full constructor-level attribution tags to verify on-chain survival length.
* **On-Chain Milestones:** Players possess the power to submit "Record This Nightmare On-Chain" or send a rhythmic "Say GM" transaction to the network.
* **ERC-8004 Trustless Agents:** Includes an active AI AI orchestrator (`Blin Breathes Orchestrator`) that handles breathing mechanics, mindfulness execution, and rhythm automation over Model Context Protocol (MCP).

## Technical Architecture

* **Frontend:** Built with React, Vite, and Framer Motion. Uses React Canvas for high-performance entity rendering and real-time horror effects.
* **Styling:** Tailwind CSS with custom aesthetic variables (`Cormorant Garamond`, `Inter`, `Space Mono`) to create a bleak, sophisticated dark interface.
* **Backend:** Express API integrated seamlessly with Vite serving MCP endpoints and Agent interaction cards.
* **Web3 Integration:** Configured with `wagmi` and `viem` to broadcast actions.

## Development

Install dependencies:
```bash
npm install
```

Start the application:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

*Don't close your eyes.*
