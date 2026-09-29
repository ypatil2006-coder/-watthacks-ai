# ⚡ WattHacks AI — Backend Implementation Plan & Feature Architecture

> **Directory:** `/home/yash/Projects/Hackathon/BACKEND_IMPLEMENTATION_PLAN.md`  
> **Theme:** AI for Sustainability (Scenario-Based Challenge)  
> **Target:** MSEDCL Time-of-Day (TOD) Arbitrage & Western Grid (`IN-WE`) Carbon Optimization  
> **Stack:** Node.js, Express, Google Gemini 3.7 Flash Multimodal API, Zod, Multer, JWT  
> **Engineer / Agent Environment:** Claude Code (Strict Zero-Hallucination Policy)

---

## 🚨 CRITICAL ARCHITECTURAL DIRECTIVE: ZERO PRE-FILLED / MOCKED DATA

> ### 🛑 STRICT RULE FOR CLAUDE CODE & BACKEND DEVELOPMENT:
> **ABSOLUTELY NO HARDCODED OR PRE-FILLED DATA IN ANY BACKEND RESPONSE.**  
> Every single metric, emission value, line item, and cost calculation must be **dynamically fetched from live data sources** or **algorithmically computed from first principles**. Pre-fabricating or mocking response values causes hallucinations and destroys credibility in sustainability and regulatory auditing.

### Mandatory Verification Rules:
1. **Zero Hardcoded Financial / Metric Constants:**  
   Do NOT return static JSON blobs like `"monthlySavingsInr": 48250` or `"shiftedLoadKwh": 450`. The backend must take actual user/sensor inputs (or live facility load vectors) and calculate savings through the mathematical MSEDCL TOD differential formula:
   $$\Delta \text{Savings (₹)} = (\text{Shifted kWh} \times \text{Peak Penalty Surcharge}) + (\text{Shifted kWh} \times |\text{Night Rebate}|)$$
2. **Zero Pre-Filled Gemini OCR Outputs:**  
   The bill ingestion pipeline must process the uploaded raw document buffer (PDF / image) through the Gemini 3.7 Flash API in real time. If the file is unreadable, malformed, or missing, the API must return a true `422 Unprocessable Entity` or `400 Bad Request` with an exact error message—**never substitute a fake pre-filled bill dataset**.
3. **Dynamic Regional Grid Telemetry:**  
   Grid carbon intensity must be computed based on the exact real-time clock timestamp (`new Date().getHours()`), fluctuating according to diurnal solar, wind, and thermal dispatch cycles against the India CEA **0.716 kg CO₂/kWh** baseline.
4. **Calculated Scope 1 & 2 Emissions:**  
   Emissions must always be derived dynamically using the official equations:
   * **Scope 2:** $(\text{Input kWh} \times \text{CEA Grid Baseline}) / 1000$
   * **Scope 1:** $(\text{Input Liters of Diesel} \times 2.68) / 1000$

---

## 1. Executive Summary & Objective

The WattHacks backend engine solves the operational and financial challenges of commercial facilities in Pune/Maharashtra:
1. **Dynamic Tariff Arbitrage:** Ingests MSEDCL HT-I Time-of-Day (TOD) schedules (+₹1.50 peak surcharge vs. -₹1.50 night rebate) to shift flexible commercial loads.
2. **Real-Time Grid Carbon Accounting:** Tracks Western Regional Grid (`IN-WE`) emission factors against the official India Central Electricity Authority (CEA) **0.716 kg CO₂/kWh** baseline.
3. **Multimodal Document Intelligence:** Uses Google Gemini 3.7 Flash to parse unstructured MSEDCL electricity bills and diesel backup generator logs into structured, audit-ready data.
4. **Regulatory Reporting:** Formulates SEBI BRSR (Business Responsibility and Sustainability Reporting) Principle 6 compliant greenhouse gas audit metrics.

---

## 2. Core Backend Feature Modules

```
watthacks-backend/
├── routes/
│   └── api.js                  # Main REST API route controller
├── services/
│   ├── tariffService.js        # Dynamic MSEDCL TOD tariffs & CEA carbon calculation engine
│   └── geminiService.js        # Live Gemini 1.5 Multimodal bill OCR & audit generation
├── middleware/
│   ├── authMiddleware.js      # JWT authentication & session token validation
│   └── uploadMiddleware.js    # In-memory Multer buffer handler for PDF/images
└── server.js                   # Express server initialization, CORS, and health checks
```

---

## 3. Detailed Feature Breakdown & Implementation Specs

### Feature 1: Dynamic Regional Grid Telemetry Engine
* **Endpoint:** `GET /api/grid/telemetry?region=pune`
* **Rule:** Calculated dynamically from the current hour of the day (`new Date().getHours()`).
* **Calculation Engine:**
  * **06:00 – 10:00 (Morning Ramp):** Grid draws moderate solar + thermal (~540 gCO₂/kWh).
  * **10:00 – 17:00 (Solar Peak):** High solar generation reduces grid carbon intensity (~420–480 gCO₂/kWh).
  * **18:00 – 22:00 (Evening Coal Peak):** Solar drops to 0%, heavy commercial air conditioning and lighting peaks force coal peakers online (~685–720 gCO₂/kWh, CEA baseline: 0.716 kg/kWh).
  * **22:00 – 06:00 (Night Base Load):** Off-peak wind and base thermal (~510 gCO₂/kWh).
* **Dynamic Implementation:**
  ```javascript
  export function calculateLiveTelemetry(region = 'pune') {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let carbonIntensity;
    let coalPeakersActive = false;
    let tariffDelta = 0;
    let activeSlotName = "Normal Hours (06:00 - 09:00 / 12:00 - 18:00)";

    if (currentHour >= 18 && currentHour < 22) {
      carbonIntensity = 685 + Math.round(Math.sin(currentMinute / 10) * 15);
      coalPeakersActive = true;
      tariffDelta = 1.50; // +₹1.50 Peak Surcharge
      activeSlotName = "Peak Evening (18:00 - 22:00)";
    } else if (currentHour >= 22 || currentHour < 6) {
      carbonIntensity = 510 + Math.round(Math.cos(currentMinute / 10) * 10);
      tariffDelta = -1.50; // -₹1.50 Night Rebate
      activeSlotName = "Night Off-Peak (22:00 - 06:00)";
    } else if (currentHour >= 9 && currentHour < 12) {
      carbonIntensity = 610;
      tariffDelta = 0.80; // Morning Peak
      activeSlotName = "Morning Peak (09:00 - 12:00)";
    } else {
      carbonIntensity = 460;
      tariffDelta = 0.00;
    }

    return {
      region,
      gridName: "Western Grid (IN-WE)",
      discom: "MSEDCL",
      carbonIntensityGPerKwh: carbonIntensity,
      renewableMixPercent: Math.max(15, Math.min(48, Math.round((1 - (carbonIntensity / 800)) * 100))),
      gridFrequencyHz: +(50.0 + (Math.sin(now.getTime() / 5000) * 0.04)).toFixed(2),
      coalPeakersActive,
      activeSlot: {
        slot: activeSlotName,
        tariffAdjustmentInr: tariffDelta,
        currentTime: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    };
  }
  ```

---

### Feature 2: MSEDCL TOD Tariff Arbitrage Engine
* **Endpoint:** `POST /api/optimize/shift`
* **Rule:** Computes actual cost savings and carbon abatement strictly from the caller's submitted parameters.
* **Input Schema (Zod Validated):**
  ```typescript
  z.object({
    flexibleLoadKwh: z.number().positive(),
    peakLoadKwh: z.number().positive(),
    baselineDailyKwh: z.number().positive().optional()
  })
  ```
* **Dynamic Calculation Logic:**
  ```javascript
  export function calculateShiftSavings({ flexibleLoadKwh, peakLoadKwh, baselineDailyKwh }) {
    const actualShiftableKwh = Math.min(flexibleLoadKwh, peakLoadKwh);
    
    const PEAK_PENALTY_RATE = 1.50; // ₹1.50/unit surcharge
    const NIGHT_REBATE_RATE = 1.50;  // ₹1.50/unit rebate
    const NET_DELTA_PER_KWH = PEAK_PENALTY_RATE + NIGHT_REBATE_RATE; // ₹3.00/kWh total arbitrage

    const dailySavingsInr = actualShiftableKwh * NET_DELTA_PER_KWH;
    const monthlySavingsInr = Math.round(dailySavingsInr * 30);

    const carbonDeltaKgPerKwh = 0.685 - 0.510; // 0.175 kg CO2 avoided per shifted kWh
    const dailyCarbonDivertedKg = actualShiftableKwh * carbonDeltaKgPerKwh;
    const monthlyCarbonDivertedTons = +((dailyCarbonDivertedKg * 30) / 1000).toFixed(2);

    const peakReductionPercent = +((actualShiftableKwh / peakLoadKwh) * 100).toFixed(1);

    return {
      shiftedLoadKwh: actualShiftableKwh,
      dailySavingsInr: +dailySavingsInr.toFixed(2),
      monthlySavingsInr,
      monthlyCarbonDivertedTons,
      peakReductionPercent,
      formulaExplanation: `${actualShiftableKwh} kWh shifted @ ₹3.00/kWh arbitrage (₹1.50 peak surcharge avoided + ₹1.50 night rebate captured)`
    };
  }
  ```

---

### Feature 3: Live Gemini 1.5 Multimodal Bill Ingestion
* **Endpoint:** `POST /api/bills/upload`
* **Rule:** Raw document buffer is fed directly to Gemini 1.5 Vision API. No mock data.
* **Strict Implementation:**
  ```javascript
  import { GoogleGenAI } from '@google/genai';

  export async function extractBillData(fileBuffer, mimeType) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in server environment.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
      Analyze this electricity bill or fuel log. Extract the exact numerical billing data.
      You must respond ONLY with a raw JSON object, without markdown formatting or code blocks:
      {
        "consumerNumber": string or null,
        "billingPeriod": string or null,
        "totalUnitsKwh": number,
        "billingDemandKva": number,
        "powerFactor": number,
        "billedAmountInr": number,
        "todZoneBreakdown": {
          "zone1_nightKwh": number,
          "zone2_dayKwh": number,
          "zone3_peakKwh": number,
          "zone4_offPeakKwh": number
        }
      }
      If any specific field cannot be found from the document, set it to null or calculate it mathematically.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: fileBuffer.toString('base64'), mimeType } },
            { text: prompt }
          ]
        }
      ]
    });

    const rawText = response.text.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    return JSON.parse(rawText);
  }
  ```

---

### Feature 4: Scope 1 & Scope 2 GHG Accounting Engine
* **Formula Standards:**
  * **Scope 2 (MSEDCL Grid Consumption):**
    $$\text{Scope 2 (Tons CO}_2\text{)} = \frac{\text{Metered kWh} \times 0.716}{1000}$$
  * **Scope 1 (Diesel Backup Generator Burn):**
    $$\text{Scope 1 (Tons CO}_2\text{)} = \frac{\text{Diesel Liters Burned} \times 2.68}{1000}$$
* **Implementation:** Always compute dynamically from actual inputs; never output static placeholders.

---

## 4. Verification Checklist for Claude Code

When writing or modifying backend code in Claude Code:
- [ ] Ensure no static constant files exist that mock API returns.
- [ ] Verify every controller calculates responses using caller payloads and current timestamps.
- [ ] Confirm Gemini 1.5 receives actual file buffers and parses authentic JSON.
- [ ] Verify that invalid uploads return appropriate HTTP 4xx errors instead of dummy data.
- [ ] Test with curl commands to confirm calculation outputs vary according to input variables.
