/**
 * WattHacks AI - Automated Backend Service Verification Test Suite
 * Tests all mathematical models, tariff engines, and service modules without external network dependencies.
 */

import {
  calculateLiveTelemetry,
  calculate24HourDiurnalCurve,
  calculateShiftSavings,
  calculateEmissions,
  REGIONAL_PROFILES
} from './services/tariffService.js';
import {
  listEquipment,
  calculateCampusFlexCapacity,
  addEquipment
} from './services/equipmentService.js';
import {
  extractBillData,
  generateExecutiveAudit,
  isGeminiConfigured
} from './services/geminiService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n⚡ Running WattHacks AI Backend Verification Test Suite...\n');

// 1. Regional Grid Telemetry Engine
console.log('--- 1. Testing Dynamic Grid Telemetry Engine ---');
const telemetry = calculateLiveTelemetry('pune');
assert(telemetry.region === 'Pune & Pimpri-Chinchwad', 'Returns correct Pune region profile');
assert(telemetry.discom.includes('MSEDCL'), 'Identifies MSEDCL as regional discom');
assert(telemetry.carbonIntensityGco2 > 400 && telemetry.carbonIntensityGco2 < 800, `Carbon intensity in realistic diurnal range (${telemetry.carbonIntensityGco2} gCO2/kWh)`);
assert(telemetry.gridFrequencyHz >= 49.8 && telemetry.gridFrequencyHz <= 50.2, `Grid frequency within Indian standard 50Hz band (${telemetry.gridFrequencyHz} Hz)`);
assert(typeof telemetry.activeSlot.tariffAdjustmentInr === 'number', 'Calculates active tariff differential');

const blrTelemetry = calculateLiveTelemetry('bengaluru');
assert(blrTelemetry.discom === 'BESCOM', 'Identifies BESCOM for Bengaluru');
assert(blrTelemetry.gridZone === 'Southern Grid (IN-SO)', 'Uses Southern Grid for Bengaluru');

const delhiTelemetry = calculateLiveTelemetry('delhi');
assert(delhiTelemetry.gridZone === 'Northern Grid (IN-NO)', 'Uses Northern Grid for Delhi');

// 2. 24-Hour Diurnal Profile Curve
console.log('\n--- 2. Testing 24-Hour Diurnal Curve Simulation ---');
const curveData = calculate24HourDiurnalCurve('pune');
assert(curveData.curve.length === 24, 'Generates full 24-hour hourly curve');
const eveningPeakHour = curveData.curve.find(c => c.hour === 19);
assert(eveningPeakHour.peakersOnline === true, 'Evening 19:00 has coal peakers active');
assert(eveningPeakHour.tariffAdjustmentInr === 1.50, 'Evening 19:00 has +₹1.50 peak surcharge');
const nightRebateHour = curveData.curve.find(c => c.hour === 23);
assert(nightRebateHour.tariffAdjustmentInr === -1.50, 'Night 23:00 has -₹1.50 rebate incentive');

// 3. MSEDCL Tariff Arbitrage & Load Shift Engine
console.log('\n--- 3. Testing MSEDCL Tariff Arbitrage Engine ---');
const shiftResult = calculateShiftSavings({
  flexibleLoadKwh: 260,
  peakLoadKwh: 480,
  baselineDailyKwh: 1200,
  region: 'pune'
});
assert(shiftResult.shiftedLoadKwh === 260, 'Calculates shifted load correctly (260 kWh)');
assert(shiftResult.arbitrageRatePerKwhInr === 3.00, 'Arbitrage differential is ₹3.00/kWh (+₹1.50 peak avoided + -₹1.50 rebate captured)');
assert(shiftResult.financialBreakdown.dailySavingsInr === 780, 'Daily savings = 260 * ₹3.00 = ₹780');
assert(shiftResult.financialBreakdown.monthlySavingsInr === 23400, 'Monthly savings = ₹780 * 30 = ₹23,400');
assert(shiftResult.carbonBreakdown.monthlyCarbonDivertedTons > 0, `Monthly carbon diverted is positive (${shiftResult.carbonBreakdown.monthlyCarbonDivertedTons} Tons)`);
assert(shiftResult.recommendedSchedule.evFleetCharging.zone.includes('Zone E'), 'EV fleet recommended in Zone E (Night Rebate)');
assert(shiftResult.recommendedSchedule.hvacThermalPrecooling.zone.includes('Zone C'), 'HVAC pre-cooling recommended in Zone C (Afternoon Solar)');

// 4. Scope 1 & Scope 2 GHG Accounting Engine
console.log('\n--- 4. Testing Scope 1 & 2 GHG Accounting Engine ---');
const emissions = calculateEmissions({
  gridKwh: 48500,
  dieselLiters: 1200,
  region: 'pune',
  facilityAreaSqFt: 50000,
  headcount: 350
});
assert(emissions.emissions.scope2Grid.emissionsTons === 34.726, 'Scope 2 calculated with CEA Western Grid 0.716 kg/kWh (34.726 Tons)');
assert(emissions.emissions.scope1Diesel.emissionsTons === 3.216, 'Scope 1 calculated with Diesel 2.68 kg/L (3.216 Tons)');
assert(emissions.intensityMetrics.kgCo2PerSqFt !== null, 'Normalized square foot intensity calculated');
assert(emissions.intensityMetrics.tonsCo2PerEmployee !== null, 'Normalized employee intensity calculated');

// 5. Equipment Inventory & Flexible Capacity Service
console.log('\n--- 5. Testing Equipment Inventory Service ---');
const initialEquipment = listEquipment();
assert(initialEquipment.length >= 5, `Initial equipment inventory loaded (${initialEquipment.length} assets)`);
const capacity = calculateCampusFlexCapacity();
assert(capacity.totalConnectedLoadKw > 0, `Total connected load: ${capacity.totalConnectedLoadKw} kW`);
assert(capacity.totalFlexibleLoadKw > 0, `Total flexible load: ${capacity.totalFlexibleLoadKw} kW`);
assert(capacity.nightShiftableToRebateKw > 0, `Night shiftable capacity: ${capacity.nightShiftableToRebateKw} kW`);

// 6. Gemini Multimodal Bill OCR & Fallback Demo
console.log('\n--- 6. Testing Gemini Service & Fallback Demo ---');
const geminiStatus = isGeminiConfigured();
console.log(`  ℹ️ Gemini API Status: ${geminiStatus ? 'Key Configured' : 'No Key (Demo Mode Active)'}`);
const billData = await extractBillData(null, null, true);
assert(billData.consumerNumber === '012548963210', 'Extracted consumer number matches benchmark');
assert(billData.totalUnitsKwh === 48500, 'Extracted units match benchmark (48,500 kWh)');
assert(billData.todBreakdown.zoneD_eveningPeakKwh === 14200, 'Extracted Zone D peak units match benchmark (14,200 kWh)');
assert(billData.emissions.emissions.totalGrossEmissions.emissionsTons > 0, 'Auto-calculated emissions on extracted bill');

// 7. Executive BRSR Audit Generation
console.log('\n--- 7. Testing SEBI BRSR Audit Generation ---');
const audit = await generateExecutiveAudit(
  { name: 'Hinjewadi Tech Hub', discom: 'MSEDCL', region: 'Pune', loadKva: 500 },
  { monthlySavingsInr: 48250, monthlyCarbonAvoidedTons: 5.4, shiftedLoadKwh: 260 }
);
assert(audit.workOrders.length === 3, 'Generates 3 technical electrical work orders');
assert(audit.auditCertificateBadge.includes('SEBI BRSR'), 'Includes SEBI BRSR compliance certificate badge');

console.log('\n====================================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
if (failed === 0) {
  console.log('🎉 ALL BACKEND FEATURES ARE FULLY OPERATIONAL!');
} else {
  console.error('⚠️ Some tests failed. Please review errors above.');
  process.exit(1);
}
console.log('====================================================\n');
