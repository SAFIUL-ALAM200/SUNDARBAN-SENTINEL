/**
 * Sundarbans Sentinel - Community Science & Ground-Truthing Service
 * 
 * Provides an in-situ data collection pipeline for field rangers, local NGOs,
 * and scientific researchers to upload geotagged field reports, and cross-validates
 * them against satellite-derived optical, radar, and thermal anomalies.
 */

export type ObservationCategory = 
  | 'CANOPY_DAMAGE' 
  | 'SALINITY_CHECK' 
  | 'WILDLIFE_SIGHTING' 
  | 'WATER_INUNDATION' 
  | 'ILLEGAL_FELLING'
  | 'OIL_SPILL_HAZARD';

export type ValidationStatus = 
  | 'CONFIRMED_BY_SATELLITE' 
  | 'FALSE_ALARM_CLOUD_SHADOW' 
  | 'SUBPIXEL_CLEARANCE_DETECTED' 
  | 'PENDING_NEXT_OVERPASS';

export interface FieldObservation {
  id: string;
  reporterName: string;
  reporterRole: 'FOREST_RANGER' | 'WILDLIFE_BIOLOGIST' | 'NGO_FIELD_OFFICER' | 'COMMUNITY_BAWALI';
  badgeNumber?: string;
  timestamp: string;
  zoneId: string;
  zoneName: string;
  coordinates: [number, number]; // [lng, lat]
  category: ObservationCategory;
  title: string;
  description: string;
  measuredSalinityPpt?: number; // In-situ refractometer reading
  photoUrl?: string;
  validationStatus: ValidationStatus;
  validationNotes: string;
  satelliteConfidenceScore: number; // 0 - 100%
  crossReferencedSatelliteProduct?: string;
}

const STORAGE_KEY = 'sundarbans_sentinel_ground_truth_v1';

export const INITIAL_FIELD_OBSERVATIONS: FieldObservation[] = [
  {
    id: 'gt-001',
    reporterName: 'Forester Rafiqul Islam',
    reporterRole: 'FOREST_RANGER',
    badgeNumber: 'BFD-KHU-409',
    timestamp: '2026-09-28T09:15:00Z',
    zoneId: 'dublar-char',
    zoneName: 'Dublar Char Outer Coast',
    coordinates: [89.54, 21.75],
    category: 'SALINITY_CHECK',
    title: 'High Salinity Intrusion at Meher Ali Khal',
    description: 'Manual refractometer test showed 28.4 ppt salinity during low ebb tide. Significant leaf yellowing observed in young Sundri seedlings along tidal bank.',
    measuredSalinityPpt: 28.4,
    validationStatus: 'CONFIRMED_BY_SATELLITE',
    validationNotes: 'Cross-validated with Landsat 9 surface water reflectance: High salt stress matches NDWI -0.18 anomaly detected on 2026-09-27.',
    satelliteConfidenceScore: 94,
    crossReferencedSatelliteProduct: 'Landsat 9 OLI-2 / MOD11A2'
  },
  {
    id: 'gt-002',
    reporterName: 'Dr. Nusrat Jahan',
    reporterRole: 'WILDLIFE_BIOLOGIST',
    badgeNumber: 'WCS-BD-08',
    timestamp: '2026-09-26T14:40:00Z',
    zoneId: 'sarankhola-east',
    zoneName: 'Sarankhola Wildlife Sanctuary',
    coordinates: [89.82, 22.18],
    category: 'CANOPY_DAMAGE',
    title: 'Crown Branch Dieback in Heritiera fomes Stand',
    description: 'Ground survey revealed top-dying symptoms across ~12 hectares. Tree crowns withered with gall mite infestation and hyper-salinized soil crust.',
    validationStatus: 'CONFIRMED_BY_SATELLITE',
    validationNotes: 'Confirmed by MODIS 250m NDVI z-score (-2.41 sigma drop). Ground report accurately identified epicenter.',
    satelliteConfidenceScore: 98,
    crossReferencedSatelliteProduct: 'MOD13Q1 250m NDVI 16-Day'
  },
  {
    id: 'gt-003',
    reporterName: 'Anowar Hossain (Bawali)',
    reporterRole: 'COMMUNITY_BAWALI',
    timestamp: '2026-09-24T11:20:00Z',
    zoneId: 'satkhira-west',
    zoneName: 'Satkhira Tiger Habitat',
    coordinates: [89.15, 22.25],
    category: 'WILDLIFE_SIGHTING',
    title: 'Female Bengal Tiger with 2 Cubs at Malancha River Bank',
    description: 'Healthy adult tigress sighted drinking from temporary rainwater depression. Mud pugmarks clear; no signs of saline distress.',
    validationStatus: 'CONFIRMED_BY_SATELLITE',
    validationNotes: 'Habitat corridor confirmed intact. Radar Sentinel-1 SAR backscatter shows dense canopy cover and undisturbed riverbank vegetation.',
    satelliteConfidenceScore: 91,
    crossReferencedSatelliteProduct: 'Sentinel-1 C-Band SAR'
  },
  {
    id: 'gt-004',
    reporterName: 'Ranger Tanvir Ahmed',
    reporterRole: 'FOREST_RANGER',
    badgeNumber: 'BFD-SAT-112',
    timestamp: '2026-09-20T16:05:00Z',
    zoneId: 'central-khulna',
    zoneName: 'Central Sundarbans',
    coordinates: [89.48, 22.05],
    category: 'CANOPY_DAMAGE',
    title: 'Reported Canopy Darkening Near Sibsa Tributary',
    description: 'Field inspection confirmed canopy is 100% healthy. Dark signature was caused by transient heavy cumulus cloud shadows during 10:30 AM satellite overpass.',
    validationStatus: 'FALSE_ALARM_CLOUD_SHADOW',
    validationNotes: 'Ranger verified no canopy damage. Reclassified satellite anomaly as Cloud/Atmospheric artifact. Training weights updated.',
    satelliteConfidenceScore: 89,
    crossReferencedSatelliteProduct: 'VIIRS Surface Reflectance QA Flag'
  },
  {
    id: 'gt-005',
    reporterName: 'Kazi Mahbub (Coast Trust)',
    reporterRole: 'NGO_FIELD_OFFICER',
    timestamp: '2026-09-18T08:30:00Z',
    zoneId: 'passur-sibsa',
    zoneName: 'Passur-Sibsa Estuary',
    coordinates: [89.62, 22.12],
    category: 'WATER_INUNDATION',
    title: 'Embankment Seepage & Salt Flat Encroachment',
    description: 'Post-high tide water logging trapped behind silted river dyke. Saline water stagnant for 72 hours; risk of soil salinization.',
    measuredSalinityPpt: 22.1,
    validationStatus: 'CONFIRMED_BY_SATELLITE',
    validationNotes: 'Sentinel-2 Water Index (NDWI) verified permanent water boundary expansion by 0.85 km².',
    satelliteConfidenceScore: 96,
    crossReferencedSatelliteProduct: 'Sentinel-2 MSI Level-2A'
  }
];

export class GroundTruthService {
  /**
   * Retrieve all observations (including user additions)
   */
  public static getObservations(): FieldObservation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load observations from localStorage:', e);
    }
    return INITIAL_FIELD_OBSERVATIONS;
  }

  /**
   * Save a new observation and run satellite cross-validation logic
   */
  public static addObservation(obs: Omit<FieldObservation, 'id' | 'timestamp' | 'validationStatus' | 'validationNotes' | 'satelliteConfidenceScore'>): FieldObservation {
    const all = this.getObservations();

    // Automated cross-validation simulation
    let status: ValidationStatus = 'CONFIRMED_BY_SATELLITE';
    let notes = 'Validated against current Landsat/Sentinel-2 reflectance models. Ground coordinates match multispectral delta-variance.';
    let score = Math.floor(88 + Math.random() * 11);

    if (obs.category === 'CANOPY_DAMAGE' && Math.random() > 0.75) {
      status = 'FALSE_ALARM_CLOUD_SHADOW';
      notes = 'Ground report indicates canopy intact. System classified satellite delta as transient cloud/shadow artifact.';
      score = 85;
    } else if (obs.category === 'ILLEGAL_FELLING') {
      status = 'SUBPIXEL_CLEARANCE_DETECTED';
      notes = 'Report logged as sub-pixel disturbance (<30m canopy gap). Flagged for automated high-resolution tasking.';
      score = 92;
    }

    const newObservation: FieldObservation = {
      ...obs,
      id: `gt-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      validationStatus: status,
      validationNotes: notes,
      satelliteConfidenceScore: score,
      crossReferencedSatelliteProduct: 'Sentinel-2 & Landsat 9 Multi-Sensor Blend'
    };

    all.unshift(newObservation);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Failed to persist observation:', e);
    }

    return newObservation;
  }

  /**
   * Reset to initial dataset
   */
  public static resetObservations(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
