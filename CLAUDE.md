# CLAUDE CODE PROJECT INSTRUCTIONS: WATTHACKS AI BACKEND

> **DIRECTORY:** `/home/yash/Projects/Hackathon/`  
> **RULE:** STRICTLY NO PRE-FILLED / HARDCODED DATA (ANTI-HALLUCINATION)

---

## 🛑 MANDATORY DIRECTIVES FOR CLAUDE CODE

When implementing backend features:

1. **NO STATIC MOCKS:**
   - Every metric, savings calculation, and carbon figure must be computed mathematically from dynamic inputs.
   - Do not return hardcoded values like `"monthlySavingsInr": 48250`. Compute:
     $$\text{Shifted kWh} \times (\text{Peak Penalty ₹1.50} + \text{Night Rebate ₹1.50}) \times 30$$

2. **DYNAMIC GRID TELEMETRY:**
   - Derive Western Grid (`IN-WE`) telemetry dynamically using `new Date().getHours()` to determine peaker status (active during 18:00–22:00) and emissions against the India CEA 0.716 kg/kWh baseline.

3. **AUTHENTIC GEMINI OCR BUFFER PROCESSING:**
   - Process uploaded file buffers in real-time through the Google Gemini 1.5 API.
   - Never return pre-fabricated bill JSON when an upload occurs.
   - Throw real HTTP 4xx error codes if document parsing fails.

4. **REFERENCE IMPLEMENTATION PLAN:**
   - Refer directly to [`BACKEND_IMPLEMENTATION_PLAN.md`](file:///home/yash/Projects/Hackathon/BACKEND_IMPLEMENTATION_PLAN.md) for complete mathematical formulas and Zod schemas.
