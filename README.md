# PayloadGate

A Next.js prototype that inspects JSON payloads between AI agents and blockchain RPC nodes before they are broadcast. Built during the Aya Wallet hackathon.

## What it does

PayloadGate simulates multi-chain M2M traffic (Base, Ethereum, Solana, TON) and sits between an AI agent and the blockchain. Before a transaction payload is broadcast, the app evaluates its intent and either allows it, blocks it, or moves it to a quarantine queue for human review.

## How it works

- **Traffic simulator** generates representative Aya-style Web3 payloads, including routine gasless swaps and high-risk actions such as max ERC-20 approvals to unverified addresses.
- **Sandbox** applies heuristics to each payload. Routine transactions pass automatically; suspicious ones are blocked.
- **Quarantine** stores blocked transactions in memory and generates a downloadable JSON forensic report.
- **Admin review** lets a reviewer discard a quarantined item or sign and force execution.

## Tech stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI components: Lucide React
- Deployment: Vercel serverless functions

## Results / Metrics

This is a hackathon prototype and demo. A live deployment is available on Vercel, and a recorded demo is on YouTube.

- Live demo: https://payload-gate-f4ji43hn3-godwinsunday11223-1814s-projects.vercel.app/
- Demo video: https://youtu.be/zb-QmyMAEew

## How to run

```bash
git clone https://github.com/saaga23/PayloadGate.git
cd PayloadGate
npm install
npm run dev
```

Open http://localhost:3000 in your browser, then click **Initialize Aya Web3 Traffic** to start the simulation.

## Project status

Hackathon prototype built for the Aya Wallet hackathon.

## License

No license is specified in this repository.

---

## Suggested GitHub metadata

**Suggested descriptions (<=160 chars):**

1. Next.js prototype that inspects AI-agent payloads before blockchain RPC calls.
2. Next.js payload-inspection prototype for Web3 AI agents, deployed on Vercel.

**Suggested topic tags:**

`nextjs`, `web3`, `ai-agents`, `security`, `vercel`
