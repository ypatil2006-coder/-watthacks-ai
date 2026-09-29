import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Leaf, 
  Thermometer, 
  Layers, 
  FileText, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  ArrowUpRight,
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';

export default function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [timerDuration, setTimerDuration] = useState(3000); // 3 sec default, 7 sec on click
  const [progressKey, setProgressKey] = useState(0);

  const features = [
    {
      id: 'tod-arbitrage',
      tag: 'FINANCIAL ARBITRAGE',
      title: 'Autonomous ToD Tariff Optimization',
      shortDesc: 'Dispatches BESS batteries dynamically against volatile regional DISCOM time-of-day tariffs.',
      fullDesc: 'Commercial tariffs spike by up to 45% during peak evening hours (6:00 PM – 10:00 PM). WattHacks autonomously predicts your facility demand curve, charges batteries during off-peak night rebates (₹3.50/kWh) or midday solar surplus, and pushes stored power during peak surcharges (₹11.80/kWh), slashing monthly bills by 22%–38%.',
      icon: Zap,
      metrics: [
        { label: 'Avg Tariff Savings', val: '31.4%' },
        { label: 'Dispatch Latency', val: '< 800ms' },
        { label: 'Supported DISCOMs', val: '24+ Grids' }
      ],
      codeSnippet: `// WattHacks Arbitrage Engine
const dispatch = await wattHacks.optimizer.solve({
  tariffWindow: 'PEAK_EVENING_SURCHARGE',
  rateDelta: 8.30, // INR/kWh margin
  batterySoc: 0.88,
  forecastedDemandKw: 340,
  action: 'DISCHARGE_TO_NET_ZERO_GRID'
});`
    },
    {
      id: 'carbon-abatement',
      tag: 'ENVIRONMENTAL INTELLIGENCE',
      title: 'Real-Time CEA Grid Carbon Abatement',
      shortDesc: 'Tracks India Central Electricity Authority 0.716 kg/kWh grid factor to eliminate dirty electrons.',
      fullDesc: 'Not all kilowatt-hours are created equal. When the regional grid spins up thermal peaker plants, emissions spike drastically. WattHacks interfaces directly with regional grid dispatch telemetry, prioritizes clean solar and captive storage, and automatically minimizes grid draw when fossil emission factors exceed baseline thresholds.',
      icon: Leaf,
      metrics: [
        { label: 'CEA Baseline', val: '0.716 kg/kWh' },
        { label: 'Clean Energy Share', val: '91.2%' },
        { label: 'Carbon Avoided', val: '142 tCO2e/yr' }
      ],
      codeSnippet: `// Real-Time Grid Carbon Monitor
const gridIntensity = await wattHacks.grid.getFactor('CEA_REGIONAL_WEST');
if (gridIntensity.co2PerKwh > 0.716) {
  wattHacks.inverter.maximizeCaptiveSolar();
  wattHacks.battery.inject({ rateKw: 150 });
}`
    },
    {
      id: 'predictive-hvac',
      tag: 'THERMAL MACHINE LEARNING',
      title: 'Physics-Informed Predictive HVAC Pre-Cooling',
      shortDesc: 'Pre-conditions building thermal mass during cheap morning hours to eliminate 4:00 PM demand ratchets.',
      fullDesc: 'Commercial HVAC chillers and VRF systems account for up to 60% of commercial electrical draw. Our neural network integrates local solar insolation forecasts and ambient humidity data to pre-cool structural thermal mass 3 hours ahead of peak tariff windows, keeping tenant comfort intact while dodging costly maximum demand contract penalties.',
      icon: Thermometer,
      metrics: [
        { label: 'Peak Shaved', val: '-28.5%' },
        { label: 'Thermal Delta', val: '±0.4°C' },
        { label: 'Forecast Horizon', val: '4 Hours' }
      ],
      codeSnippet: `// Neural HVAC Pre-Conditioner
const thermalPlan = await wattHacks.hvac.forecastThermalLoad({
  ambientTempC: 38.2,
  solarInsolationWm2: 840,
  preCoolOffsetHours: 2.5,
  comfortBand: [22.0, 23.5] // Strict comfort
});`
    },
    {
      id: 'universal-hardware',
      tag: 'INTEROPERABILITY',
      title: 'Universal Hardware Protocol Bridge',
      shortDesc: 'Zero proprietary lock-in. Connects natively to BACnet IP, Modbus RTU/TCP, MQTT, and Solar APIs.',
      fullDesc: 'Why replace functional infrastructure? WattHacks features production-tested drivers for leading commercial inverters (SMA, SolarEdge, Sungrow, Enphase, Huawei) and industrial building protocols (BACnet IP, Modbus TCP, MQTT). Deploy as a lightweight Docker edge container or connect via secure TLS cloud webhooks in minutes.',
      icon: Layers,
      metrics: [
        { label: 'Protocol Stack', val: 'BACnet / Modbus' },
        { label: 'Setup Time', val: '15 Mins' },
        { label: 'Edge Footprint', val: '< 64MB RAM' }
      ],
      codeSnippet: `// Universal Edge Bridge Config
connections:
  - type: 'modbus-tcp'
    host: '192.168.1.120'
    inverter: 'sungrow-sg110cx'
  - type: 'bacnet-ip'
    device_id: 1042
    points: ['chiller-1-power', 'ahu-zone-temp']`
    },
    {
      id: 'brsr-compliance',
      tag: 'ESG & COMPLIANCE',
      title: 'Automated SEBI BRSR Core & ESG Reporting',
      shortDesc: 'Export audit-ready Scope 1 & Scope 2 greenhouse gas reports compliant with SEBI and GHG Protocol.',
      fullDesc: 'Mandatory ESG disclosures like SEBI BRSR Core (India) and CSRD (Europe) require auditable hourly energy lineage. WattHacks generates cryptographically verifiable carbon accounting ledgers, distinguishing green captive generation, green tariff credits, and fossil grid imports at the click of a button.',
      icon: FileText,
      metrics: [
        { label: 'Compliance Standard', val: 'SEBI BRSR Core' },
        { label: 'Audit Export', val: '1-Click PDF/CSV' },
        { label: 'GHG Protocol', val: 'Scope 1 & 2' }
      ],
      codeSnippet: `// 1-Click ESG Report Generation
const auditLedger = await wattHacks.reports.generateBRSR({
  reportingYear: 'FY2025-26',
  methodology: 'GHG_PROTOCOL_MARKET_BASED',
  includeInverterCertificates: true,
  outputFormat: 'PDF_CERTIFIED'
});`
    },
    {
      id: 'edge-resilience',
      tag: 'MISSION CRITICAL',
      title: 'Edge-Resilient Deterministic Safety Envelopes',
      shortDesc: 'Local hardware safeguards ensure zero equipment risk even during total cloud network disconnects.',
      fullDesc: 'Commercial electrical switchgear cannot tolerate cloud latency glitches. If your facility loses external internet access, WattHacks edge daemons fall back to localized deterministic rules, enforcing battery C-rates, cell temperature limits, and anti-islanding regulations without a millisecond of interruption.',
      icon: ShieldAlert,
      metrics: [
        { label: 'Offline Fallback', val: '100% Autonomous' },
        { label: 'Safety Envelope', val: 'MIL-STD Enforced' },
        { label: 'Blackout Risk', val: '0.00%' }
      ],
      codeSnippet: `// Local Deterministic Fallback Daemon
daemon.on('CLOUD_HEARTBEAT_TIMEOUT', () => {
  daemon.engageLocalSafetyEnvelope({
    maxDischargeC: 0.5,
    antiIslanding: 'ENABLED',
    maintainFrequencyHz: 50.0
  });
});`
    }
  ];

  // Auto-cycle timer: 3s normally, 7s after user click
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedFeature((prev) => (prev + 1) % features.length);
      setTimerDuration(3000); // Reset back to default 3s for subsequent auto-cycles
      setProgressKey((prev) => prev + 1);
    }, timerDuration);

    return () => clearTimeout(timer);
  }, [selectedFeature, timerDuration, features.length]);

  const handleSelectFeature = (idx) => {
    setSelectedFeature(idx);
    setTimerDuration(7000); // 7-second reading window on user interaction
    setProgressKey((prev) => prev + 1);
  };

  return (
    <section id="features" className="relative z-10 py-24 border-t border-slate-900/[0.06]">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-800 text-xs font-mono tracking-wider uppercase font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Production-Ready Architecture
        </div>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
          Core Features of <span className="font-semibold text-slate-900">WattHacks AI</span>
        </h2>
        <p className="mt-4 text-slate-600 font-light text-base md:text-lg max-w-2xl mx-auto">
          Built from the ground up to turn passive commercial building meters into active, money-saving intelligence nodes.
        </p>
      </div>

      {/* Interactive Feature Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Feature Selector Column */}
        <div className="lg:col-span-5 space-y-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const isSelected = selectedFeature === idx;
            return (
              <div
                key={f.id}
                onClick={() => handleSelectFeature(idx)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border text-left relative overflow-hidden ${
                  isSelected
                    ? 'liquid-glass shadow-lg border-emerald-500/40 bg-white/90 scale-[1.01]'
                    : 'bg-white/40 hover:bg-white/70 border-slate-900/[0.06] hover:border-slate-900/15'
                }`}
              >
                {/* Active auto-cycle timer progress bar */}
                {isSelected && (
                  <div
                    key={progressKey}
                    className="absolute bottom-0 left-0 h-[2.5px] bg-emerald-500 rounded-full"
                    style={{
                      animation: `featureProgress ${timerDuration}ms linear forwards`
                    }}
                  />
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                        {f.tag}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                          {timerDuration === 7000 ? '7s' : '3s'}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold mt-0.5 truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light mt-1 line-clamp-2">
                      {f.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Feature Deep Dive Display */}
        <div className="lg:col-span-7">
          <div className="liquid-glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80 sticky top-28">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-900/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center">
                  {React.createElement(features[selectedFeature].icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-semibold">
                    {features[selectedFeature].tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                    {features[selectedFeature].title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-xs">
                  MODULE 0{selectedFeature + 1} / 06
                </span>
              </div>
            </div>

            {/* Deep Description */}
            <p className="mt-6 text-slate-700 font-light text-sm md:text-base leading-relaxed">
              {features[selectedFeature].fullDesc}
            </p>

            {/* Key Metrics Chips */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {features[selectedFeature].metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/[0.03] border border-slate-900/[0.05]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {m.label}
                  </div>
                  <div className="text-base md:text-lg font-semibold font-mono text-slate-900 mt-0.5">
                    {m.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Code / Protocol Live Hook */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                <span>// RUNTIME PROTOCOL INTERFACE</span>
                <span className="text-emerald-600">● LIVE RUNNER</span>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <code>{features[selectedFeature].codeSnippet}</code>
              </pre>
            </div>

            {/* Micro action */}
            <div className="mt-6 pt-4 border-t border-slate-900/10 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-light">
                Ready to deploy this capability to your facility?
              </span>
              <a
                href="#try-it-out"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
              >
                <span>Test in Interactive ROI Sandbox</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
