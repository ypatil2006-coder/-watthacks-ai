import React, { useState, useEffect, forwardRef } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, Building, Zap, Sliders, Battery, Sun, FileCheck } from 'lucide-react';

const ExtractedInfoForm = forwardRef(({ extractedData, onSubmitAudit }, ref) => {
  const [formData, setFormData] = useState({
    // Extracted fields
    facilityName: '',
    consumerNo: '',
    discom: '',
    billingCycle: '',
    billAmount: '',
    demand: '',
    units: '',
    peakSurcharge: '',
    powerFactor: '',

    // Blank / User-provided fields (NOT in bill)
    solarKwp: '',
    bessKwh: '',
    floorArea: '',
    hasHvac: true,
    hasInverter: true,
    hasEv: false,
    hasDg: false
  });

  const [hasScraped, setHasScraped] = useState(false);

  // Sync when extractedData changes
  useEffect(() => {
    if (!extractedData) return;
    setFormData(prev => ({
      ...prev,
      facilityName: extractedData.location || extractedData.name || '',
      consumerNo: extractedData.consumerNo || '',
      discom: extractedData.discom || '',
      billingCycle: extractedData.billingCycle || 'August 2026',
      billAmount: extractedData.billAmount || '',
      demand: extractedData.demand || '',
      units: extractedData.units || '',
      peakSurcharge: extractedData.peakSurcharge || '',
      powerFactor: extractedData.powerFactor || '0.98',
      
      // Keep manual fields blank as requested:
      solarKwp: prev.solarKwp || '',
      bessKwh: prev.bessKwh || '',
      floorArea: prev.floorArea || ''
    }));
    setHasScraped(true);
  }, [extractedData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitAudit) {
      onSubmitAudit(formData);
    }
  };

  const formatInr = (val) => {
    const num = Number(val);
    if (!num) return '₹0';
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(2) + ' Lakhs';
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <section ref={ref} id="facility-info-section" className="max-w-4xl mx-auto pt-6 scroll-mt-24">
      <form onSubmit={handleSubmit} className="liquid-glass rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/80 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-emerald-800 font-semibold tracking-wider">
                Step 2 • Scraped Data Review & Facility Calibration
              </span>
              {hasScraped && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-mono font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Auto-Scraped
                </span>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mt-1">
              Verify Extracted Information
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Review fields scraped from your bill. Fill in any hardware assets not present in the utility statement.
            </p>
          </div>

          <div className="text-right sm:text-right font-mono text-xs text-slate-500">
            <span>Bill Value: </span>
            <strong className="text-slate-900 text-sm block sm:inline">
              {formatInr(formData.billAmount)}
            </strong>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BLOCK A: AUTO-EXTRACTED FROM THE BILL                    */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
              A. Extracted From Electricity Bill
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded ml-auto">
              Auto-filled via OCR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Facility Name */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Facility / Consumer Name
              </label>
              <input
                type="text"
                required
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                placeholder="e.g. Pune Tech Park Campus"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Consumer No */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Consumer / Account No.
              </label>
              <input
                type="text"
                value={formData.consumerNo}
                onChange={(e) => setFormData({ ...formData, consumerNo: e.target.value })}
                placeholder="e.g. 084729104829"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* DISCOM */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                DISCOM / Tariff Regime
              </label>
              <input
                type="text"
                required
                value={formData.discom}
                onChange={(e) => setFormData({ ...formData, discom: e.target.value })}
                placeholder="e.g. MSEDCL HT-1 Commercial"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Monthly Bill Amount */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Monthly Bill Amount (₹)
              </label>
              <input
                type="number"
                required
                value={formData.billAmount}
                onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                placeholder="e.g. 845620"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            {/* Sanctioned Demand */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Sanctioned Demand (kW)
              </label>
              <input
                type="number"
                required
                value={formData.demand}
                onChange={(e) => setFormData({ ...formData, demand: e.target.value })}
                placeholder="e.g. 550"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Units Consumed */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Monthly Billed Units (kWh)
              </label>
              <input
                type="number"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                placeholder="e.g. 94200"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Peak ToD Surcharge */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Peak ToD Surcharge Paid (₹)
              </label>
              <input
                type="number"
                value={formData.peakSurcharge}
                onChange={(e) => setFormData({ ...formData, peakSurcharge: e.target.value })}
                placeholder="e.g. 184200"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-emerald-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            {/* Power Factor */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Billed Power Factor
              </label>
              <input
                type="text"
                value={formData.powerFactor}
                onChange={(e) => setFormData({ ...formData, powerFactor: e.target.value })}
                placeholder="e.g. 0.98"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                Billing Cycle
              </label>
              <input
                type="text"
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                placeholder="e.g. August 2026"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50/40 border border-emerald-300/60 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BLOCK B: UNRETRIEVABLE FIELDS (LEFT BLANK FOR USER)      */}
        {/* ======================================================== */}
        <div className="space-y-4 pt-4 border-t border-slate-900/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
                B. On-Site Assets & Calibration (Fill In Manually)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded">
              Not listed on utility bills • Leave 0 or blank if none
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Solar PV (Blank) */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1 flex items-center justify-between">
                <span>Rooftop Solar PV (kWp)</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={formData.solarKwp}
                  onChange={(e) => setFormData({ ...formData, solarKwp: e.target.value })}
                  placeholder="e.g. 250 (leave blank if 0)"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* BESS Battery (Blank) */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1 flex items-center justify-between">
                <span>Battery BESS Storage (kWh)</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="number"
                min="0"
                step="20"
                value={formData.bessKwh}
                onChange={(e) => setFormData({ ...formData, bessKwh: e.target.value })}
                placeholder="e.g. 150 (leave blank if 0)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Built-up Floor Area (Blank) */}
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1 flex items-center justify-between">
                <span>Facility Area (sq. ft.)</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={formData.floorArea}
                onChange={(e) => setFormData({ ...formData, floorArea: e.target.value })}
                placeholder="e.g. 150,000 sq ft"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Subsystems Toggles */}
          <div className="pt-2">
            <span className="block text-[11px] font-mono text-slate-500 uppercase mb-2">
              Connected Building Subsystems
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                formData.hasHvac ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.hasHvac}
                  onChange={(e) => setFormData({ ...formData, hasHvac: e.target.checked })}
                  className="accent-emerald-600 w-3.5 h-3.5"
                />
                <span className="truncate">Central HVAC Chiller</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                formData.hasInverter ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.hasInverter}
                  onChange={(e) => setFormData({ ...formData, hasInverter: e.target.checked })}
                  className="accent-emerald-600 w-3.5 h-3.5"
                />
                <span className="truncate">Modbus Inverters</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                formData.hasEv ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.hasEv}
                  onChange={(e) => setFormData({ ...formData, hasEv: e.target.checked })}
                  className="accent-emerald-600 w-3.5 h-3.5"
                />
                <span className="truncate">EV Fleet Chargers</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                formData.hasDg ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold' : 'bg-white/60 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.hasDg}
                  onChange={(e) => setFormData({ ...formData, hasDg: e.target.checked })}
                  className="accent-emerald-600 w-3.5 h-3.5"
                />
                <span className="truncate">Backup Diesel DG</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Button: Navigate directly to the Audit Page */}
        <div className="pt-6 border-t border-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-mono">
            <span>Detected ToD Peak Exposure: </span>
            <strong className="text-slate-900 font-semibold">
              {formatInr(Number(formData.peakSurcharge) * 12)} / year
            </strong>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Generate Full Energy & Tariff Audit Report</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

      </form>
    </section>
  );
});

export default ExtractedInfoForm;
