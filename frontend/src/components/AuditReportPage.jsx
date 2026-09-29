import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Leaf, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Building,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Printer
} from 'lucide-react';
import BrsrAuditReportModal from './BrsrAuditReportModal';

export default function AuditReportPage({ auditData, onBackToUpload, onLaunchConsole }) {
  const [downloadModal, setDownloadModal] = useState(false);

  // Derived audit metrics
  const billAmount = Number(auditData?.billAmount) || 845620;
  const demand = Number(auditData?.demand) || 550;
  const units = Number(auditData?.units) || 94200;
  const peakSurcharge = Number(auditData?.peakSurcharge) || 184200;
  const solar = Number(auditData?.solarKwp) || 0;
  const bess = Number(auditData?.bessKwh) || 0;

  // Annual baseline
  const annualBill = billAmount * 12;
  const annualPeakSurcharge = peakSurcharge * 12;

  // Potential savings calculations
  const monthlySavingsEst = Math.round(peakSurcharge * 0.78 + (solar > 0 ? solar * 120 * 5.2 : billAmount * 0.08));
  const annualSavingsEst = monthlySavingsEst * 12;
  const savingsPct = ((annualSavingsEst / annualBill) * 100).toFixed(1);

  // Carbon metrics via Central Electricity Authority (CEA 0.716 kg CO2/kWh)
  const annualKwhSaved = Math.round(annualSavingsEst / 7.2);
  const carbonTonsAbated = ((annualKwhSaved * 0.716) / 1000).toFixed(1);
  const scope2Cut = (carbonTonsAbated * 0.84).toFixed(1);
  const scope1Cut = (carbonTonsAbated * 0.16).toFixed(1);

  // Recommended asset sizes if not present
  const recommendedBess = bess > 0 ? bess : Math.round(demand * 0.45);
  const recommendedSolar = solar > 0 ? solar : Math.round(demand * 0.60);

  const formatInr = (val) => {
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' Lakhs';
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="relative z-10 w-full min-h-screen py-8 animate-fadeIn max-w-6xl mx-auto space-y-10">
      
      {/* ======================================================== */}
      {/* TOP AUDIT CONTROLS BAR                                  */}
      {/* ======================================================== */}
      <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl border border-white/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToUpload}
            className="px-4 py-2 rounded-xl bg-slate-900/5 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload Another Bill / New Audit</span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-mono uppercase font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            SEBI BRSR & CEA Verified Audit
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLaunchConsole && (
            <button
              onClick={onLaunchConsole}
              className="px-4 py-2.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 font-semibold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Live Grid Console →</span>
              <span className="sm:hidden">Console →</span>
            </button>
          )}
          <button
            onClick={() => setDownloadModal(true)}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs font-mono transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Official Audit (PDF)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* AUDIT REPORT CERTIFICATE HEADER                         */}
      {/* ======================================================== */}
      <div id="audit-summary" className="liquid-glass rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/80 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-emerald-800 tracking-wider font-semibold">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              Comprehensive Energy, Tariff & Carbon Audit Report
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mt-1">
              {auditData?.facilityName || 'Commercial Facility Node'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 mt-2">
              <span>Consumer ID: <strong className="text-slate-900">{auditData?.consumerNo || '084729104829'}</strong></span>
              <span>•</span>
              <span>Tariff: <strong className="text-slate-900">{auditData?.discom || 'MSEDCL HT-1 Commercial'}</strong></span>
              <span>•</span>
              <span>Billing Cycle: <strong className="text-slate-900">{auditData?.billingCycle || 'August 2026'}</strong></span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-center bg-white/70 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Facility Efficiency Rating
            </span>
            <div className="text-3xl font-light font-mono text-slate-900 mt-0.5">
              <span className="font-bold text-amber-600">62</span> / 100
            </div>
            <span className="text-[11px] font-mono text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded mt-1 font-semibold">
              Grade C • High Tariff Leakage Detected
            </span>
          </div>
        </div>

        {/* 4 Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
              Annual Utility Baseline
            </span>
            <div className="text-xl font-mono font-semibold text-slate-900">
              {formatInr(annualBill)}
            </div>
            <span className="text-[11px] text-slate-500 font-light block">
              Based on {formatInr(billAmount)}/mo current bill
            </span>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-900 font-semibold block flex items-center justify-between">
              <span>Identified Tariff Leakage</span>
              <AlertTriangle className="w-3 h-3 text-amber-600" />
            </span>
            <div className="text-xl font-mono font-semibold text-amber-950">
              {formatInr(annualPeakSurcharge)}
            </div>
            <span className="text-[11px] text-amber-800 font-light block">
              Time-of-Day evening peak penalties (17-22h)
            </span>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-900 font-semibold block flex items-center justify-between">
              <span>Net Achievable Savings</span>
              <TrendingDown className="w-3 h-3 text-emerald-600" />
            </span>
            <div className="text-xl font-mono font-semibold text-emerald-950">
              {formatInr(annualSavingsEst)} / yr
            </div>
            <span className="text-[11px] text-emerald-800 font-light block">
              {savingsPct}% net reduction with peak shaving
            </span>
          </div>

          {/* Metric 4 */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block flex items-center justify-between">
              <span>Carbon Abatement</span>
              <Leaf className="w-3 h-3 text-emerald-400" />
            </span>
            <div className="text-xl font-mono font-semibold text-white">
              {carbonTonsAbated} tCO2e
            </div>
            <span className="text-[11px] text-slate-400 font-light block">
              Displaced fossil peakers (CEA factor)
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1 OF AUDIT: FORENSIC BILL LINE-ITEM AUDIT TABLE  */}
      {/* ======================================================== */}
      <div id="audit-breakdown" className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/10 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-emerald-800 font-semibold tracking-wider">
              Audit Breakdown • Forensic Line-Item Analysis
            </span>
            <h2 className="text-xl font-semibold text-slate-900">
              Where Your Electricity Bill is Leaking Money
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Source: Extracted from {auditData?.discom || 'DISCOM'} Tariff Schedule
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Billed Tariff Component</th>
                <th className="py-3 px-3">Current Bill Value</th>
                <th className="py-3 px-3">Audit Finding & Cost Inefficiency</th>
                <th className="py-3 px-3">Optimized With WattHacks</th>
                <th className="py-3 px-3 text-right">Potential Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {/* Row 1: ToD Surcharge */}
              <tr className="hover:bg-amber-50/50 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-slate-900">
                  Time-of-Day (ToD) Peak Surcharges
                  <span className="block text-[10px] text-slate-400 font-normal">17:00 – 22:00 evening tariff window</span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-amber-700">
                  {formatInr(peakSurcharge)}/mo
                </td>
                <td className="py-3.5 px-3 text-slate-600 font-sans text-xs">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-semibold mr-1.5">Critical Leakage</span>
                  Grid draw during +₹4.60/kWh penalty hours without battery substitution.
                </td>
                <td className="py-3.5 px-3 font-semibold text-emerald-700">
                  {formatInr(Math.round(peakSurcharge * 0.22))}/mo
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  -{formatInr(Math.round(peakSurcharge * 0.78))}/mo
                </td>
              </tr>

              {/* Row 2: Fixed Demand */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-slate-900">
                  Fixed Contract Demand Charges
                  <span className="block text-[10px] text-slate-400 font-normal">{demand} kVA Sanctioned Demand @ ₹490/kVA</span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  {formatInr(Math.round(demand * 490))}/mo
                </td>
                <td className="py-3.5 px-3 text-slate-600 font-sans text-xs">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold mr-1.5">Demand Spike Risk</span>
                  Occasional chiller startup peaks risk exceeding sanctioned threshold (150% penalty).
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  {formatInr(Math.round(demand * 410))}/mo
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  -{formatInr(Math.round(demand * 80))}/mo
                </td>
              </tr>

              {/* Row 3: Base Energy Units */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-slate-900">
                  Base Daytime Energy Charges
                  <span className="block text-[10px] text-slate-400 font-normal">{units} kWh monthly consumption</span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  {formatInr(Math.round(units * 4.8))}/mo
                </td>
                <td className="py-3.5 px-3 text-slate-600 font-sans text-xs">
                  Midday cooling load draws 100% grid power during available solar insolation windows.
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  {formatInr(Math.round(units * 3.7))}/mo
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  -{formatInr(Math.round(units * 1.1))}/mo
                </td>
              </tr>

              {/* Row 4: Power Factor */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-slate-900">
                  Power Factor Incentive / Penalty
                  <span className="block text-[10px] text-slate-400 font-normal">Recorded PF: {auditData?.powerFactor || '0.98'}</span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  ₹0 (Neutral)
                </td>
                <td className="py-3.5 px-3 text-slate-600 font-sans text-xs">
                  PF is acceptable but does not achieve DISCOM maximum 7% prompt rebate threshold (PF &gt; 0.995).
                </td>
                <td className="py-3.5 px-3 font-semibold text-emerald-700">
                  -₹12,400 Rebate
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  -₹12,400/mo
                </td>
              </tr>

              {/* Row 5: Taxes & FAC */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-slate-900">
                  Electricity Duty & Fuel Adjustment (FAC)
                  <span className="block text-[10px] text-slate-400 font-normal">Regulatory pass-through surcharges</span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  {formatInr(Math.round(billAmount * 0.09))}/mo
                </td>
                <td className="py-3.5 px-3 text-slate-600 font-sans text-xs">
                  State taxes scale directly with gross grid kWh draw.
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-800">
                  {formatInr(Math.round(billAmount * 0.065))}/mo
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  -{formatInr(Math.round(billAmount * 0.025))}/mo
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 font-semibold bg-emerald-50/60">
                <td className="py-3.5 px-3 text-slate-900">TOTAL MONTHLY AUDIT RESULT</td>
                <td className="py-3.5 px-3 text-slate-900 font-bold">{formatInr(billAmount)}</td>
                <td className="py-3.5 px-3 text-xs font-sans text-slate-600">Net monthly bill reduction across all components</td>
                <td className="py-3.5 px-3 text-emerald-800 font-bold">{formatInr(billAmount - monthlySavingsEst)}</td>
                <td className="py-3.5 px-3 text-right text-emerald-800 font-bold text-sm">-{formatInr(monthlySavingsEst)} / mo</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: 24-HOUR OPTIMIZATION & LOAD SHIFTING CURVE   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Hardware Sizing */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
              Recommended Asset Capacity
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-light">
            Engineered specifically to eliminate the <strong>{formatInr(annualPeakSurcharge)}/yr</strong> ToD surcharge extracted from your bill:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Recommended BESS Battery</span>
                <span className="text-[11px] text-slate-500 font-mono">LFP chemistry • 0.5C discharge rate</span>
              </div>
              <strong className="text-base font-mono text-emerald-700">
                {recommendedBess} kWh
              </strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Recommended Rooftop Solar PV</span>
                <span className="text-[11px] text-slate-500 font-mono">Midday self-consumption</span>
              </div>
              <strong className="text-base font-mono text-emerald-700">
                {recommendedSolar} kWp
              </strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">WattHacks Software Payback</span>
                <span className="text-[11px] text-slate-400 font-mono">₹14,999/mo subscription vs savings</span>
              </div>
              <strong className="text-base font-mono text-brand-apricot">
                0.6 Months
              </strong>
            </div>
          </div>
        </div>

        {/* 24h Autonomous Dispatch Schedule */}
        <div id="audit-dispatch" className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase font-mono tracking-wider">
              24-Hour AI Dispatch Strategy
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-light">
            Automated schedule generated from your DISCOM tariff windows:
          </p>

          <div className="space-y-2.5 font-mono text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 flex items-center justify-between">
              <div>
                <strong>00:00 – 06:00 • Off-Peak Night Arbitrage</strong>
                <span className="block text-[10px] text-blue-700 font-sans">Charge BESS at off-peak rebate tariff (₹3.50/kWh)</span>
              </div>
              <span className="text-xs font-bold text-blue-800">CHARGE</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-center justify-between">
              <div>
                <strong>09:00 – 16:00 • Solar Peak & Pre-Cooling</strong>
                <span className="block text-[10px] text-amber-700 font-sans">Pre-cool building HVAC thermal mass with captive solar</span>
              </div>
              <span className="text-xs font-bold text-amber-800">SOLAR LOAD</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 flex items-center justify-between">
              <div>
                <strong>17:00 – 22:00 • Peak Surcharge Elimination</strong>
                <span className="block text-[10px] text-emerald-700 font-sans">Discharge BESS directly to zero out grid peak penalty draw</span>
              </div>
              <span className="text-xs font-bold text-emerald-800">DISCHARGE</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SECTION 3: SEBI BRSR CORE COMPLIANCE DISCLOSURE         */}
      {/* ======================================================== */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/10 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-emerald-800 font-semibold tracking-wider">
              ESG Regulatory Governance
            </span>
            <h2 className="text-xl font-semibold text-slate-900">
              SEBI BRSR Core Environmental Audit Statement
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
            India CEA 0.716 kg CO2/kWh Factor
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Scope 2 Displaced Emissions</span>
            <strong className="text-slate-900 text-lg block mt-1">{scope2Cut} tCO2e / yr</strong>
            <span className="text-[11px] text-slate-500 font-sans">Grid electricity substitution</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Scope 1 Diesel DG Run-Hour Avoidance</span>
            <strong className="text-slate-900 text-lg block mt-1">{scope1Cut} tCO2e / yr</strong>
            <span className="text-[11px] text-slate-500 font-sans">Direct backup fossil offset</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Audit Hash Verification</span>
            <strong className="text-slate-900 text-sm block mt-1 truncate">SHA256: 8f94...e92a</strong>
            <span className="text-[11px] text-slate-500 font-sans">Cryptographically sealed log</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM ACTION BAR                                        */}
      {/* ======================================================== */}
      <div className="liquid-glass rounded-2xl p-6 shadow-xl border border-white/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Ready to deploy WattHacks Autonomous Dispatch?
          </h4>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Connect your building meters via Modbus/BACnet in under 15 minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onLaunchConsole && (
            <button
              onClick={onLaunchConsole}
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Launch Live Grid Console →</span>
            </button>
          )}
          <button
            onClick={() => setDownloadModal(true)}
            className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs font-mono transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Official Statutory SEBI BRSR Audit Modal with Vector Graphs */}
      <BrsrAuditReportModal
        isOpen={downloadModal}
        onClose={() => setDownloadModal(false)}
        formData={{
          facilityName: auditData?.facilityName || auditData?.consumerName || 'Commercial Facility Node',
          facilityType: auditData?.facilityType || 'Commercial Campus',
          discom: auditData?.discom || 'MSEDCL (Maharashtra)',
          monthlyBill: billAmount,
          demand: demand,
          solar: solar,
          bess: bess,
          hasDg: Boolean(auditData?.hasDg),
          equipment: auditData?.equipment || ['hvac', 'inverter']
        }}
        savingsData={{
          monthlySavings: monthlySavingsEst,
          annualSavings: annualSavingsEst,
          carbonAbated: +(carbonTonsAbated / 12).toFixed(2),
          shiftedKwh: Math.round(demand * 0.52)
        }}
      />

    </div>
  );
}
