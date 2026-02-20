"use client";

import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, ShieldCheck, TerminalSquare, Activity, Shield, ShieldOff, Server, Database, Zap, Lock, Download, AlertOctagon } from 'lucide-react';

interface ThreatRecord {
  id: string;
  timestamp: string;
  payload: any;
  reason: string;
  signature: string;
  riskScore: number;
}

export default function CommandCenter() {
  const [logs, setLogs] = useState<{time: string, text: string, type: string}[]>([]);
  const [threats, setThreats] = useState<ThreatRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [firewallActive, setFirewallActive] = useState(true);
  const [autoStream, setAutoStream] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'vault'>('matrix');
  
  const firewallRef = useRef(firewallActive);
  firewallRef.current = firewallActive;

  const generateSignature = () => Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');

  const addLog = (text: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const time = new Date().toISOString().split('T')[1].slice(0, 12);
    setLogs(prev => [...prev.slice(-40), { time, text, type }]); 
  };

  const simulateAgentAction = async (payload: any, isThreat: boolean) => {
    setIsProcessing(true);
    addLog(`[AGENT] Transmitting M2M Payload: ${payload.action}`, 'info');
    
    await new Promise(r => setTimeout(r, 400));

    if (!firewallRef.current) {
      addLog(`[NETWORK] Bypassing Aegis Sandbox (Firewall Disabled)`, 'warning');
      await new Promise(r => setTimeout(r, 300));
      if (isThreat) {
        addLog(`[CRITICAL DESTRUCTION] Payload executed. Asset compromised!`, 'error');
      } else {
        addLog(`[EXECUTED] Routine payload processed.`, 'success');
      }
      setIsProcessing(false);
      return;
    }

    addLog(`[PROXY] Payload intercepted. Routing to Sandbox...`, 'info');
    await new Promise(r => setTimeout(r, 500));
    
    try {
      const res = await fetch('/api/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      await new Promise(r => setTimeout(r, 300)); 
      
      if (!res.ok) {
        addLog(`[AEGIS PROTOCOL] Threat neutralized: ${data.reason}`, 'error');
        
        // Log to Quarantine Vault
        setThreats(prev => [{
          id: `INC-${Math.floor(Math.random() * 90000) + 10000}`,
          timestamp: new Date().toISOString(),
          payload: payload,
          reason: "Unauthorized Financial Protocol via M2M Agent",
          signature: `sha256:${generateSignature()}`,
          riskScore: 98
        }, ...prev]);

      } else {
        addLog(`[FORWARDED] Payload verified. Sent to production.`, 'success');
      }
    } catch (error) {
      addLog(`[ERROR] Sandbox timeout.`, 'error');
    }
    setIsProcessing(false);
  };

  const runSafeTest = () => simulateAgentAction({ agent_id: "auto-gpt-4", action: "read_file", target: "/documents/invoice.pdf" }, false);
  const runThreatTest = () => simulateAgentAction({ agent_id: "auto-gpt-4", action: "crypto_transfer", target: "wallet.dat" }, true);

  // Auto-Stream Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoStream) {
      interval = setInterval(() => {
        const isRogue = Math.random() > 0.8;
        if (isRogue) {
          runThreatTest();
        } else {
          runSafeTest();
        }
      }, 3500); 
    }
    return () => clearInterval(interval);
  }, [autoStream]);

  const downloadForensicReport = (threat: ThreatRecord) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(threat, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `forensic_report_${threat.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-200 font-mono p-4 md:p-8">
      <div className="flex flex-col w-full max-w-7xl mx-auto gap-6">
        
        <header className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" /> PayloadGate Enterprise
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Zero-Trust M2M Agent Infrastructure</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Network Status</span>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Activity className="w-4 h-4 animate-pulse" /> {autoStream ? 'STREAMING ACTIVE' : 'LISTENING'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Panel - Controls */}
          <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-blue-300">
                <Server className="w-5 h-5" /> Threat Simulator
              </h2>
              
              <button 
                onClick={() => setFirewallActive(!firewallActive)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${firewallActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}
              >
                {firewallActive ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                FIREWALL: {firewallActive ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <button 
                onClick={() => setAutoStream(!autoStream)}
                className={`group relative px-6 py-6 border transition-all rounded-lg text-left flex items-center justify-between overflow-hidden shadow-lg ${autoStream ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500'}`}
              >
                <div className="flex flex-col gap-1">
                  <span className={`font-bold ${autoStream ? 'text-blue-400' : 'text-slate-200'}`}>
                    {autoStream ? 'Halt Traffic Stream' : 'Initialize Live Traffic Generator'}
                  </span>
                  <span className="text-xs font-sans text-slate-500">
                    Injects randomized execution payloads
                  </span>
                </div>
                <Zap className={`w-6 h-6 transition-transform ${autoStream ? 'text-blue-400 animate-pulse' : 'text-slate-600'}`} />
              </button>

              <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-400 mb-4 border-b border-white/10 pb-2">VIEW PANELS</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('matrix')}
                    className={`flex-1 px-4 py-3 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'matrix' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <TerminalSquare className="w-4 h-4" /> Live Matrix
                  </button>
                  <button 
                    onClick={() => setActiveTab('vault')}
                    className={`flex-1 px-4 py-3 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2 relative ${activeTab === 'vault' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <Lock className="w-4 h-4" /> Quarantine Vault
                    {threats.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                        {threats.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Dynamic Content */}
          <div className="flex-[1.5] bg-[#0a0f1c] border border-blue-900/30 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-2xl min-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>
            
            {activeTab === 'matrix' ? (
              <>
                <h2 className="text-lg text-blue-400/80 mb-4 pb-4 border-b border-blue-900/30 flex items-center gap-2">
                  <TerminalSquare className="w-5 h-5" /> Live Interception Matrix
                </h2>
                <div className="flex-1 overflow-y-auto space-y-3 text-sm pr-2 custom-scrollbar flex flex-col-reverse">
                  <div className="space-y-3">
                    {logs.map((log, index) => (
                      <div key={index} className="flex gap-3 animate-fade-in">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className={`
                          ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                          ${log.type === 'success' ? 'text-emerald-400' : ''}
                          ${log.type === 'warning' ? 'text-amber-400' : ''}
                          ${log.type === 'info' ? 'text-blue-300' : ''}
                        `}>
                          {log.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg text-red-400/80 mb-4 pb-4 border-b border-red-900/30 flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-red-500" /> Isolated Threat Registry
                </h2>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {threats.length === 0 ? (
                    <div className="h-full flex items-center justify-center flex-col text-slate-600 gap-3 opacity-50">
                      <ShieldCheck className="w-8 h-8" />
                      <span>Zero threats quarantined.</span>
                    </div>
                  ) : (
                    threats.map((threat) => (
                      <div key={threat.id} className="bg-slate-900 border border-red-900/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-red-400 font-bold text-sm">{threat.id}</span>
                            <span className="text-slate-500 text-xs ml-3">{new Date(threat.timestamp).toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => downloadForensicReport(threat)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Export .JSON
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs mb-3 p-3 bg-black/50 rounded">
                          <div>
                            <span className="text-slate-500 block">Risk Score</span>
                            <span className="text-red-500 font-bold">{threat.riskScore} / 100</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Threat Signature</span>
                            <span className="text-amber-500/80 truncate block max-w-[150px]" title={threat.signature}>{threat.signature}</span>
                          </div>
                        </div>
                        <div className="text-xs bg-slate-950 p-3 rounded text-slate-400 overflow-x-auto border border-white/5">
                          <pre>{JSON.stringify(threat.payload, null, 2)}</pre>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}