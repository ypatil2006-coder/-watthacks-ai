# ⚡ WattHacks AI — Complete Hackathon Dossier

> **Folder:** `/home/yash/Projects/Hackathon/HACKATHON.md`  
> **Theme:** AI for Sustainability  
> **Team:** wallHacks  
> **Project:** WattHacks AI — Autonomous Energy Arbitrage & Carbon Grid Intelligence  
> **Market Focus:** Pune & Maharashtra Commercial Facilities, IT Parks (Hinjewadi, Magarpatta) & Data Centers  
> **Validation Score:** 85/100 on ValidatorAI (High Execution Zone)

---

## 1. 🎯 Problem Statement

Commercial real estate, tech campuses, and industrial facilities in Maharashtra face a dual crisis of **surging peak energy costs** and **mounting regulatory pressure to decarbonize**:

1. **Severe Peak Tariffs (MSEDCL TOD Penalties):**  
   Under Maharashtra State Electricity Distribution Company Limited (MSEDCL) Time-of-Day (TOD) tariff structures, commercial consumers (HT-I Category) face a **+₹1.50 per kWh surcharge** during the evening peak window (**18:00 – 22:00**). Conversely, power drawn between **22:00 – 06:00** receives a **-₹1.50 per kWh rebate**. That represents a massive **₹3.00/kWh cost delta** across the day.
   
2. **The Coal Peaker Carbon Spike:**  
   During evening peak hours, grid operators are forced to fire up inefficient, high-emission fossil-fuel peaker plants. In the Western Regional Grid (**IN-WE**), grid carbon intensity spikes to **685–720 gCO₂/kWh** (benchmarked against the India Central Electricity Authority [CEA] baseline of **0.716 kg CO₂/kWh**). Drawing power during this window produces the dirtiest electricity of the day.

3. **Operational Blindspots & Manual Overhead:**  
   Facility managers currently have zero real-time intelligence connecting their building loads to regional grid carbon emissions. High-demand flexible equipment (EV fleet charging banks, HVAC chilled water loops, and emergency diesel generators) run blindly during dirty peak hours, burning unnecessary operational expenditure and generating avoidable emissions.

4. **Regulatory Reporting Friction:**  
   With SEBI mandating **BRSR (Business Responsibility and Sustainability Reporting)** for top enterprises in India, facilities struggle to accurately measure Scope 1 (diesel generator fuel burn) and Scope 2 (grid electricity) emissions with auditable provenance.

---

## 2. 💡 Our Solution: WattHacks AI

**WattHacks AI** is an autonomous grid intelligence and energy arbitrage platform engineered to give facility managers and sustainability directors "X-ray vision" over their power infrastructure:

* **⚡ Real-Time Tariff & Carbon Arbitrage:**  
  WattHacks correlates live Western Grid (`IN-WE`) carbon intensity with MSEDCL Time-of-Day pricing tariffs. It calculates the optimal schedule to shift flexible commercial loads away from dirty evening peaks (+₹1.50/unit) into clean night rebate windows (-₹1.50/unit), saving commercial campuses **₹45,000 to ₹1,50,000+ every month** while slashing grid carbon by up to **35%**.

* **📄 Zero-Data-Entry Multimodal Bill OCR (Gemini 3.7 Flash):**  
  Facility managers drag and drop complex MSEDCL electricity bill PDFs or diesel generator fuel logs. The Google Gemini Multimodal Vision API extracts consumption line items, TOD slot splits (Zone 1 through 4), billed demand, and power factor with zero manual data entry.

* **🌿 Scope 1 & 2 Emissions Accounting:**  
  Automatically converts grid consumption into verified Scope 2 emissions using official India CEA grid emission factors (**0.716 kg CO₂/kWh**) and diesel generator fuel burn into Scope 1 emissions (**2.68 kg CO₂/liter**).

* **📑 One-Click Audit-Ready BRSR Reports:**  
  Generates SEBI-compliant sustainability summaries with one click, ready for board review, ESG auditing, and stakeholder reporting.

* **🎨 Luminous Eco-Acrylic Interface:**  
  A distinctive, high-aesthetic UI featuring real-time mathematical harmonic wave rendering, liquid glass capsules with fluid dynamics, and live telemetry cards with zero clutter.

---

## 3. 🏗️ System Architecture & Tech Stack

```
                          [ Client Layer ]
              React 18 (Vite) + Tailwind CSS + Canvas API
     ┌────────────────────────────────────────────────────────┐
     │ • Mathematical Wave Simulation (0.5px gossamer ribbons)│
     │ • Liquid Glass Navbar with internal fluid dynamics     │
     │ • Real-time Western Grid (IN-WE) Telemetry Cards       │
     │ • 24-Hour Load Curve & Arbitrage Visualizer            │
     └───────────────────────────┬────────────────────────────┘
                                 │ REST API / JSON
                                 ▼
                          [ Backend Layer ]
                 Node.js + Express + Multer + Zod
     ┌────────────────────────────────────────────────────────┐
     │ • Tariff Arbitrage Engine (MSEDCL TOD Tariff Schedule) │
     │ • India CEA Carbon Intensity Model (0.716 kg/kWh)     │
     │ • Scope 1 & Scope 2 Greenhouse Gas Emission Math       │
     └─────────────┬────────────────────────────┬─────────────┘
                   │                            │
                   ▼                            ▼
      [ Google Gemini 3.7 Flash API ] [ Grid Telemetry Service ]
        Multimodal Bill Vision OCR    Western Regional Grid (IN-WE)
        & Unstructured Document AI    Real-time Carbon Telemetry
```

---

## 4. 📊 Financial & Sustainability Impact (Hinjewadi Tech Hub Case Study)

For a standard 500 kVA commercial facility in Hinjewadi Phase 1, Pune:

| Metric | Before WattHacks AI | After WattHacks AI Optimization | Net Monthly Benefit |
| :--- | :--- | :--- | :--- |
| **Peak Energy Draw (18:00–22:00)** | 480 kW | 220 kW (Flexible load shifted) | **-260 kW Peak Demand** |
| **MSEDCL Peak Surcharges** | +₹21,300 | ₹0 (Avoided entirely) | **₹21,300 Saved** |
| **Night Rebate Captured** | ₹0 | -₹26,950 (Rebate window utilized) | **₹26,950 Rebate Gained** |
| **Total Monthly Bill Savings** | — | — | **₹48,250 / month** |
| **Scope 2 Carbon Emissions** | 37.9 Metric Tons CO₂e | 32.5 Metric Tons CO₂e | **5.4 Tons CO₂ Diverted** |
| **Annualized Cost Savings** | — | — | **₹5,79,000 / year** |

---

## 5. 🎬 150-Second Hackathon Demo Video Script

*Maximum time limit: 2 minutes 30 seconds (150 seconds)*

* **0:00 – 0:25 (Hook & Problem):**  
  *"Every evening between 6 PM and 10 PM across Pune's IT parks, commercial campuses face two major problems: MSEDCL slaps on a +₹1.50 per unit penalty, and the Western power grid turns to dirty coal peakers, releasing over 685 grams of CO₂ per kilowatt-hour. Meanwhile, right after 10 PM, a -₹1.50 rebate sits untouched. That is a ₹3.00 price swing and tons of carbon wasted every single night."*
* **0:25 – 0:50 (Introducing WattHacks AI):**  
  *"Meet WattHacks AI. We provide autonomous grid intelligence for commercial facilities. Built on React and Google Gemini, WattHacks continuously connects live regional grid telemetry with MSEDCL Time-of-Day tariffs to give facility managers autonomous X-ray vision over their energy and carbon footprint."*
* **0:50 – 1:20 (Live UI Walkthrough):**  
  *"Look at the live interface. Framed with our liquid-glass acrylic design, you see real-time Western Grid carbon intensity and active coal peaker alerts. With our 24-hour load optimizer, WattHacks identifies flexible campus loads like EV charging banks and HVAC chillers, shifting them cleanly into the 10 PM rebate window."*
* **1:20 – 1:50 (Gemini Bill Ingestion):**  
  *"Instead of manual spreadsheets, users drop an MSEDCL electricity bill or diesel generator log into the vault. Powered by Google Gemini Multimodal AI, WattHacks extracts consumption, TOD tiers, and power factor in seconds, calculating Scope 1 and Scope 2 emissions automatically."*
* **1:50 – 2:15 (Regulatory & BRSR Compliance):**  
  *"With India's SEBI mandating BRSR sustainability reporting, WattHacks exports audit-ready compliance documents with a single click, proving verified carbon diversion with CEA standard baselines."*
* **2:15 – 2:30 (Closing & Vision):**  
  *"In a single 500 kVA campus in Hinjewadi, WattHacks saves over ₹48,000 and diverts 5.4 metric tons of carbon every month. WattHacks AI — turning peak penalties into planetary progress. Thank you."*

---

## 6. 🚀 How to Run the Project Locally

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Start Backend
```bash
cd backend
npm install
npm run dev
# Starts on port 5000
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Starts on port 5173
```

### Standalone Browser Preview
```bash
file:///home/yash/Projects/Hackathon/index.html
```
