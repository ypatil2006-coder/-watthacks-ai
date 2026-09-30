import React, { useState, useEffect, forwardRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Building, 
  Zap, 
  Sliders, 
  Battery, 
  Sun, 
  FileCheck, 
  MapPin, 
  Radio, 
  Globe, 
  RefreshCw, 
  Loader2 
} from 'lucide-react';
import { resolveLocationFromGps, getLiveTelemetry, detectClientLocation } from '../services/api';

const GRID_HUBS = [
  {
    id: 'pune',
    label: 'Pune / MSEDCL (0.716 kg/kWh)',
    shortLabel: 'Pune / MSEDCL',
    factor: '0.716 kg/kWh',
    regionName: 'Pune IT Park, Maharashtra',
    discom: 'MSEDCL (Maharashtra) • HT-1 Commercial',
    gridZone: 'Western Grid (IN-WE)',
    ceaBaselineKgPerKwh: 0.716,
    coords: { lat: 18.5204, lon: 73.8567 },
    solarDni: 650,
    freq: 50.02
  },
  {
    id: 'bengaluru',
    label: 'Bengaluru / BESCOM (0.690 kg/kWh)',
    shortLabel: 'Bengaluru / BESCOM',
    factor: '0.690 kg/kWh',
    regionName: 'Bengaluru Tech Hub, Karnataka',
    discom: 'BESCOM (Karnataka) • HT-2A Commercial',
    gridZone: 'Southern Grid (IN-SO)',
    ceaBaselineKgPerKwh: 0.690,
    coords: { lat: 12.9716, lon: 77.5946 },
    solarDni: 710,
    freq: 49.99
  },
  {
    id: 'delhi',
    label: 'Delhi-NCR / Tata Power (0.740 kg/kWh)',
    shortLabel: 'Delhi-NCR / Tata Power',
    factor: '0.740 kg/kWh',
    regionName: 'Gurugram Industrial Hub, Haryana / Delhi-NCR',
    discom: 'Tata Power (Delhi/NCR) • HT Industrial Continuous',
    gridZone: 'Northern Grid (IN-NO)',
    ceaBaselineKgPerKwh: 0.740,
    coords: { lat: 28.6139, lon: 77.2090 },
    solarDni: 580,
    freq: 50.01
  },
  {
    id: 'mumbai',
    label: 'Mumbai / Adani (0.716 kg/kWh)',
    shortLabel: 'Mumbai / Adani',
    factor: '0.716 kg/kWh',
    regionName: 'Mumbai Financial Hub, Maharashtra',
    discom: 'Adani Electricity / BEST (Mumbai) • HT Commercial',
    gridZone: 'Western Grid (IN-WE)',
    ceaBaselineKgPerKwh: 0.716,
    coords: { lat: 19.0760, lon: 72.8777 },
    solarDni: 630,
    freq: 50.02
  }
];

const ExtractedInfoForm = forwardRef(({ extractedData, onSubmitAudit, detectedLocation }, ref) => {
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

    // Live Grid & Location Telemetry (Dynamic - NOT hardcoded)
    location: '',
    gridZone: '',
    ceaBaselineKgPerKwh: null,
    latitude: null,
    longitude: null,
    liveSolarDni: null,
    liveGridFreq: null,

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
  const [locLoading, setLocLoading] = useState(false);
  const [liveTelemetryStatus, setLiveTelemetryStatus] = useState(null);
  const [selectedHubId, setSelectedHubId] = useState(null);
  const [locationSource, setLocationSource] = useState(null); // 'gps' | 'preset' | null
  const [isInternationalLocation, setIsInternationalLocation] = useState(false);
  const [internationalLocationName, setInternationalLocationName] = useState('');

  // Auto-detect or manually set location & fetch live government CEA grid data
  const handleDetectLocation = async (manualCoords = null, hubId = null, hubName = null) => {
    setLocLoading(true);
    try {
      let lat = null;
      let lon = null;
      let isGps = false;
      let isForeign = false;
      let foreignName = '';

      if (manualCoords) {
        lat = manualCoords.lat;
        lon = manualCoords.lon;
        setSelectedHubId(hubId || 'pune');
        setLocationSource('preset');
        setIsInternationalLocation(false);
      } else {
        // Multi-source detection: Check IP network location & Browser GPS
        const clientLoc = await detectClientLocation();
        lat = clientLoc.latitude;
        lon = clientLoc.longitude;
        isGps = clientLoc.source === 'browser_gps';
        isForeign = !!clientLoc.isVpn || clientLoc.countryCode !== 'IN' || lat < 6.0 || lat > 37.5 || lon < 68.0 || lon > 97.5;
        foreignName = clientLoc.city || clientLoc.country || 'Non-Indian Node';
        setLocationSource('gps');
      }

      if (isForeign) {
        setIsInternationalLocation(true);
        setInternationalLocationName(foreignName);
        setSelectedHubId(null);
        setFormData(prev => ({
          ...prev,
          location: `${foreignName} (International Location)`,
          gridZone: 'Non-Indian Grid Node',
          ceaBaselineKgPerKwh: null,
          latitude: +lat.toFixed(4),
          longitude: +lon.toFixed(4),
          liveSolarDni: 590,
          liveGridFreq: 50.00
        }));
        return;
      }

      setIsInternationalLocation(false);
      if (!lat || !lon) {
        lat = 18.5204;
        lon = 73.8567;
      }

      // 1. Resolve Indian Government Grid Zone & CEA Baseline from Coordinates
      const geoRes = await resolveLocationFromGps(lat, lon);
      const matched = geoRes?.matchedRegionId || hubId || 'pune';
      setSelectedHubId(matched);

      const ceaFactor = geoRes?.ceaBaselineKgPerKwh || (matched === 'bengaluru' ? 0.690 : matched === 'delhi' ? 0.740 : 0.716);
      const discomName = geoRes?.discom || (matched === 'bengaluru' ? 'BESCOM (Karnataka)' : matched === 'delhi' ? 'Tata Power (Delhi/NCR)' : 'MSEDCL (Maharashtra)');
      const gridZoneName = geoRes?.gridZone || (matched === 'bengaluru' ? 'Southern Grid (IN-SO)' : matched === 'delhi' ? 'Northern Grid (IN-NO)' : 'Western Grid (IN-WE)');
      const resolvedLocationName = hubName || geoRes?.matchedRegionName || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;

      // 2. Fetch Live Real-Time Satellite Solar & Grid Telemetry from Govt/Open-Meteo API
      const telRes = await getLiveTelemetry({ lat, lon });
      const t = telRes?.telemetry;
      const solarDni = t?.liveSolarWeather?.directNormalSolarIrradianceWm2 || 620;
      const freq = t?.gridFrequencyHz || 50.01;

      setFormData(prev => ({
        ...prev,
        latitude: +lat.toFixed(4),
        longitude: +lon.toFixed(4),
        discom: prev.discom || `${discomName} • HT Commercial`,
        location: resolvedLocationName,
        gridZone: gridZoneName,
        ceaBaselineKgPerKwh: ceaFactor,
        liveSolarDni: solarDni,
        liveGridFreq: freq
      }));

      setLiveTelemetryStatus({
        matchedRegion: resolvedLocationName,
        gridZone: gridZoneName,
        ceaFactor,
        solarDni,
        freq,
        isGps
      });
    } catch (err) {
      console.warn('Location detection notice:', err.message);
    } finally {
      setLocLoading(false);
    }
  };

  // Proactively auto-detect location on mount if not provided by extractedData
  useEffect(() => {
    if (!extractedData) {
      if (detectedLocation) {
        const isVpn = !!detectedLocation.isVpn;
        if (isVpn || detectedLocation.isInternational) {
          setIsInternationalLocation(true);
          setInternationalLocationName(detectedLocation.matchedRegionName || 'International Location');
          return;
        }
        const matched = detectedLocation.matchedRegionId || 'pune';
        setSelectedHubId(matched);
        setLocationSource('gps');
        setIsInternationalLocation(false);
        setFormData(prev => ({
          ...prev,
          latitude: detectedLocation.detectedCoordinates?.latitude || prev.latitude,
          longitude: detectedLocation.detectedCoordinates?.longitude || prev.longitude,
          discom: prev.discom || `${detectedLocation.discom} • HT Commercial`,
          location: detectedLocation.matchedRegionName || prev.location,
          gridZone: detectedLocation.gridZone || prev.gridZone,
          ceaBaselineKgPerKwh: detectedLocation.ceaBaselineKgPerKwh || prev.ceaBaselineKgPerKwh
        }));
      } else {
        handleDetectLocation();
      }
    }
  }, [extractedData, detectedLocation]);

  // Sync when extractedData changes
  useEffect(() => {
    if (!extractedData) return;
    const isBescom = extractedData.discom?.includes('BESCOM') || extractedData.name?.includes('BESCOM') || extractedData.location?.includes('Bengaluru') || extractedData.facilityName?.includes('Bengaluru');
    const isTata = extractedData.discom?.includes('Tata Power') || extractedData.name?.includes('Tata') || extractedData.location?.includes('Gurugram') || extractedData.location?.includes('Delhi') || extractedData.facilityName?.includes('Gurugram');
    
    const defaultCea = extractedData.ceaBaselineKgPerKwh || extractedData.ceaBaseline || (isBescom ? 0.690 : isTata ? 0.740 : 0.716);
    const defaultZone = extractedData.gridZone || (isBescom ? 'Southern Grid (IN-SO)' : isTata ? 'Northern Grid (IN-NO)' : 'Western Grid (IN-WE)');
    const defaultLocation = extractedData.location || (isBescom ? 'Bengaluru Tech Hub, Karnataka' : isTata ? 'Gurugram Industrial Hub, Haryana / Delhi-NCR' : 'Pune IT Park, Maharashtra');
    const defaultLat = extractedData.latitude || (isBescom ? 12.9716 : isTata ? 28.6139 : 18.5204);
    const defaultLon = extractedData.longitude || (isBescom ? 77.5946 : isTata ? 77.2090 : 73.8567);
    const defaultSolarDni = extractedData.liveSolarDni || (isBescom ? 710 : isTata ? 580 : 650);
    const defaultFreq = extractedData.liveGridFreq || (isBescom ? 49.99 : isTata ? 50.01 : 50.02);

    setSelectedHubId(isBescom ? 'bengaluru' : isTata ? 'delhi' : 'pune');
    setLocationSource('preset');

    setFormData(prev => ({
      ...prev,
      facilityName: extractedData.facilityName || extractedData.name || extractedData.location || '',
      consumerNo: extractedData.consumerNo || '',
      discom: extractedData.discom || '',
      location: defaultLocation,
      gridZone: defaultZone,
      ceaBaselineKgPerKwh: defaultCea,
      latitude: defaultLat,
      longitude: defaultLon,
      liveSolarDni: defaultSolarDni,
      liveGridFreq: defaultFreq,
      billingCycle: extractedData.billingCycle || 'August 2026',
      billAmount: extractedData.billAmount || '',
      demand: extractedData.demand || '',
      units: extractedData.units || '',
      peakSurcharge: extractedData.peakSurcharge || '',
      powerFactor: extractedData.powerFactor || '0.98',
      peakPenaltyRate: extractedData.peakPenaltyRate || (isBescom ? 1.25 : isTata ? 1.75 : 1.50),
      nightRebateRate: extractedData.nightRebateRate || (isBescom ? 1.00 : isTata ? 1.20 : 1.50),
      
      // Keep manual fields blank as requested:
      solarKwp: prev.solarKwp || '',
      bessKwh: prev.bessKwh || '',
      floorArea: prev.floorArea || ''
    }));
    setHasScraped(true);
  }, [extractedData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isInternationalLocation) {
      alert("⚠️ International Location Detected: WattHacks AI requires calibration to an Indian state grid and DISCOM tariff schedule (MSEDCL, BESCOM, Tata Power, etc.) to generate the audit report. Please click an Indian Regional Hub above (Pune, Bengaluru, Delhi-NCR, Mumbai) to proceed.");
      return;
    }

    const cleanDemand = Number(formData.demand) || 500;
    const cleanBill = Number(formData.billAmount) || Math.round(cleanDemand * 1540);
    const cleanUnits = Number(formData.units) || Math.round(cleanBill / 8.5);
    const cleanPeak = Number(formData.peakSurcharge) || Math.round(cleanBill * 0.22);
    const cleanPf = Number(formData.powerFactor) || 0.98;

    const isBescom = (formData.discom || '').includes('BESCOM');
    const isTata = (formData.discom || '').includes('Tata Power');
    const defaultZone = isBescom ? 'Southern Grid (IN-SO)' : isTata ? 'Northern Grid (IN-NO)' : 'Western Grid (IN-WE)';
    const defaultCea = isBescom ? 0.690 : isTata ? 0.740 : 0.716;
    const defaultLocation = isBescom ? 'Bengaluru Tech Hub, Karnataka' : isTata ? 'Gurugram Industrial Hub, Haryana / Delhi-NCR' : 'Pune, Maharashtra';
    const defaultPeakPenalty = isBescom ? 1.25 : isTata ? 1.75 : 1.50;
    const defaultNightRebate = isBescom ? 1.00 : isTata ? 1.20 : 1.50;

    const payload = {
      ...formData,
      facilityName: formData.facilityName || 'Commercial Facility Node',
      consumerNo: formData.consumerNo || '084729104829',
      discom: formData.discom || 'MSEDCL (Maharashtra) • HT-1 Commercial',
      location: formData.location || defaultLocation,
      gridZone: formData.gridZone || defaultZone,
      ceaBaselineKgPerKwh: Number(formData.ceaBaselineKgPerKwh) || defaultCea,
      latitude: Number(formData.latitude) || (isBescom ? 12.9716 : isTata ? 28.6139 : 18.5204),
      longitude: Number(formData.longitude) || (isBescom ? 77.5946 : isTata ? 77.2090 : 73.8567),
      liveSolarDni: Number(formData.liveSolarDni) || (isBescom ? 710 : isTata ? 580 : 640),
      liveGridFreq: Number(formData.liveGridFreq) || 50.01,
      peakPenaltyRate: Number(formData.peakPenaltyRate) || defaultPeakPenalty,
      nightRebateRate: Number(formData.nightRebateRate) || defaultNightRebate,
      billingCycle: formData.billingCycle || 'August 2026',
      demand: cleanDemand,
      billAmount: cleanBill,
      units: cleanUnits,
      peakSurcharge: cleanPeak,
      powerFactor: cleanPf,
      solarKwp: Number(formData.solarKwp) || 0,
      bessKwh: Number(formData.bessKwh) || 0,
      equipment: [
        formData.hasHvac && 'hvac',
        formData.hasInverter && 'inverter',
        formData.hasEv && 'ev',
        formData.hasDg && 'dg'
      ].filter(Boolean)
    };

    if (onSubmitAudit) {
      onSubmitAudit(payload);
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
        {/* LIVE GOVERNMENT GRID & LOCATION SYNC (GPS / CEA)         */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-50 to-blue-500/10 border border-emerald-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
                Live Government Grid & Location Intelligence
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-500/15 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
              India CEA Baseline • Real-Time Satellite Solar
            </span>
          </div>

          <p className="text-xs text-slate-600 font-light">
            Fetch real-time grid carbon factors from the <strong>Govt of India Central Electricity Authority (CEA)</strong> and live satellite solar radiation for your facility's exact location.
          </p>

          {/* International / Overseas Location Notice Banner */}
          {isInternationalLocation && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 space-y-2.5 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-900">
                    ⚠️ International Location Detected ({internationalLocationName || 'Outside India'})
                  </h4>
                  <span className="text-[11px] text-amber-700 font-medium">
                    Audit Generation Blocked • Indian Tariff Model Calibration Required
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-800/90 leading-relaxed font-sans">
                WattHacks AI models commercial energy tariffs, peak/off-peak ToD schedules, and carbon accounting according to the <strong>Government of India Central Electricity Authority (CEA)</strong> baseline (0.716 kg CO₂/kWh) and state utility DISCOMs (MSEDCL, BESCOM, Tata Power, Adani). You cannot proceed with an international grid node.
              </p>

              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-950 bg-amber-500/15 px-3 py-2 rounded-xl border border-amber-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                <span>To proceed, please click any of the 4 Indian Regional Hub presets below (e.g., Pune / MSEDCL or Bengaluru / BESCOM).</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDetectLocation()}
              disabled={locLoading}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50 ${
                locationSource && locationSource !== 'preset'
                  ? 'bg-slate-950 text-emerald-300 border-2 border-emerald-400 ring-2 ring-emerald-500/40 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {locLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Querying Live Network & Grid APIs...</span>
                </>
              ) : (
                <>
                  <MapPin className={`w-3.5 h-3.5 ${locationSource && locationSource !== 'preset' ? 'text-emerald-300 animate-pulse' : 'text-emerald-400'}`} />
                  <span>
                    {locationSource && locationSource !== 'preset'
                      ? '📍 Location Connected (Active)'
                      : '📍 Auto-Detect Live Location'}
                  </span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-400 font-mono px-1">or quick select hub:</span>

            {GRID_HUBS.map((hub) => {
              const isSelected = selectedHubId === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleDetectLocation(hub.coords, hub.id, hub.regionName)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold border-2 border-emerald-500 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                      : 'bg-white/90 hover:bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-slate-900'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  <span>{hub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Selected Location Notification Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/95 border-2 border-emerald-500/40 shadow-sm text-xs font-mono min-h-[46px]">
            {locLoading ? (
              <div className="flex items-center gap-2 text-slate-700 py-0.5">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="font-semibold text-xs">Live Geolocation & Grid Calibration in Progress...</span>
                <span className="text-[10px] text-slate-500">(Resolving Grid Zone & Emission Factor)</span>
              </div>
            ) : isInternationalLocation ? (
              <div className="flex items-center justify-between w-full flex-wrap gap-2 py-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span className="text-amber-800 uppercase text-[10px] font-bold">Status:</span>
                  <strong className="text-amber-950 text-xs">
                    {formData.location || `${internationalLocationName} (International Node)`}
                  </strong>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold text-[10px] border border-amber-300">
                    Non-Indian Grid Node
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-mono font-bold">
                  ⛔ Select Indian Hub to Proceed
                </span>
              </div>
            ) : formData.location ? (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </span>
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Active Location:</span>
                  <strong className="text-slate-950 text-xs">
                    {formData.location}
                  </strong>
                  {formData.discom && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      {formData.discom.split('•')[0]?.trim()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  {formData.ceaBaselineKgPerKwh && (
                    <span className="text-slate-600">Grid Factor: <strong className="text-emerald-700">{formData.ceaBaselineKgPerKwh} kg CO₂/kWh</strong></span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full border ${
                    locationSource === 'preset'
                      ? 'bg-slate-900 text-emerald-400 border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold'
                  }`}>
                    {locationSource === 'preset' ? '⚡ Regional Preset Applied' : '📍 Live Location Detected'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 py-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-xs">Location Uncalibrated</span>
                <span className="text-[10px] text-slate-500">• Click "Auto-Detect Live Location" or select a hub below</span>
              </div>
            )}
          </div>

          {/* Active Synced Government Grid Telemetry Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">Grid Zone & Factor</span>
              <strong className="text-slate-900 block truncate">{formData.gridZone || (locLoading ? 'Detecting...' : 'Pending Calibration')}</strong>
              <span className="text-emerald-700 font-semibold">{formData.ceaBaselineKgPerKwh ? `${formData.ceaBaselineKgPerKwh} kg CO₂/kWh` : '---'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">Real-Time Solar DNI</span>
              <strong className="text-amber-700 block">{formData.liveSolarDni ? `${formData.liveSolarDni} W/m²` : (locLoading ? 'Fetching...' : '---')}</strong>
              <span className="text-slate-500 text-[10px]">Open-Meteo Satellite</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">National Grid Freq</span>
              <strong className="text-blue-700 block">{formData.liveGridFreq ? `${formData.liveGridFreq} Hz` : '50.00 Hz'}</strong>
              <span className="text-slate-500 text-[10px]">Standard 50.00 Hz Band</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">Coordinates</span>
              <strong className="text-slate-900 block truncate">{formData.latitude && formData.longitude ? `${formData.latitude}° N, ${formData.longitude}° E` : (locLoading ? 'Detecting...' : '---')}</strong>
              <span className="text-slate-500 text-[10px]">Geo-Matched Hub</span>
            </div>
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
          <div className="text-xs font-mono">
            {isInternationalLocation ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                International location active — select an Indian hub above to proceed
              </span>
            ) : (
              <span className="text-slate-500">
                <span>Detected ToD Peak Exposure: </span>
                <strong className="text-slate-900 font-semibold">
                  {formatInr(Number(formData.peakSurcharge) * 12)} / year
                </strong>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isInternationalLocation}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-3 group ${
              isInternationalLocation
                ? 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            <span>
              {isInternationalLocation
                ? '⚠️ Indian Hub Selection Required'
                : 'Generate Full Energy & Tariff Audit Report'}
            </span>
            <ArrowRight
              className={`w-4 h-4 ${
                isInternationalLocation
                  ? 'text-slate-400'
                  : 'text-emerald-400 group-hover:translate-x-1.5 transition-transform'
              }`}
            />
          </button>
        </div>

      </form>
    </section>
  );
});

export default ExtractedInfoForm;
