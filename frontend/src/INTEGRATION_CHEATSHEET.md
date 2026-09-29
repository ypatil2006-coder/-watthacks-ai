# 🔌 WattHacks AI — Frontend Integration Cheat Sheet

This guide shows your coworker (or anyone working on `frontend/src/components/ProductDashboard.jsx`) how to connect the existing UI components to the live backend with **zero hassle**.

---

## 🚀 Quick Setup (Already Configured)
- **Vite Proxy**: Already configured in `frontend/vite.config.js`. Every call to `/api/...` proxies to `http://localhost:5000`.
- **API Client Service**: Pre-built in [`frontend/src/services/api.js`](file:///home/yash/Projects/Hackathon/frontend/src/services/api.js).
- **React Hook**: Pre-built in [`frontend/src/hooks/useWattHacksApi.js`](file:///home/yash/Projects/Hackathon/frontend/src/hooks/useWattHacksApi.js).
- **Sample Test Bills**: Available in [`test-assets/sample_msedcl_bill.svg`](file:///home/yash/Projects/Hackathon/test-assets/sample_msedcl_bill.svg) and [`test-assets/sample_msedcl_ht_bill.html`](file:///home/yash/Projects/Hackathon/test-assets/sample_msedcl_ht_bill.html).

---

## 📦 Option A: Plug-and-Play React Hook (Recommended)

In `ProductDashboard.jsx`:

```jsx
import { useWattHacksLive } from '../hooks/useWattHacksApi';

export default function ProductDashboard({ onBack }) {
  // Existing state...
  
  // ⚡ Plug in live backend reactive engine:
  const {
    telemetry,        // Live frequency, solar radiation (W/m²), ambient temp, grid carbon
    diurnalCurve,     // 24-hour hourly curve for chart
    equipment,        // Synthesized BEE-standard assets (HVAC, EV, BESS, DG)
    brsrReport,       // Live Gemini SEBI audit report & work orders
    auditLoading,     // Spinner state for Gemini BRSR generation
    triggerBrsrAudit, // Function to trigger live report
    handleUploadBill  // Function to scan bills via Gemini Vision
  } = useWattHacksLive({
    region: 'Pune',
    contractDemandKva: formData.demand,
    facilityName: formData.facilityName
  });
```

---

## 🎯 Direct 1-to-1 Mapping to Dashboard Sections

### 1. Section 1: Live Real-Time Power Telemetry
Replace the random `setInterval` with real telemetry values:
```jsx
// Real frequency from WRLDC grid:
telemetry?.gridFrequencyHz  // e.g. 50.02 Hz

// Real grid carbon intensity:
telemetry?.carbonIntensityGco2PerKwh  // e.g. 443 gCO2/kWh

// Real solar radiation from Open-Meteo satellite:
telemetry?.weather?.solarRadiationWattsM2  // e.g. 751 W/m²

// Current active tariff rate:
telemetry?.activeTariffRate  // e.g. ₹11.80/kWh
```

### 2. Section 2: 24-Hour DISCOM Tariff & Dispatch Schedule
Use `diurnalCurve` array in your Recharts or hourly cards:
```jsx
diurnalCurve.map(hour => ({
  time: `${hour.hour}:00`,
  tariff: hour.totalTariffInr,
  carbon: hour.carbonIntensityGco2PerKwh,
  zone: hour.zoneName,
  isPeakerActive: hour.isPeakerActive
}))
```

### 3. Section 3: Financial ROI & Tariff Arbitrage
To calculate savings mathematically on any form input:
```jsx
import { optimizeLoadShift } from '../services/api';

const result = await optimizeLoadShift({
  peakLoadKw: formData.demand * 0.7,
  flexibleSharePercent: 35,
  contractDemandKva: formData.demand
});

// Returns:
// result.arbitrageDifferentialInrPerKwh (₹3.00/kWh)
// result.projectedMonthlySavingsInr (e.g. ₹23,400)
// result.co2AvoidedTonsPerMonth (e.g. 1.36 Tons)
```

### 4. Section 4 & Modal: Gemini SEBI BRSR Audit Report
In the `downloadModal` when user clicks **"BRSR Report"** or **"Download Certified PDF"**:
```jsx
const handleGenerateReport = async () => {
  const report = await triggerBrsrAudit({
    monthlySavings: totalMonthlySavings,
    carbonAbated: annualCarbonTons,
    batterySoc: batterySoc
  });

  // report contains:
  // report.executiveSummary (Gemini synthesized)
  // report.statutoryDisclosures (Scope 1, Scope 2, CEA baseline)
  // report.workOrders (3 actionable engineering directives)
};
```

### 5. Bill Scanning / 1-Click Demo Ingestion (Intake Form)
Add an upload button in the intake form:
```jsx
<input 
  type="file" 
  accept="image/*,application/pdf"
  onChange={async (e) => {
    const file = e.target.files[0];
    const data = await handleUploadBill(file);
    // Automatically fills the form with extracted bill values!
    setFormData(prev => ({
      ...prev,
      facilityName: data.consumerName,
      monthlyBill: data.billedAmountInr,
      demand: data.sanctionedLoadKva
    }));
  }} 
/>

{/* Or 1-Click Instant Demo: */}
<button onClick={async () => {
  const data = await handleUploadBill(null, true); // demo=true
  setFormData(prev => ({
    ...prev,
    facilityName: data.consumerName,
    monthlyBill: data.billedAmountInr,
    demand: data.sanctionedLoadKva
  }));
}}>
  ⚡ Try Demo MSEDCL Bill
</button>
```

---

## 🛠️ Summary of All Working Endpoints
| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Live Grid Telemetry | `/api/telemetry/live?region=Pune` | GET | ✅ Live (Open-Meteo + Clock) |
| 24-Hour Diurnal Curve | `/api/telemetry/diurnal-curve` | GET | ✅ Live (5 MSEDCL Zones) |
| Tariff Arbitrage Shift | `/api/optimize/shift` | POST | ✅ Live (₹3.00/kWh swing) |
| Scope 1 & 2 Emissions | `/api/emissions/calculate` | POST | ✅ Live (CEA 0.716 kg/kWh) |
| Multimodal OCR Ingestion | `/api/bills/upload` | POST | ✅ Live (Gemini 3.8 Flash) |
| SEBI BRSR Audit Generator | `/api/audit/generate` | POST | ✅ Live (Gemini 3.8 Flash) |
| Dynamic Equipment Scale | `/api/facility/equipment` | GET | ✅ Live (BEE / ASHRAE 90.1) |
| Dynamic Equipment Synthesis | `/api/facility/equipment/synthesize` | POST | ✅ Live |
