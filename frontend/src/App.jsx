import React, { useState, useEffect, useRef } from 'react';
import WaveBackground from './components/WaveBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompetitionSection from './components/CompetitionSection';
import FeaturesSection from './components/FeaturesSection';
import BillUploadSection from './components/BillUploadSection';
import ExtractedInfoForm from './components/ExtractedInfoForm';
import AuditReportPage from './components/AuditReportPage';
import ProductDashboard from './components/ProductDashboard';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import StripTransition from './components/StripTransition';
import AuthModal from './components/AuthModal';
import { getCurrentUser, logoutUser } from './services/api';
import { ArrowRight, FileCheck, Zap, ShieldCheck } from 'lucide-react';

const VALID_PAGES = ['landing', 'bill-audit', 'audit-report', 'live-console'];

// Map of any sub-section or hash to its corresponding page
const HASH_TO_PAGE_MAP = {
  'landing': 'landing',
  'overview': 'landing',
  'hero': 'landing',
  'comparison': 'landing',
  'features': 'landing',
  'bill-audit': 'bill-audit',
  'bill-upload-section': 'bill-audit',
  'facility-info-section': 'bill-audit',
  'audit-report': 'audit-report',
  'audit-summary': 'audit-report',
  'audit-breakdown': 'audit-report',
  'audit-dispatch': 'audit-report',
  'live-console': 'live-console'
};

const resolvePageFromHash = () => {
  if (typeof window === 'undefined') return null;
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return null;
  return HASH_TO_PAGE_MAP[raw] || (VALID_PAGES.includes(raw) ? raw : null);
};

const getInitialPage = () => {
  const fromHash = resolvePageFromHash();
  if (fromHash) return fromHash;

  try {
    const saved = sessionStorage.getItem('watthacks_current_page');
    if (saved && VALID_PAGES.includes(saved)) {
      return saved;
    }
  } catch (e) {}

  return 'landing';
};

const getInitialExtractedData = () => {
  try {
    const saved = sessionStorage.getItem('watthacks_extracted_data');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const getInitialAuditData = () => {
  try {
    const saved = sessionStorage.getItem('watthacks_audit_data');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export default function App() {
  // Page mode: 'landing' | 'bill-audit' | 'audit-report' | 'live-console'
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  
  // Data state with persistent storage fallback
  const [extractedData, setExtractedData] = useState(getInitialExtractedData);
  const [auditData, setAuditData] = useState(getInitialAuditData);

  // 🔐 Authentication & Protected Product Gateway State
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingTargetPage, setPendingTargetPage] = useState(null);

  // Clear / Reset bill data cleanly so users can start fresh without stale presets
  const handleResetBillData = () => {
    setExtractedData(null);
    setAuditData(null);
    try {
      sessionStorage.removeItem('watthacks_extracted_data');
      sessionStorage.removeItem('watthacks_audit_data');
    } catch (e) {}
  };

  // Validate JWT session on initial load and guard product routes
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('watthacks_jwt') : null;
    if (token) {
      getCurrentUser()
        .then((res) => {
          if (res?.success && res.user) {
            setCurrentUser(res.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('watthacks_jwt');
          setCurrentUser(null);
          if (currentPage !== 'landing') {
            setCurrentPage('landing');
            setShowAuthModal(true);
          }
        });
    } else if (currentPage !== 'landing') {
      // Unauthenticated deep link to product page -> gate access and prompt auth
      setPendingTargetPage(currentPage);
      setCurrentPage('landing');
      setShowAuthModal(true);
    }
  }, []);

  // Synchronized vertical strips transition state (Active during Landing <-> Other Pages navigation)
  const [transitionState, setTransitionState] = useState({
    active: false,
    phase: 'idle', // 'cover' | 'reveal' | 'idle'
    direction: 'down' // 'down' (landing -> other) | 'up' (other -> landing)
  });
  const isTransitioningRef = useRef(false);
  const transitionTimersRef = useRef([]);

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach(t => clearTimeout(t));
    transitionTimersRef.current = [];
  };

  const formRef = useRef(null);

  // Keep current page synced to sessionStorage and URL hash
  useEffect(() => {
    try {
      sessionStorage.setItem('watthacks_current_page', currentPage);
    } catch (e) {}

    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    const mappedPage = HASH_TO_PAGE_MAP[rawHash];
    
    // Only update hash if the hash doesn't already belong to this page
    if (mappedPage !== currentPage && rawHash !== currentPage) {
      window.history.replaceState(null, '', `#${currentPage}`);
    }
  }, [currentPage]);

  // Persist extracted bill data across refreshes
  useEffect(() => {
    try {
      if (extractedData) {
        sessionStorage.setItem('watthacks_extracted_data', JSON.stringify(extractedData));
      }
    } catch (e) {}
  }, [extractedData]);

  // Persist audit report inputs across refreshes
  useEffect(() => {
    try {
      if (auditData) {
        sessionStorage.setItem('watthacks_audit_data', JSON.stringify(auditData));
      }
    } catch (e) {}
  }, [auditData]);

  // Record scroll position per page so refreshing at any scroll point restores position
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        try {
          sessionStorage.setItem(`watthacks_scroll_${currentPage}`, window.scrollY.toString());
        } catch (e) {}
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  // On page change or initial mount: restore scroll or scroll to hash section
  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    
    // If the hash is a specific section (e.g. comparison, features, facility-info-section), scroll to it
    if (rawHash && rawHash !== currentPage) {
      const el = document.getElementById(rawHash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }

    // Otherwise, restore the saved scroll position for this page
    try {
      const savedScroll = sessionStorage.getItem(`watthacks_scroll_${currentPage}`);
      if (savedScroll !== null) {
        const top = parseInt(savedScroll, 10);
        if (!isNaN(top) && top > 0) {
          setTimeout(() => {
            window.scrollTo({ top, behavior: 'instant' });
          }, 80);
        }
      }
    } catch (e) {}
  }, [currentPage]);

  // Support browser Back / Forward buttons and manual hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = resolvePageFromHash();
      if (newPage && newPage !== currentPage) {
        handleNavigate(newPage);
        return;
      }
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (rawHash && rawHash !== currentPage) {
        const el = document.getElementById(rawHash);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // When bill extraction completes: set extracted data & smooth scroll to form
  const handleExtractComplete = (data) => {
    setExtractedData(data);
    try {
      sessionStorage.setItem('watthacks_extracted_data', JSON.stringify(data));
    } catch (e) {}
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
    try {
      sessionStorage.setItem('watthacks_audit_data', JSON.stringify(formData));
      sessionStorage.setItem('watthacks_current_page', 'audit-report');
      sessionStorage.setItem('watthacks_scroll_audit-report', '0');
    } catch (e) {}
    setCurrentPage('audit-report');
    window.history.replaceState(null, '', '#audit-report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔐 Authentication Handlers
  const handleAuthSuccess = (user) => {
    isTransitioningRef.current = false;
    clearTransitionTimers();
    setTransitionState({
      active: false,
      phase: 'idle',
      direction: 'down'
    });
    setCurrentUser(user);
    setShowAuthModal(false);
    const target = pendingTargetPage || 'bill-audit';
    setPendingTargetPage(null);
    executeNavigation(target);
  };

  const handleLogout = () => {
    isTransitioningRef.current = false;
    clearTransitionTimers();
    setTransitionState({
      active: false,
      phase: 'idle',
      direction: 'down'
    });
    logoutUser();
    setCurrentUser(null);
    executeNavigation('landing');
  };

  const handleNavigate = (page, sectionId = null) => {
    // 🔐 AUTHENTICATION GATE: Check if transitioning into the product pages
    const isProductPage = page !== 'landing';
    const token = typeof window !== 'undefined' ? localStorage.getItem('watthacks_jwt') : null;

    if (isProductPage && !token) {
      setPendingTargetPage(page);
      setShowAuthModal(true);
      return;
    }

    executeNavigation(page, sectionId);
  };

  const executeNavigation = (page, sectionId = null) => {
    // If target is same page and no section anchor, smooth scroll to top
    if (page === currentPage && !sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Condition: ONLY between landing and another page (or vice versa)!
    // NOT between two non-landing pages (e.g. bill-audit <-> audit-report <-> live-console)
    const isEligible = (currentPage === 'landing' && page !== 'landing') ||
                       (currentPage !== 'landing' && page === 'landing');

    if (!isEligible) {
      setCurrentPage(page);
      try {
        sessionStorage.setItem('watthacks_current_page', page);
      } catch (e) {}

      if (sectionId) {
        window.history.replaceState(null, '', `#${sectionId}`);
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.history.replaceState(null, '', `#${page}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
          sessionStorage.setItem(`watthacks_scroll_${page}`, '0');
        } catch (e) {}
      }
      return;
    }

    // Prevent re-triggering while a transition is already in flight
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    clearTransitionTimers();

    const direction = currentPage === 'landing' ? 'down' : 'up';

    // Step 1: Start cover phase (strips cascade in)
    setTransitionState({
      active: true,
      phase: 'cover',
      direction
    });

    // 15 strips with 24ms stagger + 340ms duration = ~700ms
    const t1 = setTimeout(() => {
      // Step 2: Switch underlying page & scroll position while screen is completely covered
      setCurrentPage(page);
      try {
        sessionStorage.setItem('watthacks_current_page', page);
      } catch (e) {}

      if (sectionId) {
        window.history.replaceState(null, '', `#${sectionId}`);
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'instant' });
      } else {
        window.history.replaceState(null, '', `#${page}`);
        window.scrollTo({ top: 0, behavior: 'instant' });
        try {
          sessionStorage.setItem(`watthacks_scroll_${page}`, '0');
        } catch (e) {}
      }

      // Step 3: Trigger reveal phase (strips cascade out)
      setTransitionState({
        active: true,
        phase: 'reveal',
        direction
      });

      const t2 = setTimeout(() => {
        // Step 4: Finish transition and unmount
        setTransitionState({
          active: false,
          phase: 'idle',
          direction: 'down'
        });
        isTransitioningRef.current = false;
      }, 700);

      transitionTimersRef.current.push(t2);
    }, 700);

    transitionTimersRef.current.push(t1);

    // Safety failsafe timer: ensures transition lock and overlay are reset even if backgrounded
    const failsafe = setTimeout(() => {
      setTransitionState({
        active: false,
        phase: 'idle',
        direction: 'down'
      });
      isTransitioningRef.current = false;
    }, 1500);
    transitionTimersRef.current.push(failsafe);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAF8] text-slate-900 font-sans overflow-x-hidden flex flex-col justify-between selection:bg-black selection:text-white scroll-smooth">
      {/* Interactive cursor follower sphere */}
      <CustomCursor />

      {/* Synchronized Vertical Strip Page Transition (Landing <-> Other Pages Only) */}
      <StripTransition 
        active={transitionState.active} 
        phase={transitionState.phase} 
        direction={transitionState.direction} 
      />

      {/* Ambient background glows */}
      <div className="ambient-glows fixed inset-0 pointer-events-none z-0"></div>

      {/* Mathematical wave engine & ambient particles */}
      <WaveBackground />

      {/* Sticky Liquid Glass Navbar with All Page Tabs */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        hasActiveBill={!!extractedData}
        onResetBill={handleResetBillData}
      />

      {/* ======================================================== */}
      {/* PAGE 1: HOME & LANDING PAGE                              */}
      {/* ======================================================== */}
      {currentPage === 'landing' && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full animate-fadeIn pt-24 sm:pt-28">
          {/* Hero Section with 4-Card Deck Realistic Slider */}
          <section id="overview" className="pt-2 pb-12">
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
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full my-auto py-8 pt-24 sm:pt-28 animate-fadeIn">
          <div className="space-y-12">
            {/* Tagline + Bill Upload & OCR Scanning Block */}
            <BillUploadSection 
              onExtractComplete={handleExtractComplete} 
              onResetData={handleResetBillData}
              hasData={!!extractedData}
            />

            {/* Extracted Information & Confirmation Form (Auto-Filled + Blank Manual Fields) */}
            <ExtractedInfoForm 
              ref={formRef} 
              extractedData={extractedData} 
              onSubmitAudit={handleSubmitAudit} 
              onResetData={handleResetBillData}
            />
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 3: COMPREHENSIVE AUDIT REPORT PAGE                  */}
      {/* ======================================================== */}
      {currentPage === 'audit-report' && (
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full my-auto py-8 pt-24 sm:pt-28 animate-fadeIn">
          <AuditReportPage 
            auditData={auditData} 
            onBackToUpload={() => {
              handleResetBillData();
              handleNavigate('bill-audit');
            }}
            onLaunchConsole={() => handleNavigate('live-console')}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 4: OUR PRODUCT (Autonomous Grid Intelligence)      */}
      {/* ======================================================== */}
      {currentPage === 'live-console' && (
        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full my-auto py-8 pt-24 sm:pt-28 animate-fadeIn">
          <ProductDashboard onBack={() => handleNavigate('landing')} />
        </main>
      )}

      {/* 🔐 Authentication & JWT Gateway Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingTargetPage(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        destinationName={
          pendingTargetPage === 'bill-audit'
            ? 'Bill Upload & Multimodal OCR Ingestion'
            : pendingTargetPage === 'audit-report'
            ? 'SEBI BRSR Compliance & Tariff Audit Report'
            : pendingTargetPage === 'live-console'
            ? 'Autonomous Grid Intelligence Console'
            : 'WattHacks Autonomous Energy Workspace'
        }
      />

      {/* Enterprise Compliance & Specs Footer */}
      <Footer />
    </div>
  );
}
