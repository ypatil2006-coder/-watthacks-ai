import React from 'react';
import { Check, X, AlertCircle, ShieldCheck, Zap, Cpu } from 'lucide-react';

export default function CompetitionSection() {
  const competitors = [
    {
      name: 'Legacy BMS Systems',
      subtitle: 'Schneider EcoStruxure, Siemens Desigo, Honeywell',
      badge: 'Traditional Industrial',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      pricing: '₹35L – ₹1.2 Cr ($40k – $150k+)',
      pricingType: 'Heavy Upfront CAPEX + ₹8L/yr AMC',
      setupTime: '3 – 6 Months',
      hardwareLockin: 'Proprietary hardware & PLC field wiring',
      autonomousArbitrage: false,
      gridCarbonTracking: false,
      predictiveHvac: false,
      modbusBacnetSupport: true,
      openApi: false,
      whereTheyWin: 'Decades of physical durability, heavy industrial relay warranties, proven on-prem SCADA reliability.',
      whereWattHacksWins: '$0 CAPEX, 15-minute setup, true AI time-of-day arbitrage, non-invasive open software.'
    },
    {
      name: 'Enterprise Utility BESS SaaS',
      subtitle: 'Stem Inc (Athena AI), Fluence Energy',
      badge: 'Utility Scale (>5MW)',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      pricing: '₹2.5L – ₹6.5L ($3k – $8k) / mo',
      pricingType: 'Enterprise Contract + $15k Gateway Box',
      setupTime: '6 – 12 Weeks',
      hardwareLockin: 'Proprietary utility gateway box',
      autonomousArbitrage: true,
      gridCarbonTracking: false,
      predictiveHvac: false,
      modbusBacnetSupport: true,
      openApi: false,
      whereTheyWin: 'Wholesale energy capacity bidding, massive 20MW+ utility battery operational track record.',
      whereWattHacksWins: 'Affordable for commercial campuses (C&I), native Indian CEA & DISCOM tariff modeling, 10x faster deployment.'
    },
    {
      name: 'Basic IoT Dashboards',
      subtitle: 'Wattwatchers, Enel X, DIY Grafana',
      badge: 'Passive Telemetry',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      pricing: '₹3,500 – ₹12,000 ($40 – $150) / mo',
      pricingType: 'Cheap Monthly SaaS',
      setupTime: '1 – 2 Weeks',
      hardwareLockin: 'Specific smart CT clamps',
      autonomousArbitrage: false,
      gridCarbonTracking: false,
      predictiveHvac: false,
      modbusBacnetSupport: false,
      openApi: true,
      whereTheyWin: 'Lowest entry cost for pure passive monitoring and basic kWh usage charts.',
      whereWattHacksWins: 'Autonomous proactive control. Passive alerts only tell you after you got penalized; WattHacks actively avoids the penalty.'
    },
    {
      name: 'WattHacks AI',
      subtitle: 'Autonomous Commercial Energy Intelligence',
      badge: 'Our Platform',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
      isHero: true,
      pricing: 'Currently Free',
      pricingType: 'Hackathon Access • Zero CAPEX',
      setupTime: '15 Minutes',
      hardwareLockin: '100% Software-Agnostic (Zero Hardware Lock-In)',
      autonomousArbitrage: true,
      gridCarbonTracking: true,
      predictiveHvac: true,
      modbusBacnetSupport: true,
      openApi: true,
      whereTheyWin: 'Reinforcement learning grid arbitrage, live CEA 0.716 kg/kWh emission abatement, instant zero-hardware setup.',
      whereWattHacksWins: 'Unmatched 3.4x average ROI, democratizing utility-grade battery & solar optimization for any building.'
    }
  ];

  return (
    <section id="comparison" className="relative z-10 py-20 border-t border-slate-900/[0.06]">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-mono tracking-wider uppercase font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Honest Architectural Comparison
        </div>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
          How <span className="font-semibold text-slate-900">WattHacks AI</span> Compares to the Market
        </h2>
        <p className="mt-4 text-slate-600 font-light text-base md:text-lg max-w-2xl mx-auto">
          We believe in complete transparency. Here is an honest, technical breakdown of where legacy industrial platforms excel, and where our autonomous software changes the economics.
        </p>
      </div>

      {/* Detailed Comparative Table */}
      <div className="liquid-glass rounded-3xl p-6 md:p-8 overflow-x-auto shadow-xl border border-white/80">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-900/10">
                <th className="pb-4 font-mono text-slate-500 text-xs uppercase tracking-wider min-w-[200px]">Criteria</th>
                {competitors.map((c, idx) => (
                  <th key={idx} className={`pb-4 px-4 min-w-[190px] ${c.isHero ? 'bg-emerald-500/[0.04] rounded-t-xl' : ''}`}>
                    <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal font-sans line-clamp-1">{c.subtitle}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] border ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/[0.06]">
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Pricing Model</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04] font-medium text-emerald-950' : 'text-slate-700'}`}>
                    <div className="font-semibold text-slate-900">{c.pricing}</div>
                    <div className="text-[11px] text-slate-500">{c.pricingType}</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Deployment Time</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04] text-emerald-800 font-semibold' : 'text-slate-700'}`}>
                    {c.setupTime}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Hardware Lock-In</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04] text-emerald-700 font-medium' : 'text-slate-600'}`}>
                    {c.hardwareLockin}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Autonomous ToD Tariff Arbitrage</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04]' : ''}`}>
                    {c.autonomousArbitrage ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                        <Check className="w-4 h-4 text-emerald-600" /> Autonomous RL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                        <X className="w-4 h-4 text-slate-300" /> Manual / None
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Real-Time Grid Carbon Abatement</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04]' : ''}`}>
                    {c.gridCarbonTracking ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                        <Check className="w-4 h-4 text-emerald-600" /> India CEA 0.716
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                        <X className="w-4 h-4 text-slate-300" /> Static or None
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Predictive Weather & HVAC Shaving</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04]' : ''}`}>
                    {c.predictiveHvac ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                        <Check className="w-4 h-4 text-emerald-600" /> 4h Lookahead
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                        <X className="w-4 h-4 text-slate-300" /> Not Supported
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 font-mono text-xs text-slate-600 font-medium">Open BACnet / Modbus / MQTT</td>
                {competitors.map((c, idx) => (
                  <td key={idx} className={`py-4 px-4 ${c.isHero ? 'bg-emerald-500/[0.04]' : ''}`}>
                    {c.modbusBacnetSupport ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-xs">
                        <Check className="w-4 h-4 text-emerald-600" /> Supported
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                        <X className="w-4 h-4 text-slate-300" /> Limited
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Truthful Nuance Callout */}
          <div className="mt-8 pt-6 border-t border-slate-900/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-700 leading-relaxed">
              <div className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Where Legacy Players Truly Excel
              </div>
              <p className="font-light text-slate-600">
                Legacy giants like Schneider and Siemens manufacture industrial hardware that survives 20+ years in hostile mechanical rooms. If you need physical heavy switchgear replacement or high-voltage switchyard relays, their hardware is irreplaceable.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-700 leading-relaxed">
              <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-emerald-600" />
                Where WattHacks AI Changes the Equation
              </div>
              <p className="font-light text-slate-600">
                Instead of replacing your existing electrical infrastructure, WattHacks acts as the brain on top. We connect to your current inverters and meters via open APIs to execute autonomous ToD tariff arbitrage, saving ₹12L–₹40L annually without buying a single proprietary controller.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
