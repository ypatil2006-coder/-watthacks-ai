# ⚡ WattHacks AI — Autonomous Energy Arbitrage & Carbon Grid Intelligence

> **Theme:** AI for Sustainability · **Track:** Scenario-Based Sustainability Challenge  
> **Team:** wallHacks · **Regional Target:** Pan-India Commercial Hubs (Pune, Bengaluru, Delhi-NCR, Mumbai)  
> **Tariff Benchmark:** MSEDCL, BESCOM & Tata Power Commercial TOD Schedules  
> **Carbon Standard:** Govt. of India Central Electricity Authority (CEA) Baseline (0.716 kg CO₂/kWh) & SEBI BRSR Principle 6  

[![Deployment Status](https://img.shields.io/badge/Vercel-Live%20Production-10B981?logo=vercel&style=flat-square)](https://watthacks-ai.vercel.app)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-Google%20Drive-EA4335?logo=googledrive&logoColor=white&style=flat-square)](https://drive.google.com/file/d/1d2yOctTP2mUPG7X5MoXjiM4ztfRkg0kk/view?usp=drive_link)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20Cloud-47A248?logo=mongodb&style=flat-square)](https://www.mongodb.com/atlas)
[![AI Engine](https://img.shields.io/badge/AI%20Core-Google%20Gemini%20Multimodal-4285F4?logo=google&style=flat-square)](https://aistudio.google.com)
[![Frontend Stack](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind%20CSS-06B6D4?style=flat-square)](https://vitejs.dev)
[![Backend Stack](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Zod-339933?style=flat-square)](https://nodejs.org)
[![Compliance](https://img.shields.io/badge/ESG%20Compliance-SEBI%20BRSR%20Principle%206-10B981?style=flat-square)](https://www.sebi.gov.in)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

---

## 🏆 Official Hackathon Submission Dossier

| Submission Field | Official Details |
| :--- | :--- |
| **Project Title** | **WattHacks AI** — Autonomous Commercial Energy Arbitrage & Grid Carbon Intelligence |
| **Official Demo Video (150s)** | [**Watch Full Walkthrough on Google Drive**](https://drive.google.com/file/d/1d2yOctTP2mUPG7X5MoXjiM4ztfRkg0kk/view?usp=drive_link) |
| **Live Deployed Application** | [https://watthacks-ai.vercel.app](https://watthacks-ai.vercel.app) |
| **Public GitHub Repository** | [https://github.com/ypatil2006-coder/-watthacks-ai](https://github.com/ypatil2006-coder/-watthacks-ai) |
| **Challenge Track** | **Scenario-Based Sustainability Challenge** (AI for Sustainability, Resource Optimization, and Decarbonization) |
| **AI Foundation Model** | **Google Gemini Multimodal Vision API (`gemini-2.5-flash` / `gemini-3.7-flash`)** via `@google/genai` |
| **Database Tier** | **Official MongoDB Atlas Cloud Cluster** (`cluster0.ihw0jms.mongodb.net`, Database: `watthacks`) |
| **Target Audience** | Commercial Campuses, IT & Tech Parks, Hospitals, Data Centers & Light Industrial Facilities |
| **Governing Standards** | **Govt of India CEA Standard Baseline (0.716 kg CO₂/kWh)**, **SEBI BRSR Core Master Circular**, **ISO 14064-1 GHG Protocol** |

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#-1-problem-statement)
2. [Solution Description & Core AI Integration](#-2-solution-description--ai-integration)
3. [Multi-Source Geolocation & International Safeguards](#-3-multi-source-geolocation--international-safeguards)
4. [Direct Competitor Differentiation Matrix](#-4-direct-competitor-differentiation-matrix)
5. [System Architecture & Data Flow](#-5-system-architecture--data-flow)
6. [Technology Stack](#-6-technology-stack)
7. [Core Features & Application Walkthrough](#-7-core-features--application-walkthrough)
8. [Financial & Environmental Impact Case Study](#-8-financial--environmental-impact-case-study)
9. [REST API Catalog](#-9-rest-api-catalog)
10. [Local Development & MongoDB Atlas Setup](#-10-local-development--mongodb-atlas-setup)
11. [150-Second Demo Video Script](#-11-150-second-demo-video-script)

---

## 🎯 1. Problem Statement

Commercial real estate, IT corridors (e.g., Pune Hinjewadi, Bengaluru Electronic City, Gurugram Cyber City, Mumbai BKC), hospitals, and factories face a compounding financial and regulatory crisis:

1. **Punitive Peak Time-of-Day (ToD) Surcharges:**  
   Under commercial High-Tension (HT) tariff schedules across Indian state DISCOMs (MSEDCL, BESCOM, Tata Power), power consumed during the evening peak window (**18:00 – 22:00 IST**) incurs an aggressive surcharge of **+₹1.50/kWh**. Conversely, power consumed during the night trough (**22:00 – 06:00 IST**) earns a **-₹1.50/kWh rebate**. This creates an unmanaged **₹3.00/kWh cost delta** every 24 hours.

2. **The Diurnal Coal Peaker Carbon Spike:**  
   During peak evening hours, regional grid operators dispatch marginal, inefficient thermal coal peaker plants. Grid carbon intensity spikes to **685–720 gCO₂/kWh** (compared to the statutory India Central Electricity Authority [CEA] baseline of **0.716 kg CO₂/kWh**). Drawing grid power during this window produces the dirtiest emissions of the day.

3. **High CAPEX Lock-in & Fragmented Silos:**  
   Traditional Building Management Systems (BMS) require **₹35 Lakhs to ₹1.2 Crore ($40k – $150k+)** in upfront capital expenditure, proprietary programmable logic controllers (PLCs), and 6 months of commissioning. Meanwhile, facility managers are left manually calculating Scope 1 and Scope 2 emissions on error-prone spreadsheets for mandatory **SEBI BRSR (Business Responsibility and Sustainability Reporting)** filings.

---

## 💡 2. Solution Description & AI Integration

**WattHacks AI** is an autonomous, $0 CAPEX, software-agnostic energy intelligence and tariff arbitrage platform. It converts complex utility bills, solar generation, and flexible facility equipment into an automated, carbon-minimizing powerhouse:

### 🤖 Google Gemini Multimodal AI Integration
* **Multimodal Utility Bill Vision OCR (`gemini-2.5-flash` / `gemini-3.7-flash`):**  
  Facility managers drag and drop complex MSEDCL/BESCOM/Tata Power electricity bill PDFs, meter photos, or diesel generator fuel logs. The Google Gemini Multimodal Vision API extracts consumer details, sanctioned contract demand (kVA), billed active energy units (kWh), power factor, and exact ToD slot splits in seconds with zero manual data entry.
* **Automated Executive BRSR Audit Synthesis (`gemini-2.5-flash`):**  
  Gemini analyzes facility power consumption and autonomous load-shifting data to synthesize statutory SEBI BRSR Principle 6 audit reports, engineering work orders, and Scope 1 & 2 carbon disclosures with an immutable SHA-256 cryptographic verification seal.
* **Secure Zero-Client Backend Architecture:**  
  The Google Gemini API key is strictly maintained and executed in backend environment variables (`backend/.env`), preventing token leakages.

### ⚡ Key Capabilities
* **Algorithmic Tariff & Carbon Arbitrage Engine:** Dynamically calculates load shifting for flexible facility assets (HVAC chillers, EV fleet chargers, thermal storage, and BESS batteries) out of the evening peak surcharge (+₹1.50) into the night rebate window (-₹1.50), saving facilities **₹12L–₹40L annually** with zero proprietary hardware.
* **Statutory Carbon Accounting (India CEA Calibrated):** Maps every kilowatt-hour against the official Indian Central Electricity Authority emission factor (`0.716 kg CO₂/kWh`) and diesel generator burn (`2.68 kg CO₂/L`) for audit-grade Scope 1 and Scope 2 tracking.
* **SEBI BRSR Principle 6 Automated Audit:** Generates one-click, publication-grade executive sustainability reports with an immutable SHA-256 cryptographic verification seal.
* **Live Open-Meteo Satellite Solar & Grid Telemetry:** Fetches live Direct Normal Irradiance (DNI in W/m²) and tracks the standard 50.00 Hz national grid frequency band.

---

## 📍 3. Multi-Source Geolocation & International Safeguards

WattHacks AI features an intelligent, multi-tiered location engine designed for regulatory compliance:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │          CLIENT CONNECTION & GEOLOCATION INGESTION      │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │   1. Check IP Geolocation (ipwho.is/api)  │
                         │   2. Fallback to Browser GPS Coordinates  │
                         └─────────────────────┬─────────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
        [ Coordinates Inside India ]                     [ Overseas IP / VPN Detected ]
                       │                                               │
                       ▼                                               ▼
    ┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
    │ Auto-Match Nearest Indian Grid Hub:  │        │ ⚠️ Trigger International Guardrail   │
    │ • Pune / MSEDCL (0.716 kg/kWh)       │        │ • Display Amber Warning Banner       │
    │ • Bengaluru / BESCOM (0.690 kg/kWh)  │        │ • Block Audit Generation Button      │
    │ • Delhi-NCR / Tata (0.740 kg/kWh)    │        │ • Require Indian Hub Preset Click    │
    │ • Mumbai / Adani (0.716 kg/kWh)      │        └──────────────────┬───────────────────┘
    └──────────────────┬───────────────────┘                           │
                       │                                               │ User Clicks Indian Hub
                       │                                               ▼
                       └───────────────────────────────────────► [ Unlock Full Audit ]
```

### 🛡️ International Location Safeguard & Guardrail
1. **Overseas / VPN Detection:** If a user connects from outside India (e.g., via a Singapore VPN, US node, or international IP), WattHacks detects the non-Indian coordinates.
2. **Prominent Alert Banner:** Displays an amber notification explaining that WattHacks AI is calibrated exclusively to the **Government of India Central Electricity Authority (CEA)** baseline (`0.716 kg CO₂/kWh`) and Indian state DISCOM tariffs.
3. **Execution Blocker:** Disables the audit generation button (`cursor-not-allowed`) and guards form submission until an Indian Regional Hub preset is selected.
4. **Instant Unlock:** Clicking any of the 4 Indian Regional Hubs (*Pune*, *Bengaluru*, *Delhi-NCR*, *Mumbai*) immediately clears the warning, applies local DISCOM tariffs, and enables audit report generation.

---

## ⚔️ 4. Direct Competitor Differentiation Matrix

| Evaluation Dimension | Traditional Industrial BMS <br>*(Schneider EcoStruxure, Siemens Desigo)* | Enterprise Utility BESS SaaS <br>*(Stem Inc Athena, Fluence Energy)* | Basic IoT Telemetry Dashboards <br>*(Wattwatchers, DIY Grafana)* | **WattHacks AI** <br>*(Our Platform)* |
| :--- | :--- | :--- | :--- | :--- |
| **Typical Setup Cost** | **₹35 Lakhs – ₹1.2 Crore+** heavy upfront CAPEX + ₹8L/yr AMC | **₹2.5L – ₹6.5L/mo** + mandatory $15k hardware gateway | **₹3,500 – ₹12,000/mo** monthly subscription | **$0 CAPEX** · **Software-Agnostic** |
| **Deployment Velocity** | 3 – 6 Months (Field wiring & PLC programming) | 6 – 12 Weeks (Utility interconnection) | 1 – 2 Weeks (Smart clamp installation) | **15 Minutes** (Instant bill OCR & API connect) |
| **Hardware Lock-in** | **Severe:** Proprietary controllers & bus cables | **High:** Proprietary utility gateway unit | **Medium:** Specific CT current clamps | **Zero:** 100% Software-Agnostic (BACnet / Modbus TCP / MQTT) |
| **Autonomous ToD Arbitrage** | ❌ Rule-based static schedules only | ✅ Wholesale energy capacity market trading | ❌ None (Passive alerts only) | **✅ Autonomous ToD Arbitrage** (DISCOM & regional grid aligned) |
| **Regional Grid Carbon Engine** | ❌ Not tracked | ⚠️ US / EU ISO grids only (PJM, CAISO) | ❌ Static national averages only | **✅ India CEA 0.716 kg/kWh & Western Grid Live Diurnal Model** |
| **Multimodal Utility Bill OCR** | ❌ None (Manual technician entry) | ❌ None (Enterprise EDI data only) | ❌ None (Manual entry) | **✅ Google Gemini Multimodal Vision OCR** (PDF & Image Ingestion) |
| **Statutory ESG Reporting** | ❌ None (Requires 3rd-party consultant) | ⚠️ Custom corporate exports | ❌ Raw CSV energy exports only | **✅ SEBI BRSR Principle 6 & ISO 14064 One-Click Verified Audit** |
| **Primary Economic Target** | Greenfield industrial plants & massive hospitals | 10MW+ Utility-scale battery farms | Small retail shops & single sub-meters | **Commercial Campuses, IT Parks, Hospitals & C&I Facilities** |

---

## 🏗️ 5. System Architecture & Data Flow

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │                     USER BROWSER                       │
                                    │  React 18 · Vite · Tailwind CSS · 60fps Canvas Shader  │
                                    │  Multi-Source Geolocation · Frosted Liquid Glass UI   │
                                    └───────────────────────────┬────────────────────────────┘
                                                                │
                                                                │ HTTPS / REST / JSON + JWT Bearer
                                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             WATTHACKS EXPRESS REST BACKEND                                             │
│                                                                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────────────┐  │
│  │   Multimodal Bill OCR   │  │  Tariff Arbitrage Core  │  │   Carbon & ESG Engine    │  │   Auth & Multi-Tenancy  │  │
│  │ Gemini 2.5 Flash Vision │  │ MSEDCL / BESCOM / Tata  │  │ CEA 0.716 kg/kWh Baseline│  │ JWT Bearer + bcrypt     │  │
│  │ Zod Runtime Validation  │  │  ToD Peak / Rebate Math │  │  Scope 1 (DG) & Scope 2  │  │ Mongoose Facility Models│  │
│  └─────────────────────────┘  └─────────────────────────┘  └──────────────────────────┘  └─────────────────────────┘  │
└──────────────────────────┬────────────────────────────────────────────┬────────────────────────────────────┬───────────┘
                           │                                            │                                    │
                           ▼                                            ▼                                    ▼
┌───────────────────────────────────────────────────────┐  ┌─────────────────────────────────┐  ┌────────────────────────┐
│                 GOOGLE GEMINI API                     │  │        EXTERNAL SERVICES        │  │     DATABASE LAYER     │
│  • Gemini 2.5 Flash Multimodal Vision                 │  │  • Open-Meteo Solar (W/m²)      │  │  • MongoDB Atlas Cloud │
│  • Instant Bill OCR & ToD Table Parsing               │  │  • Multi-Source Geolocation     │  │  • Cluster0 Live M0    │
│  • SEBI BRSR Executive Synthesis                      │  │  • National Grid 50 Hz Freq     │  │  • Mongoose 8.3 ODM   │
└───────────────────────────────────────────────────────┘  └─────────────────────────────────┘  └────────────────────────┘
```

---

## 🛠️ 6. Technology Stack

| Layer / Component | Technology | WattHacks AI Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, Vite 5 | **React 18** + **Vite 5** (Fast ES Modules, Responsive SPA) |
| **Styling & Design System** | Tailwind CSS 3.4 | **Tailwind CSS 3.4** + Custom Frosted Liquid Glass & Micro-Interactions |
| **HTTP & API Client** | Axios | **Axios** (With automatic JWT Bearer token request interceptor) |
| **Data Visualization** | Canvas API & SVG | **SVG Vector 24-hr Diurnal Curves** & **Interactive Canvas Wave Shader** |
| **Backend Framework** | Node.js + Express.js | **Node.js (ESM)** + **Express 4.19** REST API with Multer Ingestion |
| **Database** | MongoDB Atlas Cloud | **Official MongoDB Atlas Cluster** (`cluster0.ihw0jms.mongodb.net`) via **Mongoose 8.3** |
| **Authentication** | JSON Web Token (JWT) | **`jsonwebtoken` 9.0** (Bearer Token Session Security & Instant Demo Bypass) |
| **Password Hashing** | bcrypt | **`bcryptjs` 2.4** (Salted 10-round cryptographic password hashing) |
| **Schema Validation** | Zod | **`zod` 3.23** (Strict runtime schema validation on all API payloads) |
| **Artificial Intelligence** | Google Gemini API | **Google Gemini 2.5 Flash** (`@google/genai` Multimodal Bill Vision & Audit Synthesis) |
| **Solar Satellite Telemetry**| Open-Meteo API | **Open-Meteo Satellite Solar API** (Real-time Direct Normal Irradiance in W/m²) |
| **Carbon Grid Model** | Central Electricity Authority | **Govt. of India CEA Standard** (0.716 kg CO₂/kWh Regional Baseline) |
| **Deployment** | Vercel & Render | **Vercel Production Deployment** with SPA rewrites (`vercel.json`) |

---

## 🖥️ 7. Core Features & Application Walkthrough

The platform features a **4-Page Unified Workflow** designed with a distinctive Luminous Eco-Acrylic liquid glass design:

1. **Page 1: Landing & Transparent Benchmarking (`/`)**
   * High-impact 4-Card Hero Deck showcasing autonomous solar, battery, grid, and arbitrage telemetry.
   * Full transparent comparison matrix vs. Schneider, Siemens, and utility BESS SaaS.
   * Mathematical wave background engine with fluid metaballs flowing inside the navbar.
2. **Page 2: Bill Upload, Geolocation Calibration & International Guardrail (`/ingest`)**
   * Drag-and-drop OCR ingestion supporting PDF, PNG, and JPG Indian utility bills (MSEDCL, BESCOM, Tata Power).
   * Multi-source auto-detection mapping client IP/GPS to state grid hubs.
   * Amber alert banner and submission blocker if connected via international VPN.
   * Auto-filled review form with intentional blank fields for manual calibration (Solar kWp, BESS kWh, Floor Area).
3. **Page 3: SEBI BRSR Audit Report (`/audit`)**
   * Instant Facility Efficiency Grade (Grade A through F) benchmarked against CEA standard.
   * Forensic line-item audit comparing unmanaged baseline vs. autonomous dispatch.
   * Optimal BESS and Solar PV hardware sizing recommendation with ROI payback ticker.
   * One-click PDF download & printable publication report with SHA-256 seal.
4. **Page 4: Live Grid Intelligence Console (`/console`)**
   * Live telemetry monitoring net grid draw, solar generation, and battery state of charge (SoC).
   * Interactive 24-hour diurnal load profile graph displaying dynamic peak-shaving bands.
   * Energy flow matrix illustrating real-time power routing across campus assets.

---

## 📊 8. Financial & Environmental Impact Case Study

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

## 📡 9. REST API Catalog

| Method | Endpoint | Description | Scope / Engine |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/` | API Discovery Catalog, MongoDB Atlas cloud status & health | System Discovery |
| `POST` | `/api/auth/register` | Register facility manager account with bcrypt hashing | MongoDB Atlas & Auth |
| `POST` | `/api/auth/login` | Authenticate user & issue 7-day JWT Bearer token | JWT Security |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & saved reports | Protected (JWT Required) |
| `GET` | `/api/audit/history` | Retrieve past sustainability audits from database | MongoDB Atlas Persistence |
| `POST` | `/api/audit/save` | Persist completed BRSR audit and SHA-256 seal | MongoDB Atlas Persistence |
| `GET` | `/api/grid/telemetry` | Real-time Western Grid carbon intensity & ToD slot | CEA Carbon & Tariff Engine |
| `GET` | `/api/grid/curve` | Full 24-hour diurnal load & carbon curve | Grid Diurnal Modeling |
| `GET` | `/api/grid/resolve-location` | Maps GPS/IP coordinates to nearest Indian DISCOM & CEA zone | Geolocation & Tariff Maps |
| `POST` | `/api/bills/upload` | **Gemini Multimodal OCR** upload for PDF & bill images | Google Gemini 2.5 Flash |
| `POST` | `/api/bills/manual` | Ingest manual utility meter readings & campus presets | Tariff Parser & Zod Validation |
| `POST` | `/api/optimize/shift` | Calculate ₹3.00/kWh ToD arbitrage and load schedule | Arbitrage Optimizer |
| `POST` | `/api/emissions/calculate` | Compute Scope 1 (DG) & Scope 2 (Grid) GHG against CEA | CEA Emission Accounting |
| `POST` | `/api/audit/generate` | Synthesize SEBI BRSR Principle 6 audit report | Gemini ESG Synthesis & SHA-256 |
| `GET` | `/api/facility/equipment` | List campus equipment and flexible capacity | Flexible Asset Subsystems |
| `GET` | `/api/status/ai` | Check Google Gemini API configuration and status | AI Engine Diagnostics |
| `GET` | `/api/db/status` | Real-time MongoDB Atlas cloud connection diagnostic | Database Health |

---

## 🛠️ 10. Local Development & MongoDB Atlas Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **Google Gemini API Key:** [Get a free key from Google AI Studio](https://aistudio.google.com/app/apikey)
* **MongoDB Atlas URI:** Configured in `backend/.env` (official cluster ready)

### Step-by-Step Setup

```bash
# 1. Clone repository
git clone git@github.com:ypatil2006-coder/-watthacks-ai.git
cd -watthacks-ai

# 2. Install dependencies across backend & frontend
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Configure backend environment variables
cp backend/.env.example backend/.env
# In backend/.env:
# - GEMINI_API_KEY=your_google_gemini_api_key
# - MONGODB_URI=mongodb+srv://... (Official MongoDB Atlas Cluster)
# - JWT_SECRET=your_jwt_secret_token_key_here

# 4. Launch Full Stack Concurrently
# Terminal 1: Backend Server (Port 5000)
cd backend && node --watch server.js

# Terminal 2: Frontend Vite App (Port 3000)
cd frontend && npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 🎬 11. 150-Second Demo Video & Script

[![Watch 150s Demo Video on Google Drive](https://img.shields.io/badge/▶_Watch_Demo_Video-Google_Drive-EA4335?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1d2yOctTP2mUPG7X5MoXjiM4ztfRkg0kk/view?usp=drive_link)

> 📽️ **Watch the Official 150-Second Pitch & Walkthrough Video:**  
> **Google Drive Link:** [https://drive.google.com/file/d/1d2yOctTP2mUPG7X5MoXjiM4ztfRkg0kk/view?usp=drive_link](https://drive.google.com/file/d/1d2yOctTP2mUPG7X5MoXjiM4ztfRkg0kk/view?usp=drive_link)  
> *Recorded in 1080p Full HD showcasing live multimodal bill extraction, SEBI BRSR audit generation, and autonomous load-shifting schedules.*

*Maximum time limit: 2 minutes 30 seconds (150 seconds)*

* **0:00 – 0:25 (Hook & Problem):**  
  *"Every evening between 6 PM and 10 PM across Indian commercial hubs, facilities face a dual crisis: DISCOMs slap on a +₹1.50 per unit penalty, and the power grid turns to dirty coal peakers, releasing over 685g of CO₂ per kilowatt-hour. Meanwhile, right after 10 PM, a -₹1.50 rebate sits untouched. That is an unmanaged ₹3.00 price swing and tons of carbon wasted every single night."*
* **0:25 – 0:50 (Introducing WattHacks AI):**  
  *"Meet WattHacks AI. We provide autonomous grid intelligence for commercial facilities. Built on React 18, MongoDB Atlas, and Google Gemini Multimodal AI, WattHacks continuously connects live regional grid telemetry with Time-of-Day tariffs to give facility managers autonomous X-ray vision over their energy and carbon footprint."*
* **0:50 – 1:20 (Live UI & Geolocation Engine):**  
  *"Look at the live interface. Framed in our liquid-glass design, the platform auto-detects device geolocation across Indian regional grids (Pune, Bengaluru, Delhi-NCR, Mumbai). If accessed from overseas or VPN, intelligent guardrails ensure statutory compliance with Government of India Central Electricity Authority baselines."*
* **1:20 – 1:50 (Gemini Bill Ingestion):**  
  *"Instead of manual spreadsheets, users drop an electricity bill or fuel log into the vault. Powered by Google Gemini Multimodal Vision AI, WattHacks extracts consumption, ToD tiers, and power factor in seconds, calculating Scope 1 and Scope 2 emissions automatically."*
* **1:50 – 2:15 (Regulatory & BRSR Compliance):**  
  *"With India's SEBI mandating BRSR sustainability reporting, WattHacks exports audit-ready compliance documents with a single click, proving verified carbon diversion with CEA standard baselines and cryptographic SHA-256 digital seals."*
* **2:15 – 2:30 (Closing & Vision):**  
  *"In a single 500 kVA campus in Hinjewadi, WattHacks saves over ₹48,000 and diverts 5.4 metric tons of carbon every month. WattHacks AI — turning peak penalties into planetary progress. Thank you."*

---

<p align="center">
  Built with 🌿 for a cleaner, autonomous energy grid. <br>
  <strong>Team wallHacks · AI for Sustainability 2026</strong>
</p>
