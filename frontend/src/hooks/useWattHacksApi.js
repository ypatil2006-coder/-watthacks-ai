/**
 * WattHacks AI — React Integration Hook
 * Provides turnkey reactive state for live grid telemetry, diurnal curves,
 * dynamic equipment breakdown, and on-demand Gemini SEBI BRSR generation.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  getLiveTelemetry,
  get24HourCurve,
  getFacilityEquipment,
  generateBrsrAudit,
  uploadBill,
  optimizeLoadShift
} from '../services/api';

export function useWattHacksLive({
  region = 'Pune',
  contractDemandKva = 500,
  facilityName = 'Hinjewadi Tech Hub',
  pollIntervalMs = 5000
} = {}) {
  const [telemetry, setTelemetry] = useState(null);
  const [diurnalCurve, setDiurnalCurve] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [brsrReport, setBrsrReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState(null);

  // Initial load: 24-hour curve & equipment synthesis
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setLoading(true);
        const [curveRes, equipRes] = await Promise.all([
          get24HourCurve(region).catch(err => {
            console.warn('Failed to load diurnal curve:', err.message);
            return { curve: [] };
          }),
          getFacilityEquipment(contractDemandKva).catch(err => {
            console.warn('Failed to load equipment:', err.message);
            return { equipment: [] };
          })
        ]);

        if (isMounted) {
          if (curveRes?.curve) setDiurnalCurve(curveRes.curve);
          if (equipRes?.equipment) setEquipment(equipRes.equipment);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [region, contractDemandKva]);

  // Real-time telemetry polling
  useEffect(() => {
    let isMounted = true;

    async function fetchTelemetry() {
      try {
        const data = await getLiveTelemetry(region);
        if (isMounted && data?.success) {
          setTelemetry(data);
        }
      } catch (err) {
        // Silently log so UI doesn't crash if disconnected
        console.warn('Telemetry poll warning:', err.message);
      }
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [region, pollIntervalMs]);

  // Trigger Gemini SEBI BRSR Audit
  const triggerBrsrAudit = useCallback(async ({ monthlySavings, carbonAbated, batterySoc }) => {
    try {
      setAuditLoading(true);
      const res = await generateBrsrAudit({
        facilityName,
        monthlySavingsInr: monthlySavings,
        carbonAbatedTons: carbonAbated,
        batterySoc,
        equipmentList: equipment
      });
      if (res?.success) {
        setBrsrReport(res.report);
        return res.report;
      }
    } catch (err) {
      console.error('BRSR Audit generation error:', err);
      throw err;
    } finally {
      setAuditLoading(false);
    }
  }, [facilityName, equipment]);

  // Upload or Run Demo Bill Extraction
  const handleUploadBill = useCallback(async (file = null, useDemo = false) => {
    try {
      setBillLoading(true);
      const res = await uploadBill(file, useDemo);
      if (res?.success) {
        setBillData(res.extracted);
        return res.extracted;
      }
    } catch (err) {
      console.error('Bill upload error:', err);
      throw err;
    } finally {
      setBillLoading(false);
    }
  }, []);

  // Run Arbitrage Optimization
  const calculateShift = useCallback(async (peakLoadKw, flexibleSharePercent) => {
    try {
      return await optimizeLoadShift({
        peakLoadKw,
        flexibleSharePercent,
        contractDemandKva
      });
    } catch (err) {
      console.error('Arbitrage optimization error:', err);
      throw err;
    }
  }, [contractDemandKva]);

  return {
    telemetry,
    diurnalCurve,
    equipment,
    brsrReport,
    billData,
    loading,
    auditLoading,
    billLoading,
    error,
    triggerBrsrAudit,
    handleUploadBill,
    calculateShift
  };
}

export default useWattHacksLive;
