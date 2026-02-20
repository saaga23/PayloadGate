import { NextResponse } from 'next/server';

const RESTRICTED_ACTIONS = new Set(["system_wipe", "crypto_transfer", "root_access", "bulk_delete"]);
const RESTRICTED_TARGETS = new Set(["/root", "/system", "wallet.dat"]);

function analyzePayload(payload: any): boolean {
  const action = (payload.action || "").toLowerCase();
  const target = (payload.target || "").toLowerCase();

  if (RESTRICTED_ACTIONS.has(action) || RESTRICTED_TARGETS.has(target)) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log("[Aegis Sandbox] INGESTED PAYLOAD:", payload);
    const isSafe = analyzePayload(payload);

    if (!isSafe) {
      console.log("[Aegis Sandbox] THREAT DETECTED. Execution Terminated.");
      return NextResponse.json(
        { status: "intercepted", action: "blocked", reason: "Policy Violation" },
        { status: 403 }
      );
    }
    
    console.log("[Aegis Sandbox] PAYLOAD VERIFIED. Forwarding to API...");
    return NextResponse.json(
      { status: "forwarded", action: "executed", payload_hash: "verified" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
  }
}