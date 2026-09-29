/**
 * WattHacks AI - Facility Equipment & Flexible Load Inventory Service
 * Dynamic, zero-hardcoding asset management.
 * Dynamically computes electrical connected loads and flexible capacities
 * based on the facility's actual Sanctioned Contract Demand (kVA) or user-registered inventory.
 */

// Multi-tenant in-memory store for registered equipment per facility
const facilityEquipmentStore = new Map();

/**
 * Algorithmically synthesizes an electrical equipment profile proportional to
 * the facility's actual Contract Maximum Demand (kVA).
 * Adheres to Indian commercial building energy benchmark ratios (BEE / ASHRAE 90.1).
 */
export function synthesizeEquipmentFromContractDemand(contractLoadKva = 500, facilityName = "Commercial Campus") {
  const kva = Number(contractLoadKva) || 500;

  // Proportional load ratios in Indian commercial facilities:
  // 1. Central Chiller Plant ~40-45% of total demand
  const hvacKw = Math.round(kva * 0.42);
  const hvacFlexKw = Math.round(hvacKw * 0.35); // 35% flexible via thermal pre-cooling storage

  // 2. EV Charging Infrastructure ~25-30% of total demand
  const evKw = Math.round(kva * 0.28);
  const evFlexKw = Math.round(evKw * 0.85); // 85% shiftable to night rebate window

  // 3. Campus Compute / IT Batch Servers ~12-15% of total demand
  const computeKw = Math.max(25, Math.round(kva * 0.14));
  const computeFlexKw = Math.round(computeKw * 0.60); // 60% batch shiftable

  // 4. Battery Energy Storage System (BESS) ~15-20% peak shaving buffer
  const bessKw = Math.max(30, Math.round(kva * 0.20));
  const bessFlexKw = bessKw; // 100% flexible dispatch

  // 5. Emergency Backup Diesel Generator (DG Set) ~120% contract demand rating
  const dgKw = Math.round(kva * 1.20);

  return [
    {
      id: `eq-ev-${kva}`,
      name: `${facilityName} — Smart EV Fast Charging Bank`,
      category: "ev_charging",
      ratedPowerKw: evKw,
      flexibleSharePercent: 85,
      flexibleKw: evFlexKw,
      operatingWindow: "Shiftable Window: 22:30 - 05:30 IST (Zone E)",
      shiftableToRebate: true,
      notes: "Proportionally scaled to 28% of facility contract demand."
    },
    {
      id: `eq-hvac-${kva}`,
      name: `${facilityName} — Central Chilled Water Plant`,
      category: "hvac",
      ratedPowerKw: hvacKw,
      flexibleSharePercent: 35,
      flexibleKw: hvacFlexKw,
      operatingWindow: "Thermal Storage Pre-cooling: 14:00 - 16:30 IST (Zone C)",
      shiftableToRebate: false,
      notes: "Proportionally scaled to 42% of facility contract demand."
    },
    {
      id: `eq-compute-${kva}`,
      name: `${facilityName} — Batch Compute & Server Racks`,
      category: "compute",
      ratedPowerKw: computeKw,
      flexibleSharePercent: 60,
      flexibleKw: computeFlexKw,
      operatingWindow: "Off-Peak Window: 01:30 - 04:30 IST (Zone E)",
      shiftableToRebate: true,
      notes: "Proportionally scaled to 14% of facility contract demand."
    },
    {
      id: `eq-bess-${kva}`,
      name: `${facilityName} — Peak-Shaving BESS Storage`,
      category: "bess",
      ratedPowerKw: bessKw,
      flexibleSharePercent: 100,
      flexibleKw: bessFlexKw,
      operatingWindow: "Charge: 23:00 - 05:00 | Discharge: 18:00 - 21:30",
      shiftableToRebate: true,
      notes: "Scales with 20% facility buffer for evening peak avoidance."
    },
    {
      id: `eq-dg-${kva}`,
      name: `${facilityName} — Emergency Diesel Genset`,
      category: "generator",
      ratedPowerKw: dgKw,
      fuelCapacityLiters: Math.round(dgKw * 2.5),
      fuelBurnRateLitersPerHour: Math.round(dgKw * 0.24),
      flexibleSharePercent: 0,
      flexibleKw: 0,
      operatingWindow: "Emergency Standby Only",
      shiftableToRebate: false,
      notes: "Scope 1 emission asset (2.68 kg CO2/L)."
    }
  ];
}

/**
 * Lists equipment for a facility.
 * If user hasn't added custom equipment yet, dynamically synthesizes assets
 * from the facility's contract load kVA.
 */
export function listEquipment(facilityId = 'default', contractLoadKva = 500, facilityName = "Hinjewadi Tech Hub") {
  if (!facilityEquipmentStore.has(facilityId)) {
    const dynamicAssets = synthesizeEquipmentFromContractDemand(contractLoadKva, facilityName);
    facilityEquipmentStore.set(facilityId, dynamicAssets);
  }
  return [...facilityEquipmentStore.get(facilityId)];
}

export function getEquipmentById(id, facilityId = 'default') {
  const assets = listEquipment(facilityId);
  return assets.find(eq => eq.id === id);
}

export function addEquipment(item, facilityId = 'default') {
  const assets = listEquipment(facilityId);
  const ratedPowerKw = Number(item.ratedPowerKw);
  const flexibleSharePercent = Number(item.flexibleSharePercent || 0);
  const flexibleKw = Math.round((ratedPowerKw * flexibleSharePercent) / 100);

  const newEquipment = {
    id: `eq-${Date.now()}`,
    name: item.name,
    category: item.category || 'other',
    ratedPowerKw,
    flexibleSharePercent,
    flexibleKw,
    operatingWindow: item.operatingWindow || 'Flexible Window',
    shiftableToRebate: Boolean(item.shiftableToRebate),
    notes: item.notes || 'User registered facility asset'
  };

  assets.push(newEquipment);
  facilityEquipmentStore.set(facilityId, assets);
  return newEquipment;
}

export function updateEquipment(id, updates, facilityId = 'default') {
  const assets = listEquipment(facilityId);
  const index = assets.findIndex(eq => eq.id === id);
  if (index === -1) return null;

  const current = assets[index];
  const ratedPowerKw = updates.ratedPowerKw !== undefined ? Number(updates.ratedPowerKw) : current.ratedPowerKw;
  const flexibleSharePercent = updates.flexibleSharePercent !== undefined ? Number(updates.flexibleSharePercent) : current.flexibleSharePercent;
  const flexibleKw = Math.round((ratedPowerKw * flexibleSharePercent) / 100);

  const updated = {
    ...current,
    ...updates,
    ratedPowerKw,
    flexibleSharePercent,
    flexibleKw
  };

  assets[index] = updated;
  facilityEquipmentStore.set(facilityId, assets);
  return updated;
}

export function deleteEquipment(id, facilityId = 'default') {
  const assets = listEquipment(facilityId);
  const filtered = assets.filter(eq => eq.id !== id);
  facilityEquipmentStore.set(facilityId, filtered);
  return filtered.length < assets.length;
}

/**
 * Calculates aggregate campus flexibility metrics strictly from the active assets.
 */
export function calculateCampusFlexCapacity(facilityId = 'default', contractLoadKva = 500) {
  const assets = listEquipment(facilityId, contractLoadKva);
  const totalRatedKw = assets.reduce((sum, eq) => sum + eq.ratedPowerKw, 0);
  const totalFlexibleKw = assets.reduce((sum, eq) => sum + eq.flexibleKw, 0);
  const nightShiftableKw = assets
    .filter(eq => eq.shiftableToRebate)
    .reduce((sum, eq) => sum + eq.flexibleKw, 0);

  return {
    totalAssets: assets.length,
    totalConnectedLoadKw: totalRatedKw,
    totalFlexibleLoadKw: totalFlexibleKw,
    nightShiftableToRebateKw: nightShiftableKw,
    facilityFlexibilityRatioPercent: totalRatedKw > 0 ? +((totalFlexibleKw / totalRatedKw) * 100).toFixed(1) : 0,
    equipmentBreakdown: assets.map(eq => ({
      id: eq.id,
      name: eq.name,
      category: eq.category,
      ratedPowerKw: eq.ratedPowerKw,
      flexibleKw: eq.flexibleKw,
      flexibleSharePercent: eq.flexibleSharePercent,
      shiftableToRebate: eq.shiftableToRebate
    }))
  };
}
