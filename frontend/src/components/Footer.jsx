import React from 'react';
import { Shield, ExternalLink, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="no-print relative z-10 border-t border-slate-900/[0.08] bg-white/40 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900/[0.06]">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-medium tracking-tight text-slate-900 relative inline-block">
                WattHacks
                <span className="absolute -bottom-1 left-0 w-6 h-[2px] bg-brand-apricot rounded-full"></span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                AI GRID
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 font-light leading-relaxed">
              Autonomous grid intelligence & battery arbitrage software for commercial and industrial facilities. Built for the AI for Sustainability Hackathon.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h5 className="text-xs font-mono uppercase text-slate-900 font-semibold tracking-wider">
              Navigation
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 font-light">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Overview</a></li>
              <li><a href="#comparison" className="hover:text-slate-900 transition-colors">Vs Competitors & Pricing</a></li>
              <li><a href="#features" className="hover:text-slate-900 transition-colors">Core Features</a></li>
              <li><a href="#try-it-out" className="hover:text-slate-900 transition-colors">Interactive ROI Sandbox</a></li>
            </ul>
          </div>

          {/* Col 3: Compliance & Protocols */}
          <div>
            <h5 className="text-xs font-mono uppercase text-slate-900 font-semibold tracking-wider">
              Standards & Specs
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 font-mono text-[11px]">
              <li>CEA Factor: 0.716 kg CO2/kWh</li>
              <li>SEBI BRSR Core & Scope 1/2</li>
              <li>BACnet IP / Modbus TCP / MQTT</li>
              <li>IEEE 2030.5 Smart Energy Profile</li>
            </ul>
          </div>

          {/* Col 4: Status & Audit */}
          <div>
            <h5 className="text-xs font-mono uppercase text-slate-900 font-semibold tracking-wider">
              System Health
            </h5>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Operational (99.98% Uptime)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-light">
                Regional grid tariff APIs synced every 60 seconds across Indian DISCOM zones.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & tech strip */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>⚡ ZERO MANUAL OVERHEAD</span>
            <span>•</span>
            <span>🌱 INDIA CEA 0.716 kg/kWh STANDARD</span>
            <span>•</span>
            <span>🔒 REAL-TIME TOD ARBITRAGE</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            &copy; {new Date().getFullYear()} WATTHACKS AI • FOR SUSTAINABILITY
          </div>
        </div>
      </div>
    </footer>
  );
}
