import React from 'react';
import { ArrowRight, Sparkles, Building, BatteryCharging, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';

export default function InteractiveDemoSection({ onLaunchProduct }) {
  const steps = [
    {
      num: '01',
      title: 'Facility & Tariff Input',
      badge: 'Step 1: Calibration',
      icon: Building,
      desc: 'Select your facility category and regional Indian DISCOM (MSEDCL, BESCOM, Tata Power). Enter your baseline electricity bill to map ToD peak surcharge hours.',
      highlight: 'Maps peak ₹11.80/kWh vs ₹3.50/kWh rebate windows'
    },
    {
      num: '02',
      title: 'Solar & Storage Sizing',
      badge: 'Step 2: Capacity',
      icon: BatteryCharging,
      desc: 'Input your sanctioned demand (kW), rooftop solar PV (kWp), and battery BESS storage (kWh). The AI models optimal charge-discharge cycles.',
      highlight: 'Optimizes LFP battery C-rates & zero export curtailment'
    },
    {
      num: '03',
      title: 'Autonomous Dispatch Console',
      badge: 'Step 3: Intelligence',
      icon: Cpu,
      desc: 'Inspect your live power routing matrix, 24-hour dispatch schedule, monthly arbitrage savings, and instant SEBI BRSR Core carbon compliance PDF report.',
      highlight: 'Sub-minute telemetry with India CEA 0.716 certification'
    }
  ];

  const presets = [
    { name: 'Pune Tech Park', type: 'Commercial IT Park', details: '300 kWp PV • 200 kWh BESS • MSEDCL' },
    { name: 'Bengaluru Tech Hub', type: 'Office Campus', details: '180 kWp PV • 120 kWh BESS • BESCOM' },
    { name: 'Gurugram Industrial Hub', type: 'Manufacturing', details: '450 kWp PV • 350 kWh BESS • BSES' }
  ];

  return (
    <section id="try-it-out" className="relative z-10 py-24 border-t border-slate-900/[0.06] w-full">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-mono tracking-wider uppercase font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Guided Interactive Sandbox
          </div>

          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-slate-900 leading-tight">
            How the <span className="font-semibold text-slate-900">Try-It-Out Experience</span> Guides You
          </h2>

          <p className="mt-4 text-slate-600 font-light text-base md:text-lg leading-relaxed">
            We divided the sandbox into three guided steps so you can test your facility's exact parameters, model ToD peak dodging, and inspect live energy intelligence with zero guesswork.
          </p>
        </div>

        {/* 3 Divided Guided Walkthrough Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="liquid-glass rounded-3xl p-7 shadow-lg border border-white/80 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-mono font-semibold text-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      PHASE {step.num}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-700 font-semibold">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-light mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/10">
                  <div className="flex items-start gap-2 text-[11px] font-mono text-emerald-800 bg-emerald-500/10 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{step.highlight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Test Scenarios Bar */}
        <div className="mt-10 liquid-glass rounded-2xl p-5 border border-white/80 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider block">
                Quick 1-Click Test Scenarios:
              </span>
              <span className="text-xs text-slate-600 font-light">
                Launch with pre-calibrated regional facility loads
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  onClick={onLaunchProduct}
                  className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-slate-900 hover:text-white border border-slate-200 text-xs font-mono text-slate-700 transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95 group"
                >
                  <span className="font-semibold">{preset.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button & Guided Launch */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <button
            onClick={onLaunchProduct}
            className="group px-10 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm md:text-base tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <span>Start Guided Facility Walkthrough</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
            <span>✓ Step-by-Step Guided Intake</span>
            <span>•</span>
            <span>✓ India CEA 0.716 Verified</span>
            <span>•</span>
            <span>✓ Zero Hardware Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
