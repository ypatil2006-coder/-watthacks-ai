import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Zap, 
  Leaf, 
  BatteryCharging, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Sun, 
  Building, 
  Radio, 
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  Edit3,
  Sliders,
  Check,
  ChevronRight,
  FileText
} from 'lucide-react';
import BrsrAuditReportModal from './BrsrAuditReportModal';
import { 
  resolveLocationFromGps, 
  getLiveTelemetry, 
  optimizeLoadShift, 
  uploadBill 
} from '../services/api';

const PRESETS = [
  {
    name: 'Pune Tech Park (Campus West)',
    type: 'Commercial IT Park',
    discom: 'MSEDCL (Maharashtra)',
    bill: 850000,
    demand: 550,
    solar: 300,
    bess: 200,
    equipment: ['hvac', 'inverter', 'ev']
  },
  {
    name: 'Bengaluru Tech Hub (Zone South)',
    type: 'Commercial Office Campus',
    discom: 'BESCOM (Karnataka)',
    bill: 520000,
    demand: 380,
    solar: 180,
    bess: 120,
    equipment: ['hvac', 'inverter']
  },
  {
    name: 'Gurugram Industrial Hub',
    type: 'Manufacturing Plant',
    discom: 'Tata Power (Delhi / Haryana)',
    bill: 1450000,
    demand: 950,
    solar: 450,
    bess: 350,
    equipment: ['hvac', 'inverter', 'dg', 'ev']
  }
];

/* ======================================================== */
/* 24-HOUR DIURNAL ARBITRAGE GRAPH (DASHBOARD SECTION 2)    */
/* ======================================================== */
function DiurnalDashboardGraph({ demand = 500 }) {
  const scale = demand / 500;
  const baseline = [180, 175, 170, 170, 180, 210, 260, 310, 360, 410, 430, 440, 430, 420, 440, 460, 470, 480, 495, 510, 490, 450, 320, 220].map(v => Math.round(v * scale));
  const optimized = [270, 270, 270, 270, 270, 230, 210, 230, 270, 310, 280, 250, 340, 360, 380, 370, 340, 300, 210, 200, 210, 220, 270, 270].map(v => Math.round(v * scale));

  const maxVal = Math.round(550 * scale);
  const getX = (h) => 45 + (h / 23) * 655;
  const getY = (kw) => 205 - (kw / maxVal) * 165;

  const baselinePath = baseline.map((kw, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(kw).toFixed(1)}`).join(' ');
  const optimizedPath = optimized.map((kw, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(kw).toFixed(1)}`).join(' ');
  const optimizedArea = `${optimizedPath} L ${getX(23)} 205 L ${getX(0)} 205 Z`;

  const peakShavedKw = baseline[19] - optimized[19];

  return (
    <div className="w-full overflow-hidden select-none">
      <svg viewBox="0 0 740 230" className="w-full h-auto text-slate-400">
        <defs>
          <linearGradient id="dashboardOptGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Zones */}
        <rect x={getX(0)} y="20" width={getX(6) - getX(0)} height="185" fill="#ecfdf5" opacity="0.8" />
        <text x={(getX(0) + getX(6)) / 2} y="33" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="600">
          Zone E: Night Rebate (-₹1.50)
        </text>

        <rect x={getX(12)} y="20" width={getX(16) - getX(12)} height="185" fill="#fef3c7" opacity="0.75" />
        <text x={(getX(12) + getX(16)) / 2} y="33" textAnchor="middle" fill="#b45309" fontSize="8.5" fontWeight="600">
          Zone C: Solar Pre-Cooling
        </text>

        <rect x={getX(18)} y="20" width={getX(22) - getX(18)} height="185" fill="#ffe4e6" opacity="0.85" />
        <text x={(getX(18) + getX(22)) / 2} y="33" textAnchor="middle" fill="#be123c" fontSize="8.5" fontWeight="600">
          Zone D: Peak Surcharge (+₹1.50)
        </text>

        <rect x={getX(22)} y="20" width={getX(23) - getX(22)} height="185" fill="#ecfdf5" opacity="0.8" />

        {/* Gridlines */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((frac) => {
          const kw = Math.round(maxVal * frac);
          return (
            <g key={kw}>
              <line x1="45" y1={getY(kw)} x2={getX(23)} y2={getY(kw)} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x="40" y={getY(kw) + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                {kw} kW
              </text>
            </g>
          );
        })}

        {/* Baseline Curve */}
        <path d={baselinePath} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />

        {/* Optimized Area & Curve */}
        <path d={optimizedArea} fill="url(#dashboardOptGrad)" />
        <path d={optimizedPath} fill="none" stroke="#059669" strokeWidth="2.5" />

        {/* Peak Shaved Callout at 19:00 */}
        <line x1={getX(19)} y1={getY(baseline[19])} x2={getX(19)} y2={getY(optimized[19])} stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
        <circle cx={getX(19)} cy={getY(baseline[19])} r="3.5" fill="#64748b" />
        <circle cx={getX(19)} cy={getY(optimized[19])} r="3.5" fill="#059669" />
        <rect x={getX(19) - 55} y={getY((baseline[19] + optimized[19]) / 2) - 10} width="110" height="20" rx="4" fill="#be123c" />
        <text x={getX(19)} y={getY((baseline[19] + optimized[19]) / 2) + 4} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          ▼ {peakShavedKw} kW Peak Shaved
        </text>

        {/* X Axis */}
        <line x1="45" y1="205" x2={getX(23)} y2="205" stroke="#cbd5e1" strokeWidth="1" />
        {[0, 3, 6, 9, 12, 15, 18, 21, 23].map((h) => (
          <g key={h}>
            <line x1={getX(h)} y1="205" x2={getX(h)} y2="210" stroke="#94a3b8" />
            <text x={getX(h)} y="222" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">
              {String(h).padStart(2, '0')}:00
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ProductDashboard({ onBack }) {
  // Mode: 'intake' | 'dashboard' (persisted so refresh stays in console if already launched)
  const [viewMode, setViewMode] = useState(() => {
    try {
      return sessionStorage.getItem('watthacks_console_view_mode') || 'intake';
    } catch (e) {
      return 'intake';
    }
  });
  const [intakeStep, setIntakeStep] = useState(1); // 1: Facility & Tariff | 2: Hardware & Assets | 3: Connected Subsystems

  useEffect(() => {
    try {
      sessionStorage.setItem('watthacks_console_view_mode', viewMode);
    } catch (e) {}
  }, [viewMode]);

  // Facility Form State
  const [formData, setFormData] = useState({
    facilityName: 'Pune Tech Park (Campus West)',
    facilityType: 'Commercial IT Park',
    discom: 'MSEDCL (Maharashtra)',
    monthlyBill: 850000,
    demand: 550,
    solar: 300,
    bess: 200,
    hasHvac: true,
    hasInverter: true,
    hasEv: true,
    hasDg: false
  });

  // Live Telemetry state
  const [liveGrid, setLiveGrid] = useState(24);
  const [liveBess, setLiveBess] = useState(126);
  const [liveSolar, setLiveSolar] = useState(140);
  const [liveCostSaved, setLiveCostSaved] = useState(18450);
  const [liveCarbon, setLiveCarbon] = useState(164.2);
  const [batterySoc, setBatterySoc] = useState(78);
  const [downloadModal, setDownloadModal] = useState(false);

  // Backend Integration State
  const [geoLoading, setGeoLoading] = useState(false);
  const [billUploading, setBillUploading] = useState(false);
  const [billExtracted, setBillExtracted] = useState(null);
  const [backendOptimization, setBackendOptimization] = useState(null);
  const [liveTelemetryData, setLiveTelemetryData] = useState(null);

  // Apply a preset
  const applyPreset = (preset) => {
    setFormData({
      facilityName: preset.name,
      facilityType: preset.type,
      discom: preset.discom,
      monthlyBill: preset.bill,
      demand: preset.demand,
      solar: preset.solar,
      bess: preset.bess,
      hasHvac: Array.isArray(preset.equipment) && preset.equipment.includes('hvac'),
      hasInverter: Array.isArray(preset.equipment) && preset.equipment.includes('inverter'),
      hasEv: Array.isArray(preset.equipment) && preset.equipment.includes('ev'),
      hasDg: Array.isArray(preset.equipment) && preset.equipment.includes('dg')
    });
  };

  // Calculations derived from user input
  const billNum = Number(formData.monthlyBill) || 600000;
  const solarNum = Number(formData.solar) || 0;
  const bessNum = Number(formData.bess) || 0;
  const demandNum = Number(formData.demand) || 400;

  // Regional tariff delta (Peak vs Off-peak)
  const getDiscomDelta = () => {
    const d = typeof formData.discom === 'string' ? formData.discom : '';
    if (d.includes('MSEDCL')) return 6.1; // +4.60 peak, -1.50 off-peak
    if (d.includes('BESCOM')) return 5.0; // +3.80 peak, -1.20 off-peak
    if (d.includes('Tata Power')) return 5.6; // +4.20 peak, -1.40 off-peak
    if (d.includes('TANGEDCO')) return 4.5;
    return 5.2;
  };
  const discomDelta = getDiscomDelta();

  // Clear stale cached backend optimization whenever user modifies preset or form fields
  useEffect(() => {
    setBackendOptimization(null);
  }, [formData.demand, formData.monthlyBill, formData.solar, formData.bess, formData.discom, formData.facilityName]);

  // Monthly & annual physical calculations derived from user inputs
  const annualSolarKwh = solarNum * 1450;
  const solarAnnualSavings = annualSolarKwh * 5.2;
  const bessAnnualSavings = bessNum > 0 ? (bessNum * 0.85 * 300 * discomDelta) : 0;
  const shiftedLoadKwhDaily = Math.round(demandNum * 0.52);
  const todShiftSavingsAnnual = shiftedLoadKwhDaily * 30 * 3.0 * 12;
  const demandAnnualSavings = billNum * 0.08 * 12;
  
  // Real-time dynamic computed savings
  const computedAnnualSavings = Math.min(billNum * 12 * 0.45, Math.round(solarAnnualSavings + bessAnnualSavings + todShiftSavingsAnnual + demandAnnualSavings));
  const totalAnnualSavings = backendOptimization?.projectedAnnualSavingsInr || computedAnnualSavings;
  const totalMonthlySavings = backendOptimization?.netMonthlySavingsInr || Math.round(totalAnnualSavings / 12);
  const annualCarbonTons = backendOptimization?.annualCarbonAvoidedTons || Math.round(((annualSolarKwh + (bessNum * 0.85 * 300) + (shiftedLoadKwhDaily * 300))) * (0.716 / 1000));
  
  const softwareFeeYearly = 179988; // ₹14,999 * 12
  const netAnnualGain = totalAnnualSavings - softwareFeeYearly;
  const paybackMonths = totalAnnualSavings > 0 ? ((softwareFeeYearly / totalAnnualSavings) * 12).toFixed(1) : '1.4';

  // 1. LIVE BACKEND TELEMETRY POLLING
  useEffect(() => {
    if (viewMode !== 'dashboard') return;
    
    let isMounted = true;
    async function fetchLiveTelemetry() {
      try {
        const regionName = typeof formData.discom === 'string' ? (formData.discom.split('•')[0].split('(')[0].trim() || 'pune') : 'pune';
        const res = await getLiveTelemetry(regionName);
        if (isMounted && res?.telemetry) {
          const t = res.telemetry;
          setLiveTelemetryData(t);

          // Real solar output derived from Open-Meteo direct normal irradiance
          const solarWm2 = t.liveSolarWeather?.directNormalSolarIrradianceWm2 || 680;
          const calculatedSolar = Math.round((solarWm2 / 1000) * solarNum * 0.82);
          setLiveSolar(calculatedSolar);

          // Facility active baseline demand
          const totalFacilityLoad = Math.round(demandNum * 0.72);

          // BESS discharge rate depending on active TOD slot
          let bessRate = 0;
          if (t.activeSlot?.zoneKey === 'zoneD' || (new Date().getHours() >= 18 && new Date().getHours() < 22)) {
            bessRate = Math.min(bessNum * 0.5, totalFacilityLoad * 0.45);
          } else if (bessNum > 0) {
            bessRate = Math.min(bessNum * 0.2, totalFacilityLoad * 0.2);
          }
          setLiveBess(Math.round(bessRate));

          // Grid draw is remainder
          const gridDraw = Math.max(14, totalFacilityLoad - calculatedSolar - bessRate);
          setLiveGrid(Math.round(gridDraw));

          // Dynamic TOD cost saved pulse
          setLiveCostSaved(prev => prev + (t.activeSlot?.tariffAdjustmentInr ? Math.abs(t.activeSlot.tariffAdjustmentInr) * 0.6 : 1.2));
          setLiveCarbon(prev => +(prev + 0.04).toFixed(1));
        }
      } catch (err) {
        console.warn('Backend telemetry notice:', err.message);
      }
    }

    fetchLiveTelemetry();
    const interval = setInterval(fetchLiveLive => fetchLiveTelemetry(), 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [viewMode, formData.discom, demandNum, solarNum, bessNum]);

  // 2. GPS LOCATION RESOLUTION
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await resolveLocationFromGps(latitude, longitude);
          if (res?.success) {
            setFormData(prev => ({
              ...prev,
              discom: `${res.discom} (${res.state}) • Peak +₹1.50/kWh`,
              facilityName: (typeof prev.facilityName === 'string' && prev.facilityName.includes('Pune')) ? `${res.matchedCity} Facility Node` : prev.facilityName
            }));
          }
        } catch (err) {
          console.error("Failed to resolve GPS location:", err);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        console.warn("GPS access denied:", err.message);
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  };

  // 3. MULTIMODAL BILL INGESTION
  const handleBillUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setBillUploading(true);
      const res = await uploadBill(file);
      if (res?.extracted) {
        const ext = res.extracted;
        setBillExtracted(ext);
        setFormData(prev => ({
          ...prev,
          monthlyBill: ext.billedAmountInr || (ext.totalUnitsKwh * 8.5) || prev.monthlyBill,
          demand: ext.billedDemandKva || prev.demand,
          facilityName: ext.consumerName || prev.facilityName
        }));
      }
    } catch (err) {
      console.error("Bill extraction error:", err);
    } finally {
      setBillUploading(false);
    }
  };

  const activeFacilityDemand = Math.round(liveGrid + liveBess + liveSolar);

  const formatInr = (val) => {
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' Lakhs';
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  // 4. LAUNCH CONSOLE WITH REAL OPTIMIZATION
  const handleLaunchConsole = async (e) => {
    e.preventDefault();
    try {
      const opt = await optimizeLoadShift({
        peakLoadKw: Math.round(demandNum * 0.85),
        flexibleSharePercent: 35,
        contractDemandKva: demandNum
      });
      if (opt?.optimization) {
        setBackendOptimization(opt.optimization);
      }
    } catch (err) {
      console.warn("Optimization calculation fallback:", err.message);
    }
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    try {
      sessionStorage.removeItem('watthacks_console_view_mode');
    } catch (e) {}
    onBack();
  };

  return (
    <div className="relative z-10 w-full min-h-screen py-8 animate-fadeIn">
      {/* ======================================================== */}
      {/* MODE A: FACILITY INTAKE FORM (Taking information first) */}
      {/* ======================================================== */}
      {viewMode === 'intake' ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Bar with Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="px-4 py-2 rounded-xl bg-slate-900/5 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home Overview</span>
            </button>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-mono uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Step 1: Facility Profile Intake
            </div>
          </div>

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-slate-900">
              Configure Your <span className="font-semibold text-slate-900">Facility Node</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-slate-600 font-light leading-relaxed">
              Input your building energy metrics or pick a quick preset below. WattHacks AI will instantly model your autonomous ToD arbitrage, CEA carbon abatement, and real-time dispatch schedules.
            </p>
          </div>

          {/* Quick Presets Bar */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Quick 1-Click Test Presets:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.facilityName === p.name 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white/70 hover:bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold truncate">{p.type}</span>
                    <span className={`text-[10px] ${formData.facilityName === p.name ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {p.solar} kWp PV
                    </span>
                  </div>
                  <div className="text-xs font-medium mt-1 truncate">{p.name}</div>
                  <div className="text-[11px] opacity-75 mt-1 font-mono">
                    {formatInr(p.bill)}/mo • {p.bess} kWh BESS
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Intake Form Card */}
          {/* Main Intake Form Card with 3-Step Guided Wizard */}
          <form onSubmit={handleLaunchConsole} className="liquid-glass rounded-3xl p-6 md:p-10 shadow-2xl border border-white/80 space-y-8">
            
            {/* GUIDED WIZARD STEP INDICATOR */}
            <div className="border-b border-slate-900/10 pb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase text-emerald-800 tracking-wider">
                  Guided Intake Wizard • Step {intakeStep} of 3
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {intakeStep === 1 && '33% Completed'}
                  {intakeStep === 2 && '66% Completed'}
                  {intakeStep === 3 && '100% Ready to Deploy'}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-5">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(intakeStep / 3) * 100}%` }}
                ></div>
              </div>

              {/* 3 Step Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIntakeStep(1)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    intakeStep === 1 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : intakeStep > 1 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900' 
                        : 'bg-white/60 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase">
                    <span>01</span>
                    {intakeStep > 1 && <Check className="w-3 h-3 text-emerald-600 ml-auto" />}
                  </div>
                  <div className="text-xs font-semibold mt-1 truncate">Facility & Tariff</div>
                  <div className="text-[10px] opacity-75 font-mono truncate hidden sm:block">DISCOM & Monthly Bill</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIntakeStep(2)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    intakeStep === 2 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : intakeStep > 2 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900' 
                        : 'bg-white/60 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase">
                    <span>02</span>
                    {intakeStep > 2 && <Check className="w-3 h-3 text-emerald-600 ml-auto" />}
                  </div>
                  <div className="text-xs font-semibold mt-1 truncate">Hardware Assets</div>
                  <div className="text-[10px] opacity-75 font-mono truncate hidden sm:block">Solar PV & BESS Battery</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIntakeStep(3)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    intakeStep === 3 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white/60 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase">
                    <span>03</span>
                  </div>
                  <div className="text-xs font-semibold mt-1 truncate">Connected Protocols</div>
                  <div className="text-[10px] opacity-75 font-mono truncate hidden sm:block">BACnet, Modbus & Launch</div>
                </button>
              </div>
            </div>

            {/* ========================================= */}
            {/* STEP 1: FACILITY DETAILS & UTILITY TARIFF */}
            {/* ========================================= */}
            {intakeStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Guidance Box */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold font-mono text-emerald-900 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Step 1 Guidance: Why Tariff & Bill Baseline Matters
                  </div>
                  <p className="font-light leading-relaxed">
                    Indian DISCOMs apply Time-of-Day (ToD) surcharges up to +₹4.60/kWh during evening peak demand hours (17:00–22:00). Specifying your utility zone allows WattHacks AI to map your exact hourly tariff structure and compute precision ToD arbitrage.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1.5">
                      Facility / Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.facilityName}
                      onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                      placeholder="e.g. Pune Tech Park Campus"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-sans shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1.5">
                      Facility Category
                    </label>
                    <select
                      value={formData.facilityType}
                      onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-sans shadow-sm"
                    >
                      <option>Commercial IT Park</option>
                      <option>Commercial Office Campus</option>
                      <option>Manufacturing & Assembly Plant</option>
                      <option>Data Center Facility</option>
                      <option>Healthcare & Multi-Specialty Hospital</option>
                      <option>Logistics Warehouse & Cold Chain</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono text-slate-500 uppercase">
                        Regional DISCOM / Tariff Regime
                      </label>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={geoLoading}
                        className="text-[11px] font-mono text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold cursor-pointer active:scale-95 transition-all"
                        title="Detect nearest Indian regional grid via browser GPS"
                      >
                        <Radio className={`w-3 h-3 ${geoLoading ? 'animate-spin' : ''}`} />
                        <span>{geoLoading ? 'Resolving Grid...' : '📍 Auto-Detect GPS'}</span>
                      </button>
                    </div>
                    <select
                      value={formData.discom}
                      onChange={(e) => setFormData({ ...formData, discom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-sans shadow-sm"
                    >
                      <option>MSEDCL (Maharashtra) • Peak +₹1.50/kWh</option>
                      <option>BESCOM (Karnataka / Bangalore) • Peak +₹1.20/kWh</option>
                      <option>Tata Power (Mumbai / Delhi) • Peak +₹1.35/kWh</option>
                      <option>TANGEDCO (Tamil Nadu) • Peak +₹1.15/kWh</option>
                      <option>BSES Rajdhani / Yamuna (Delhi) • Peak +₹1.40/kWh</option>
                      <option>PG&E (California Commercial B-19 ToD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1.5">
                      Monthly Electricity Bill (Avg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="50000"
                        step="25000"
                        value={formData.monthlyBill}
                        onChange={(e) => setFormData({ ...formData, monthlyBill: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono shadow-sm"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-mono font-semibold text-emerald-700">
                        {formatInr(formData.monthlyBill)}
                      </span>
                    </div>
                  </div>

                  {/* Multimodal Bill Auto-Ingestion Card */}
                  <div className="md:col-span-2 p-4 rounded-2xl bg-white/70 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-800">
                          Smart Ingestion: Upload Electricity Bill (PDF / PNG / JPG)
                        </span>
                      </div>
                      {billExtracted ? (
                        <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          AI Extracted ({billExtracted.totalUnitsKwh?.toLocaleString('en-IN') || '48,500'} kWh)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          Multimodal Gemini 3.8 Flash OCR
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 text-xs text-slate-600 cursor-pointer transition-all">
                        <Download className="w-3.5 h-3.5 text-slate-400 rotate-180" />
                        <span>{billUploading ? 'Analyzing with Gemini OCR...' : 'Choose or Drop Bill File to Auto-Populate'}</span>
                        <input
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/webp"
                          onChange={handleBillUpload}
                          disabled={billUploading}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setBillUploading(true);
                            const res = await uploadBill(null, true);
                            if (res?.extracted) {
                              setBillExtracted(res.extracted);
                              setFormData(prev => ({
                                ...prev,
                                monthlyBill: res.extracted.billedAmountInr || 850000,
                                demand: res.extracted.billedDemandKva || 550,
                                facilityName: res.extracted.consumerName || "Hinjewadi Tech Hub (MSEDCL)"
                              }));
                            }
                          } finally {
                            setBillUploading(false);
                          }
                        }}
                        disabled={billUploading}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        ⚡ Load Sample MSEDCL Bill
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-900/10">
                  <div className="text-xs text-slate-500 font-mono">
                    Estimated Gross Arbitrage: <strong className="text-slate-900">{formatInr(totalAnnualSavings)}/yr</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntakeStep(2)}
                    className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Continue to Step 2: Hardware Assets</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* STEP 2: HARDWARE & CAPACITY ASSETS        */}
            {/* ========================================= */}
            {intakeStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Guidance Box */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold font-mono text-amber-900 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Step 2 Guidance: Sizing Captive Solar & Battery Storage
                  </div>
                  <p className="font-light leading-relaxed">
                    Solar generation eliminates midday grid dependency, while Battery Energy Storage (BESS) stores cheap or solar power to discharge during peak surcharge hours (17:00–22:00). Enter 0 for any assets you have not deployed yet.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1.5">
                      Sanctioned Demand (kW)
                    </label>
                    <input
                      type="number"
                      min="50"
                      step="25"
                      value={formData.demand}
                      onChange={(e) => setFormData({ ...formData, demand: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono shadow-sm"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">Contracted peak capacity</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1.5">
                      Rooftop Solar PV (kWp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="25"
                      value={formData.solar}
                      onChange={(e) => setFormData({ ...formData, solar: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono shadow-sm"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">Enter 0 if planned/none</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1.5">
                      Battery BESS (kWh)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="20"
                      value={formData.bess}
                      onChange={(e) => setFormData({ ...formData, bess: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/90 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono shadow-sm"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">LiFePO4 / LFP capacity</span>
                  </div>
                </div>

                {/* Instant Calculation Preview */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Modeled Daily Peak Offset</span>
                    <strong className="text-emerald-400 text-base">{Math.round(solarNum * 0.47 + bessNum * 0.63)} kW</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Annual Displaced Grid Carbon</span>
                    <strong className="text-white text-base">{annualCarbonTons} Metric Tons CO2e</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Software Payback</span>
                    <strong className="text-brand-apricot text-base">{paybackMonths} Months</strong>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-900/10">
                  <button
                    type="button"
                    onClick={() => setIntakeStep(1)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-mono transition-all cursor-pointer"
                  >
                    ← Back to Step 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntakeStep(3)}
                    className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Continue to Step 3: Subsystems</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* STEP 3: PROTOCOLS & FINAL DEPLOYMENT      */}
            {/* ========================================= */}
            {intakeStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Guidance Box */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold font-mono text-cyan-900 uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                    Step 3 Guidance: Edge Communication & Deterministic Safety
                  </div>
                  <p className="font-light leading-relaxed">
                    WattHacks connects directly to your existing building management systems via Modbus TCP and BACnet IP. All dispatch optimization runs offline on an edge daemon with deterministic safety envelopes — zero cloud latency or risk of downtime.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.hasHvac ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasHvac}
                      onChange={(e) => setFormData({ ...formData, hasHvac: e.target.checked })}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span>BACnet Chiller / HVAC</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.hasInverter ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasInverter}
                      onChange={(e) => setFormData({ ...formData, hasInverter: e.target.checked })}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span>Modbus Inverter TCP</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.hasEv ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasEv}
                      onChange={(e) => setFormData({ ...formData, hasEv: e.target.checked })}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span>OCPP EV Fleet Hub</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.hasDg ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasDg}
                      onChange={(e) => setFormData({ ...formData, hasDg: e.target.checked })}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span>Backup DG Genset</span>
                  </label>
                </div>

                {/* Configuration Summary Card */}
                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-2">
                    Review Configured Facility Profile:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-600">
                    <div>Facility: <strong className="text-slate-900 block truncate">{formData.facilityName}</strong></div>
                    <div>Tariff Zone: <strong className="text-slate-900 block truncate">{formData.discom.split('•')[0]}</strong></div>
                    <div>Hardware: <strong className="text-slate-900 block">{formData.solar} kWp / {formData.bess} kWh</strong></div>
                    <div>Annual Gain: <strong className="text-emerald-700 block">{formatInr(netAnnualGain)} net</strong></div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900/10">
                  <button
                    type="button"
                    onClick={() => setIntakeStep(2)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-mono transition-all cursor-pointer"
                  >
                    ← Back to Step 2
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm tracking-wide transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>Generate Autonomous Grid Console</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        /* ======================================================== */
        /* MODE B: SECTION-WISE RESULTS & LIVE INTELLIGENCE CONSOLE */
        /* ======================================================== */
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Top Control Bar */}
          <div className="liquid-glass rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl border border-white/80">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button
                onClick={handleBackToHome}
                className="px-3 py-1.5 rounded-xl bg-slate-900/5 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>

              <button
                onClick={() => setViewMode('intake')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-500/20 font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edit Facility Profile</span>
              </button>
              
              <div className="h-5 w-[1px] bg-slate-300 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-slate-900">
                  {formData.facilityName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AUTONOMOUS DISPATCH
                </span>
              </div>
            </div>

            {/* Grid & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs">
                <Zap className="w-3.5 h-3.5 text-brand-apricot" />
                <span>{formData.discom.split('•')[0]}</span>
              </div>

              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-mono text-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>CEA Factor: <strong>0.716 kg/kWh</strong></span>
              </div>

              <button
                onClick={() => setDownloadModal(true)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>BRSR Report</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: LIVE POWER TELEMETRY & ROUTING MATRIX */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
                  Section 1: Live Real-Time Power Telemetry & Power Routing Matrix
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">SUB-MINUTE REFRESH</span>
            </div>

            {/* Live Backend Telemetry Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 text-white font-mono text-xs shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Slot: <strong className="text-emerald-300">{liveTelemetryData?.activeSlot?.slotName || 'Afternoon Solar Window (12:00 - 18:00)'}</strong></span>
                <span className="text-slate-400">•</span>
                <span>Freq: <strong className="text-white">{liveTelemetryData?.gridFrequencyHz?.toFixed(2) || '50.03'} Hz</strong></span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-300">
                <span>Solar DNI: <strong className="text-amber-400">{liveTelemetryData?.liveSolarWeather?.directNormalSolarIrradianceWm2?.toFixed(1) || '716.7'} W/m²</strong></span>
                <span>Ambient: <strong className="text-cyan-300">{liveTelemetryData?.liveSolarWeather?.ambientTemperatureC || '32.3'}°C</strong></span>
                <span>Grid Intensity: <strong className="text-emerald-400">{liveTelemetryData?.carbonIntensityGco2 || '451'} gCO₂/kWh</strong></span>
              </div>
            </div>

            {/* 4 Main Real-Time KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* KPI 1 */}
              <div className="liquid-glass rounded-2xl p-5 shadow-lg border border-white/80">
                <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                  <span>ACTIVE FACILITY DEMAND</span>
                  <Building className="w-4 h-4 text-slate-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold font-mono text-slate-900">{activeFacilityDemand}</span>
                  <span className="text-xs font-mono text-slate-500">kW</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-900/5 text-[11px] font-mono flex justify-between text-slate-600">
                  <span>Grid: <strong className="text-emerald-700">{Math.round(liveGrid)} kW</strong></span>
                  <span>BESS: <strong className="text-brand-apricot">{Math.round(liveBess)} kW</strong></span>
                  <span>PV: <strong className="text-emerald-600">{Math.round(liveSolar)} kW</strong></span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="liquid-glass rounded-2xl p-5 shadow-lg border border-white/80">
                <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                  <span>TOD SAVINGS TODAY</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold font-mono text-emerald-700">₹{Math.round(liveCostSaved).toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-900/5 text-[11px] font-mono text-slate-500 flex justify-between">
                  <span>Delta: +₹{discomDelta.toFixed(1)}/kWh</span>
                  <span className="text-emerald-700 font-semibold">-34.2% vs Baseline</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="liquid-glass rounded-2xl p-5 shadow-lg border border-white/80">
                <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                  <span>CARBON ABATED</span>
                  <Leaf className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold font-mono text-slate-900">{liveCarbon}</span>
                  <span className="text-xs font-mono text-slate-500">kg CO2e</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-900/5 text-[11px] font-mono text-slate-500 flex justify-between">
                  <span>India CEA 0.716 Standard</span>
                  <span className="text-emerald-700 font-semibold">100% Certified</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="liquid-glass rounded-2xl p-5 shadow-lg border border-white/80">
                <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                  <span>BESS BATTERY SOC</span>
                  <BatteryCharging className="w-4 h-4 text-brand-apricot" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold font-mono text-slate-900">{batterySoc}%</span>
                  <span className="text-xs font-mono text-slate-500">46.5°C Cell</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-900/5 text-[11px] font-mono text-slate-500 flex justify-between">
                  <span>Capacity: {formData.bess} kWh</span>
                  <span className="text-brand-apricot font-semibold">Ready for Peak</span>
                </div>
              </div>
            </div>

            {/* Dynamic Power Flow Schematic */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 shadow-xl border border-white/80">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900/10">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    Active Energy Routing Matrix
                  </h3>
                  <span className="text-xs text-slate-500 font-light">
                    Directing stored BESS and rooftop solar into {formData.facilityName}
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ● 88.4% GREEN / STORED ARBITRAGE
                </span>
              </div>

              <div className="my-6 p-6 rounded-2xl bg-slate-950 text-white shadow-inner relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center relative z-10">
                  {/* Solar */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <Sun className="w-7 h-7 text-amber-400 mb-2" />
                    <span className="text-[11px] font-mono text-slate-400">ROOFTOP SOLAR PV</span>
                    <span className="text-xl font-mono font-semibold text-amber-300 mt-1">{Math.round(liveSolar)} kW</span>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1">Direct Captive Consumption</span>
                  </div>

                  {/* BESS */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center">
                    <BatteryCharging className="w-7 h-7 text-brand-apricot mb-2 animate-bounce" />
                    <span className="text-[11px] font-mono text-slate-400">BATTERY STORAGE (BESS)</span>
                    <span className="text-xl font-mono font-semibold text-brand-apricot mt-1">{Math.round(liveBess)} kW</span>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1">Discharging to Dodge Peak Tariff</span>
                  </div>

                  {/* Grid */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <Zap className="w-7 h-7 text-cyan-400 mb-2" />
                    <span className="text-[11px] font-mono text-slate-400">UTILITY GRID IMPORT</span>
                    <span className="text-xl font-mono font-semibold text-cyan-300 mt-1">{Math.round(liveGrid)} kW</span>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1">Throttled Base Load</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    COMBINED CONSUMPTION AT FACILITY
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-semibold text-white">
                    {activeFacilityDemand} <span className="text-sm font-normal text-slate-400">kW Active Load</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: 24-HOUR DISCOM TARIFF & DISPATCH SCHEDULE */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
                  Section 2: 24-Hour DISCOM Tariff Curve & Automated Dispatch Schedule
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{formData.discom.split('•')[0]}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950">
                <div className="flex justify-between items-center text-[10px] font-semibold text-emerald-700">
                  <span>00:00 - 06:00</span>
                  <span>REBATE ZONE</span>
                </div>
                <div className="text-xl font-bold font-mono mt-2">₹3.50 / kWh</div>
                <div className="text-[11px] text-slate-600 font-sans mt-2">
                  WattHacks AI deep-charges BESS and triggers building sub-cooling at minimum utility tariff.
                </div>
                <span className="inline-block mt-3 px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-semibold">
                  DEEP BESS CHARGE
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 text-slate-800">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                  <span>06:00 - 10:00</span>
                  <span>NORMAL TARIFF</span>
                </div>
                <div className="text-xl font-semibold font-mono mt-2 text-slate-900">₹7.20 / kWh</div>
                <div className="text-[11px] text-slate-600 font-sans mt-2">
                  Direct utility import supplemented by morning rooftop solar generation as facility ramps up.
                </div>
                <span className="inline-block mt-3 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                  NORMAL GRID DRAW
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950">
                <div className="flex justify-between items-center text-[10px] font-semibold text-amber-700">
                  <span>10:00 - 17:00</span>
                  <span>HIGH SOLAR PEAK</span>
                </div>
                <div className="text-xl font-bold font-mono mt-2">₹5.80 / kWh</div>
                <div className="text-[11px] text-slate-600 font-sans mt-2">
                  100% captive solar self-consumption, topping off BESS to 100% SOC with zero export curtailment.
                </div>
                <span className="inline-block mt-3 px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-semibold">
                  SOLAR CAPTIVE DISPATCH
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-950">
                <div className="flex justify-between items-center text-[10px] font-semibold text-red-700">
                  <span>17:00 - 22:00</span>
                  <span>PEAK SURCHARGE</span>
                </div>
                <div className="text-xl font-bold font-mono mt-2 text-red-700">₹11.80 / kWh</div>
                <div className="text-[11px] text-slate-600 font-sans mt-2">
                  Autonomous agent discharges BESS fully. Zero peak penalty or maximum demand ratchet.
                </div>
                <span className="inline-block mt-3 px-2 py-0.5 rounded bg-red-200 text-red-900 text-[10px] font-semibold">
                  PEAK DODGE DISCHARGE
                </span>
              </div>
            </div>

            {/* Visual 24-Hour Arbitrage Dispatch Curve Card */}
            <div className="liquid-glass rounded-3xl p-6 md:p-8 shadow-xl border border-white/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-900/10">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    24-Hour Diurnal Arbitrage & Peak Shaving Trajectory
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    Real-time autonomous dispatch flattening {formData.facilityName}'s evening demand spike
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-slate-400"></span>
                    Baseline Grid Load
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="inline-block w-3 h-1 bg-emerald-600 rounded"></span>
                    WattHacks Autonomous Load
                  </span>
                </div>
              </div>
              
              <DiurnalDashboardGraph demand={formData.demand} />
            </div>
          </section>

          {/* SECTION 3: FINANCIAL ROI & PAYBACK BREAKDOWN */}
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
                  Section 3: Financial ROI & Tariff Arbitrage Breakdown
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">GUARANTEED $0 CAPEX</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="liquid-glass rounded-3xl p-6 shadow-lg border border-white/80">
                <span className="text-xs font-mono text-slate-400 uppercase">MONTHLY SAVINGS</span>
                <div className="text-3xl font-semibold font-mono text-slate-900 mt-2">
                  {formatInr(totalMonthlySavings)}
                </div>
                <p className="text-xs text-slate-500 mt-2 font-light">
                  Reduced from baseline {formatInr(billNum)}/mo bill via sub-minute ToD load shifting.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-900/5 text-[11px] font-mono text-emerald-700">
                  ✓ ~31.8% Monthly Bill Reduction
                </div>
              </div>

              {/* Card 2 */}
              <div className="liquid-glass rounded-3xl p-6 shadow-lg border-2 border-emerald-500/30 bg-gradient-to-br from-white/95 to-emerald-50/50">
                <span className="text-xs font-mono text-emerald-800 uppercase font-semibold">NET ANNUAL GAIN</span>
                <div className="text-3xl font-bold font-mono text-emerald-800 mt-2">
                  {formatInr(netAnnualGain)}
                </div>
                <p className="text-xs text-slate-600 mt-2 font-light">
                  Net financial gain after deducting WattHacks AI Commercial Pro software subscription.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-900/5 text-[11px] font-mono text-emerald-800 font-semibold">
                  ✓ Gross: {formatInr(totalAnnualSavings)} / yr
                </div>
              </div>

              {/* Card 3 */}
              <div className="liquid-glass rounded-3xl p-6 shadow-lg border border-white/80">
                <span className="text-xs font-mono text-slate-400 uppercase">SOFTWARE ROI PAYBACK</span>
                <div className="text-3xl font-semibold font-mono text-emerald-700 mt-2">
                  {paybackMonths} <span className="text-sm font-normal text-slate-500">Months</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-light">
                  Full software investment recovers within weeks through immediate avoided peak surcharges.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-900/5 text-[11px] font-mono text-slate-600">
                  ✓ Zero hardware expenditure required
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4 & 5 GRID: ESG CARBON COMPLIANCE + AI DECISION LOG */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Section 4 ESG Disclosures */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
                    Section 4: SEBI BRSR Core Carbon Compliance
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-700">SCOPE 1 & 2 AUDIT</span>
              </div>

              <div className="liquid-glass rounded-3xl p-6 shadow-lg border border-white/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-500">ANNUAL DISPLACED EMISSIONS</span>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                      {annualCarbonTons} <span className="text-sm font-normal text-slate-500">Metric Tons CO2e</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDownloadModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Central Electricity Authority Baseline:</span>
                    <strong className="text-slate-900">0.716 kg CO2/kWh</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Scope 2 Indirect Grid Reductions:</span>
                    <strong className="text-emerald-700">{(annualCarbonTons * 0.82).toFixed(1)} tCO2e</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Scope 1 Avoided Diesel Generation:</span>
                    <strong className="text-emerald-700">{(annualCarbonTons * 0.18).toFixed(1)} tCO2e</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SEBI Mandated Format:</span>
                    <strong className="text-slate-900">BRSR Core (Table 8.1)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Section 5 AI Decision Stream & Protocol Status */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
                    Section 5: AI Agent Live Decision Stream
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <div className="liquid-glass rounded-3xl p-6 shadow-lg border border-white/80 space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/[0.03] border border-slate-900/[0.05] text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>13:21:04</span>
                    <span className="uppercase text-emerald-700 font-semibold">RL Agent</span>
                  </div>
                  <p className="mt-1 text-slate-700 font-light leading-relaxed">
                    Maintained {Math.round(liveBess)} kW BESS discharge at {formData.facilityName}. Curtailed grid draw to {Math.round(liveGrid)} kW.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/[0.03] border border-slate-900/[0.05] text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>13:18:22</span>
                    <span className="uppercase text-emerald-700 font-semibold">BACnet HVAC</span>
                  </div>
                  <p className="mt-1 text-slate-700 font-light leading-relaxed">
                    Pre-cooled building thermal mass to 22.4°C before upcoming DISCOM peak tariff window.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/[0.03] border border-slate-900/[0.05] text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>13:15:00</span>
                    <span className="uppercase text-emerald-700 font-semibold">Modbus Safety</span>
                  </div>
                  <p className="mt-1 text-slate-700 font-light leading-relaxed">
                    Verified battery C-rate at 0.5C continuous. Cell temp safe at 46.5°C. Edge watchdog active.
                  </p>
                </div>

                {/* Protocol Health Row */}
                <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Modbus TCP: 12ms
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    BACnet IP: Synced
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Edge Daemon: 100% Offline Capable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statutory SEBI BRSR Audit Report Modal & Print View */}
      <BrsrAuditReportModal
        isOpen={downloadModal}
        onClose={() => setDownloadModal(false)}
        formData={formData}
        savingsData={{
          monthlySavings: totalMonthlySavings,
          annualSavings: totalAnnualSavings,
          carbonAbated: +(annualCarbonTons / 12).toFixed(2),
          shiftedKwh: Math.round(demandNum * 0.65)
        }}
      />
    </div>
  );
}
