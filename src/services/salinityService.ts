/**
 * Sundarbans Sentinel - Salinity Intrusion & Fresh Water Dynamics Service
 * 
 * Analyzes the balance between upstream Ganges-Brahmaputra freshwater discharge
 * (Gorai River gauge) and coastal Bay of Bengal tidal saltwater intrusion,
 * and assesses the resulting "Top-Dying" disease vulnerability in Heritiera fomes (Sundri).
 */

export interface SalinityGaugeStation {
  id: string;
  name: string;
  bengaliName: string;
  river: string;
  coordinates: [number, number]; // [lng, lat]
  currentSalinityPpt: number;
  drySeasonPeakPpt: number;
  monsoonLowPpt: number;
  distanceFromSeaKm: number;
  zoneClassification: 'OLIGOHALINE' | 'MESOHALINE' | 'POLYHALINE';
  topDyingRiskIndex: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface RiverDischargeMonth {
  month: string;
  bengaliMonth: string;
  goraiDischargeM3s: number; // m³/s
  averageDeltaSalinityPpt: number;
  marineIntrusionDistanceKm: number;
  sundriHealthImpact: string;
}

export interface SalinityZoneStats {
  zone: string;
  salinityRange: string;
  areaKm2: number;
  areaPercentage: number;
  dominantSpecies: string[];
  historicalShiftTrend: string;
}

export const GAUGE_STATIONS: SalinityGaugeStation[] = [
  {
    id: 'st-01',
    name: 'Hiron Point (Nilkamal)',
    bengaliName: 'হিরণ পয়েন্ট (নীলকমল)',
    river: 'Passur Estuary Outer Gate',
    coordinates: [89.47, 21.78],
    currentSalinityPpt: 29.8,
    drySeasonPeakPpt: 33.2,
    monsoonLowPpt: 12.5,
    distanceFromSeaKm: 2,
    zoneClassification: 'POLYHALINE',
    topDyingRiskIndex: 'CRITICAL'
  },
  {
    id: 'st-02',
    name: 'Mongla Port (Passur River)',
    bengaliName: 'মংলা বন্দর (পশুর নদী)',
    river: 'Passur River',
    coordinates: [89.60, 22.48],
    currentSalinityPpt: 16.5,
    drySeasonPeakPpt: 24.8,
    monsoonLowPpt: 1.8,
    distanceFromSeaKm: 78,
    zoneClassification: 'MESOHALINE',
    topDyingRiskIndex: 'HIGH'
  },
  {
    id: 'st-03',
    name: 'Sarankhola (Baleshwar River)',
    bengaliName: 'শরণখোলা (বলেশ্বর নদী)',
    river: 'Baleshwar River',
    coordinates: [89.81, 22.28],
    currentSalinityPpt: 4.8,
    drySeasonPeakPpt: 9.5,
    monsoonLowPpt: 0.4,
    distanceFromSeaKm: 55,
    zoneClassification: 'OLIGOHALINE',
    topDyingRiskIndex: 'LOW'
  },
  {
    id: 'st-04',
    name: 'Satkhira (Kobadak / Raymangal)',
    bengaliName: 'সাতক্ষীরা (কপোতাক্ষ ও রায়মঙ্গল)',
    river: 'Raymangal Estuary',
    coordinates: [89.18, 22.15],
    currentSalinityPpt: 24.2,
    drySeasonPeakPpt: 31.0,
    monsoonLowPpt: 8.2,
    distanceFromSeaKm: 32,
    zoneClassification: 'POLYHALINE',
    topDyingRiskIndex: 'HIGH'
  },
  {
    id: 'st-05',
    name: 'Khulna City (Rupsha River)',
    bengaliName: 'খুলনা শহর (রূপসা নদী)',
    river: 'Rupsha-Bhairab River',
    coordinates: [89.57, 22.80],
    currentSalinityPpt: 3.2,
    drySeasonPeakPpt: 8.5,
    monsoonLowPpt: 0.2,
    distanceFromSeaKm: 110,
    zoneClassification: 'OLIGOHALINE',
    topDyingRiskIndex: 'LOW'
  }
];

export const ANNUAL_DISCHARGE_CYCLE: RiverDischargeMonth[] = [
  { month: 'Jan', bengaliMonth: 'জানুয়ারি', goraiDischargeM3s: 180, averageDeltaSalinityPpt: 11.2, marineIntrusionDistanceKm: 65, sundriHealthImpact: 'Normal dormant state' },
  { month: 'Feb', bengaliMonth: 'ফেব্রুয়ারি', goraiDischargeM3s: 95, averageDeltaSalinityPpt: 15.8, marineIntrusionDistanceKm: 78, sundriHealthImpact: 'Mild leaf shedding' },
  { month: 'Mar', bengaliMonth: 'মার্চ', goraiDischargeM3s: 45, averageDeltaSalinityPpt: 21.4, marineIntrusionDistanceKm: 92, sundriHealthImpact: 'Acute osmotic stress; stomata closure' },
  { month: 'Apr', bengaliMonth: 'এপ্রিল', goraiDischargeM3s: 25, averageDeltaSalinityPpt: 26.5, marineIntrusionDistanceKm: 105, sundriHealthImpact: 'Peak Top-Dying vulnerability; gall cankers initiate' },
  { month: 'May', bengaliMonth: 'মে', goraiDischargeM3s: 80, averageDeltaSalinityPpt: 23.0, marineIntrusionDistanceKm: 95, sundriHealthImpact: 'Pre-monsoon cyclonic surge exposure' },
  { month: 'Jun', bengaliMonth: 'জুন', goraiDischargeM3s: 480, averageDeltaSalinityPpt: 14.2, marineIntrusionDistanceKm: 68, sundriHealthImpact: 'Initial rainwater relief and flushing' },
  { month: 'Jul', bengaliMonth: 'জুলাই', goraiDischargeM3s: 1850, averageDeltaSalinityPpt: 6.8, marineIntrusionDistanceKm: 42, sundriHealthImpact: 'Active vegetative growth' },
  { month: 'Aug', bengaliMonth: 'আগস্ট', goraiDischargeM3s: 3400, averageDeltaSalinityPpt: 2.1, marineIntrusionDistanceKm: 20, sundriHealthImpact: 'Optimal freshwater abundance; maximum seed dispersal' },
  { month: 'Sep', bengaliMonth: 'সেপ্টেম্বর', goraiDischargeM3s: 2950, averageDeltaSalinityPpt: 3.5, marineIntrusionDistanceKm: 28, sundriHealthImpact: 'High pneumatophore aeration' },
  { month: 'Oct', bengaliMonth: 'অক্টোবর', goraiDischargeM3s: 1600, averageDeltaSalinityPpt: 5.9, marineIntrusionDistanceKm: 40, sundriHealthImpact: 'Post-monsoon transition' },
  { month: 'Nov', bengaliMonth: 'নভেম্বর', goraiDischargeM3s: 720, averageDeltaSalinityPpt: 8.2, marineIntrusionDistanceKm: 52, sundriHealthImpact: 'Tidal salinity wedge commences northward creep' },
  { month: 'Dec', bengaliMonth: 'ডিসেম্বর', goraiDischargeM3s: 350, averageDeltaSalinityPpt: 9.8, marineIntrusionDistanceKm: 58, sundriHealthImpact: 'Early dry season stabilization' }
];

export const SALINITY_ZONES_SUMMARY: SalinityZoneStats[] = [
  {
    zone: 'Oligohaline (Freshwater Flush)',
    salinityRange: '< 5 ppt',
    areaKm2: 1850,
    areaPercentage: 30.7,
    dominantSpecies: ['Heritiera fomes (Sundri)', 'Nypa fruticans (Golpata)', 'Amoora cucullata (Amur)'],
    historicalShiftTrend: 'Shrinking by ~0.8% annually due to reduced upstream Ganges dry-season flow.'
  },
  {
    zone: 'Mesohaline (Moderately Saline)',
    salinityRange: '5 - 18 ppt',
    areaKm2: 2420,
    areaPercentage: 40.2,
    dominantSpecies: ['Excoecaria agallocha (Gewa)', 'Heritiera fomes (Sundri)', 'Xylocarpus granatum (Dhundul)'],
    historicalShiftTrend: 'Expanding northward into formerly freshwater sectors; Gewa replacing Sundri.'
  },
  {
    zone: 'Polyhaline (Hyper-Saline Marine)',
    salinityRange: '> 18 ppt',
    areaKm2: 1747,
    areaPercentage: 29.1,
    dominantSpecies: ['Ceriops decandra (Goran)', 'Avicennia marina (Baen)', 'Aegiceras corniculatum (Khalsi)'],
    historicalShiftTrend: 'Migrated 28 km deeper inland since 1980 baseline surveys.'
  }
];

export class SalinityService {
  public static getStations(): SalinityGaugeStation[] {
    return GAUGE_STATIONS;
  }

  public static getAnnualCycle(): RiverDischargeMonth[] {
    return ANNUAL_DISCHARGE_CYCLE;
  }

  public static getZoneStats(): SalinityZoneStats[] {
    return SALINITY_ZONES_SUMMARY;
  }

  /**
   * Calculate simulated salinity based on user-adjusted upstream discharge
   */
  public static simulateIntrusion(goraiFlowM3s: number): {
    salinityAtMongla: number;
    salinityAtHironPoint: number;
    inlandPenetrationKm: number;
    topDyingRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    interpretation: string;
  } {
    // Inverse power relationship between freshwater flow and salinity penetration
    const normalizedFlow = Math.max(10, goraiFlowM3s);
    const penetrationKm = Math.min(125, Math.round(135 - (Math.log10(normalizedFlow) * 28)));
    
    // Salinity at Mongla Port
    const monglaSalinity = Number(Math.max(1.0, Math.min(30.0, 32.0 - (Math.log10(normalizedFlow) * 7.5))).toFixed(1));
    
    // Seaward salinity remains higher
    const hironPointSalinity = Number(Math.max(12.0, Math.min(34.0, 35.0 - (Math.log10(normalizedFlow) * 4.2))).toFixed(1));

    let risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let interp = '';

    if (monglaSalinity >= 22.0) {
      risk = 'CRITICAL';
      interp = 'Severe upstream freshwater deficit (<100 m³/s). Saline wedge reaches deep into Khulna/Rupsha; extensive Heritiera fomes (Sundri) vascular top-dying and root choking triggered.';
    } else if (monglaSalinity >= 15.0) {
      risk = 'HIGH';
      interp = 'Moderate dry season stress. Sundri stands experience osmotic strain; halophytic pioneer species (Gewa/Goran) outcompete freshwater mangrove saplings.';
    } else if (monglaSalinity >= 8.0) {
      risk = 'MODERATE';
      interp = 'Transition flow balance. Tidal fluctuations maintain typical mesohaline buffer; minimal crown defoliation.';
    } else {
      risk = 'LOW';
      interp = 'Strong monsoon or post-monsoon freshwater flush (>1500 m³/s). Ocean wedge repelled past coastal arc; optimal mangrove regeneration and nutrient deposition.';
    }

    return {
      salinityAtMongla: monglaSalinity,
      salinityAtHironPoint: hironPointSalinity,
      inlandPenetrationKm: penetrationKm,
      topDyingRisk: risk,
      interpretation: interp
    };
  }
}
