/**
 * WattHacks AI — Frontend API Client Service
 * Connects React UI components to the Express + Gemini + CEA backend engine.
 * Vite automatically proxies all '/api' requests to http://localhost:5000
 */
import axios from 'axios';

const rawBase = import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE_URL || '/api';
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 0. RESOLVE LOCATION FROM GPS / BROWSER GEOLOCATION
 * Maps device latitude and longitude to the nearest Indian Regional Grid, DISCOM,
 * and CEA emission factor.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export async function resolveLocationFromGps(lat, lon) {
  const response = await client.get(`/grid/resolve-location`, {
    params: { lat, lon }
  });
  return response.data;
}

/**
 * 1. LIVE GRID TELEMETRY
 * Fetches real-time frequency, carbon intensity (gCO2/kWh), active TOD tariff,
 * and live solar radiation / ambient temperature from Open-Meteo.
 * @param {string|Object} regionOrCoords - 'Pune' or { lat, lon }
 */
export async function getLiveTelemetry(regionOrCoords = 'Pune') {
  const params = typeof regionOrCoords === 'object' && regionOrCoords.lat
    ? { lat: regionOrCoords.lat, lon: regionOrCoords.lon }
    : { region: regionOrCoords };

  const response = await client.get(`/telemetry/live`, { params });
  return response.data;
}

/**
 * 2. 24-HOUR DIURNAL CURVE
 * Fetches the complete 24-hour diurnal grid carbon curve, hourly tariff rates (Zones A-E),
 * and dynamic peaker fuel mix.
 * @param {string} region - 'Pune', 'Mumbai', 'Bengaluru', 'Delhi'
 */
export async function get24HourCurve(region = 'Pune') {
  const response = await client.get(`/telemetry/diurnal-curve`, {
    params: { region }
  });
  return response.data;
}

/**
 * 3. MSEDCL TOD TARIFF ARBITRAGE OPTIMIZER
 * Calculates exact INR financial savings and carbon diverted when shifting
 * flexible loads from Zone D peak (18:00-22:00, +₹1.50) to Zone E rebate (22:00-06:00, -₹1.50).
 * @param {Object} params
 * @param {number} params.peakLoadKw - Facility evening peak load in kW
 * @param {number} params.flexibleSharePercent - Flexible share percentage (e.g. 35)
 * @param {number} [params.contractDemandKva] - Optional sanctioned contract demand in kVA
 */
export async function optimizeLoadShift({ peakLoadKw = 400, flexibleSharePercent = 35, contractDemandKva = 500 }) {
  const response = await client.post(`/optimize/shift`, {
    peakLoadKw,
    flexibleSharePercent,
    contractDemandKva
  });
  return response.data;
}

/**
 * 4. SCOPE 1 & 2 GHG ACCOUNTING
 * Calculates certified GHG emissions using statutory India Central Electricity Authority (CEA)
 * baseline (0.716 kg CO2/kWh) and GHG Protocol Stationary Diesel Combustion (2.68 kg CO2/L).
 * @param {Object} params
 * @param {number} params.gridKwh - Total grid electricity imported in kWh
 * @param {number} [params.dieselLiters] - Diesel fuel consumed by backup generators in Liters
 * @param {number} [params.facilityAreaSqFt] - Facility gross square footage
 * @param {number} [params.headcount] - Total facility headcount
 */
export async function calculateEmissions({ gridKwh, dieselLiters = 0, facilityAreaSqFt = null, headcount = null }) {
  const response = await client.post(`/emissions/calculate`, {
    gridKwh,
    dieselLiters,
    facilityAreaSqFt,
    headcount
  });
  return response.data;
}

/**
 * 5. MULTIMODAL GEMINI BILL INGESTION & OCR
 * Uploads an electricity bill (PDF, PNG, JPG) or triggers instant benchmark extraction.
 * @param {File|Blob|null} file - Electricity bill file object
 * @param {boolean} [useDemo=false] - If true or file is null, uses verified benchmark demo mode
 */
export async function uploadBill(file = null, useDemo = false) {
  if (!file || useDemo) {
    const response = await client.post(`/bills/upload?demo=true`);
    return response.data;
  }

  const formData = new FormData();
  formData.append('bill', file);

  const response = await client.post(`/bills/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

/**
 * 6. SEBI BRSR PRINCIPLE 6 AUDIT REPORT & WORK ORDERS
 * Calls Gemini 3.8 Flash to synthesize statutory SEBI BRSR Core disclosures,
 * physical avoided emissions, and actionable autonomous engineering work orders.
 * @param {Object} payload
 * @param {string} payload.facilityName - Name of the commercial facility
 * @param {number} payload.monthlySavingsInr - Projected or realized monthly arbitrage in INR
 * @param {number} payload.carbonAbatedTons - Displaced carbon emissions in Metric Tons
 * @param {number} payload.batterySoc - Current Battery Storage (BESS) State of Charge %
 * @param {Array} [payload.equipmentList] - Active equipment breakdown
 */
export async function generateBrsrAudit(params = {}) {
  const payload = {
    facility: {
      name: params.facilityName || params.facility?.name || 'Commercial Facility',
      facilityType: params.facilityType || params.facility?.facilityType || 'Commercial Campus',
      discom: params.discom || params.facility?.discom || 'MSEDCL (Maharashtra)',
      region: params.region || params.facility?.region || 'Maharashtra',
      loadKva: Number(params.demand || params.contractDemandKva || params.facility?.loadKva || 500),
      monthlyBill: Number(params.monthlyBill || params.billAmount || params.facility?.monthlyBill || 850000),
      solarKwp: Number(params.solar || params.solarKwp || params.facility?.solarKwp || 0),
      bessKwh: Number(params.bess || params.bessKwh || params.facility?.bessKwh || 0),
      hasDg: Boolean(params.hasDg || params.facility?.hasDg),
      equipment: params.equipment || params.facility?.equipment || ['hvac', 'inverter']
    },
    savings: {
      monthlySavingsInr: params.monthlySavingsInr || params.savingsData?.monthlySavings || 23400,
      annualSavingsInr: params.annualSavingsInr || params.savingsData?.annualSavings || (params.monthlySavingsInr || 23400) * 12,
      monthlyCarbonAvoidedTons: params.carbonAbatedTons || params.savingsData?.carbonAbated || 1.36,
      shiftedLoadKwh: params.shiftedKwh || params.savingsData?.shiftedKwh || 260
    },
    // Top-level fallbacks for flexible endpoint parsing
    facilityName: params.facilityName || 'Commercial Facility',
    discom: params.discom || 'MSEDCL (Maharashtra)',
    demand: Number(params.demand || 500),
    monthlyBill: Number(params.monthlyBill || 850000),
    solar: Number(params.solar || 0),
    bess: Number(params.bess || 0),
    equipment: params.equipment || ['hvac', 'inverter'],
    monthlySavingsInr: params.monthlySavingsInr || 23400,
    annualSavingsInr: params.annualSavingsInr || (params.monthlySavingsInr || 23400) * 12,
    carbonAbatedTons: params.carbonAbatedTons || 1.36,
    batterySoc: params.batterySoc || (params.bess > 0 ? 80 : 0)
  };

  const response = await client.post(`/audit/generate`, payload);
  return response.data;
}

/**
 * 7. FACILITY EQUIPMENT INVENTORY & LOAD BREAKDOWN
 * Retrieves equipment loads scaled dynamically to the facility's contract demand (kVA).
 * @param {number} contractLoadKva - Facility sanctioned contract demand in kVA
 */
export async function getFacilityEquipment(contractLoadKva = 500) {
  const response = await client.get(`/facility/equipment`, {
    params: { contractLoadKva }
  });
  return response.data;
}

/**
 * 8. DYNAMIC EQUIPMENT SYNTHESIS (BEE / ASHRAE 90.1)
 * Generates custom facility sub-loads (HVAC, EV, Compute, BESS, DG) derived from contract kVA.
 * @param {number} contractLoadKva - Facility contract load
 * @param {string} facilityName - Facility name
 */
export async function synthesizeEquipment(contractLoadKva = 500, facilityName = 'Commercial Facility') {
  const response = await client.post(`/facility/equipment/synthesize`, {
    contractLoadKva,
    facilityName
  });
  return response.data;
}

/**
 * 9. BACKEND & GEMINI SYSTEM HEALTH
 * Verifies backend connectivity, model availability, and active engines.
 */
export async function checkSystemHealth() {
  const [healthRes, geminiRes] = await Promise.all([
    client.get('/health'),
    client.get('/gemini/status')
  ]);
  return {
    server: healthRes.data,
    gemini: geminiRes.data
  };
}

export default {
  getLiveTelemetry,
  get24HourCurve,
  optimizeLoadShift,
  calculateEmissions,
  uploadBill,
  generateBrsrAudit,
  getFacilityEquipment,
  synthesizeEquipment,
  checkSystemHealth
};
