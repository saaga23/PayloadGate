# PayloadGate Enterprise
**Aya Wallet AI Governance & Security Layer**

[Live Vercel Deployment](https://payloadgate.vercel.app) | [Demo Video (YouTube)](#) *(Link your video here)*

---

## The Problem: The Danger of Autonomous On-Chain AI
Aya is launching a multi-paradigm mobile wallet featuring an integrated AI agent capable of executing complex cross-chain transactions (EVM, Solana, TON). While powerful, autonomous M2M (Machine-to-Machine) agents introduce a critical security vulnerability: **What happens when the AI hallucinates, or a malicious actor executes a prompt-injection attack to drain funds?**

## The Solution: PayloadGate
PayloadGate is a B2B SaaS zero-trust firewall and governance layer built specifically for Web3 AI agents. It sits between the AI agent and the blockchain RPC nodes. Before any transaction is broadcasted to the network, PayloadGate intercepts the JSON payload, detonates it in a heuristic sandbox, and strictly blocks unauthorized token approvals or bridge transfers.

This project was built entirely from scratch during the hackathon to provide Aya with an enterprise-grade security infrastructure.

### Core Features
* **Live Web3 Traffic Interceptor:** Simulates and monitors multi-chain M2M traffic (Base, Ethereum, Solana, TON).
* **Aegis Sandbox:** Evaluates payload intent. Routine gasless swaps pass automatically; high-risk actions (e.g., Max ERC20 Approvals to unverified addresses) are instantly blocked.
* **Quarantine Vault:** Isolated anomaly registry that traps rogue transactions without executing them on-chain. Generates downloadable forensic JSON reports for security teams.
* **Human-in-the-Loop (HitL) Governance:** Empowers wallet administrators to review quarantined transactions and either **Burn** them or cryptographically **Sign & Override** to force execution.

---

## 📜 Rule 4 Compliance: The "Vibe Log"
*This project heavily utilized AI-assisted coding to rapidly iterate from architecture to deployment.*

* **Phase 1 (Architecture & Feasibility):** Conceptualized a B2B SaaS M2M firewall. The initial prototype was built in Python (FastAPI). Conducted a strict feasibility audit and determined local Python scripts fail the "Demo or Die" visual requirement for judges.
* **Phase 2 (The Next.js Pivot):** Migrated the interception proxy logic entirely into a Next.js Serverless API route to guarantee instant Vercel deployment. Built a split-screen "Command Center" UI using Tailwind and Lucide React.
* **Phase 3 (Aya Alignment & Web3 Schemas):** Analyzed the hackathon prompt. Abandoned generic file-read payloads and rewrote the traffic simulator to emit highly specific Aya payloads (e.g., EVM Gasless Swaps vs. Malicious Crypto Transfers).
* **Phase 4 (Enterprise Polish):** Engineered the "Quarantine Vault" and HitL buttons to establish enterprise Web3 governance. Bypassed Vercel's read-only file system constraints by building an in-memory client-side forensic JSON exporter.

---

## Tech Stack
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** Lucide-React
* **Deployment:** Vercel (Serverless Functions)

## Local Setup
To run this infrastructure locally:

```bash
# Clone the repository
git clone [https://github.com/saaga23/PayloadGate.git](https://github.com/saaga23/PayloadGate.git)

# Navigate to the directory
cd PayloadGate

# Install dependencies
npm install

# Start the development server
npm run dev

Open http://localhost:3000 in your browser. Click Initialize Aya Web3 Traffic to start the simulation.