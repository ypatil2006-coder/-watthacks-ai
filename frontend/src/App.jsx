import React, { useState, useRef } from 'react';
import WaveBackground from './components/WaveBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompetitionSection from './components/CompetitionSection';
import FeaturesSection from './components/FeaturesSection';
import BillUploadSection from './components/BillUploadSection';
import ExtractedInfoForm from './components/ExtractedInfoForm';
import AuditReportPage from './components/AuditReportPage';
import ProductDashboard from './components/ProductDashboard';
import Footer from './components/Footer';
import { ArrowRight, FileCheck, Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  // Page mode: 'landing' | 'bill-audit' | 'audit-report' | 'live-console'
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Data state
  const [extractedData, setExtractedData] = useState(null);
  const [auditData, setAuditData] = useState(null);

  const formRef = useRef(null);

  // When bill extraction completes: set extracted data & smooth scroll to form
  const handleExtractComplete = (data) => {
    setExtractedData(data);
    setTimeout(() => {
      const formEl = document.getElementById('facility-info-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // When user reviews and submits the form -> Navigate to the Audit Page
  const handleSubmitAudit = (formData) => {
    setAuditData(formData);
    setCurrentPage('audit-report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAF8] text-slate-900 font-sans overflow-x-hidden flex flex-col justify-between selection:bg-black selection:text-white scroll-smooth">
      {/* Ambient background glows */}
      <div className="ambient-glows fixed inset-0 pointer-events-none z-0"></div>

      {/* Mathematical wave engine & ambient particles */}
      <WaveBackground />

      {/* Sticky Liquid Glass Navbar with All Page Tabs */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* ======================================================== */}
      {/* PAGE 1: HOME & LANDING PAGE                              */}
      {/* ======================================================== */}
      {currentPage === 'landing' && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full animate-fadeIn">
          {/* Hero Section with 4-Card Deck Realistic Slider */}
          <section id="overview" className="pt-6 pb-12">
            <Hero />
          </section>

          {/* Quick Jump Callout to Bill Audit */}
          <section className="my-8">
            <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-500/10 via-white/80 to-amber-500/10">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-emerald-800 font-semibold tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Instant OCR Ingestion
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  Have an electricity bill? Run a 10-second tariff audit.
                </h3>
                <p className="text-xs text-slate-600 font-light max-w-xl">
                  Drop any Indian commercial utility bill (MSEDCL, BESCOM, Tata Power, etc.) to immediately detect peak ToD surcharges and get an audit-grade sizing plan.
                </p>
              </div>

              <button
                onClick={() => handleNavigate('bill-audit')}
                className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm font-mono transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <span>Upload Bill & Audit</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </section>

          {/* Section 2: Honest Competitor Comparison & Pricing */}
          <section id="comparison" className="pt-6 pb-12">
            <CompetitionSection />
          </section>

          {/* Section 3: Core Product Architectural Features */}
          <section id="features" className="pt-6 pb-12">
            <FeaturesSection />
          </section>
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 2: BILL INGESTION & CALIBRATION                     */}
      {/* ======================================================== */}
      {currentPage === 'bill-audit' && (
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full my-auto py-8 animate-fadeIn">
          <div className="space-y-12">
            {/* Tagline + Bill Upload & OCR Scanning Block */}
            <BillUploadSection onExtractComplete={handleExtractComplete} />

            {/* Extracted Information & Confirmation Form (Auto-Filled + Blank Manual Fields) */}
            <ExtractedInfoForm 
              ref={formRef} 
              extractedData={extractedData} 
              onSubmitAudit={handleSubmitAudit} 
            />
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 3: COMPREHENSIVE AUDIT REPORT PAGE                  */}
      {/* ======================================================== */}
      {currentPage === 'audit-report' && (
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full my-auto py-8 animate-fadeIn">
          <AuditReportPage 
            auditData={auditData} 
            onBackToUpload={() => handleNavigate('bill-audit')}
            onLaunchConsole={() => handleNavigate('live-console')}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 4: OUR PRODUCT (Autonomous Grid Intelligence)      */}
      {/* ======================================================== */}
      {currentPage === 'live-console' && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full my-auto py-8 animate-fadeIn">
          <ProductDashboard onBack={() => handleNavigate('landing')} />
        </main>
      )}

      {/* Enterprise Compliance & Specs Footer */}
      <Footer />
    </div>
  );
}
