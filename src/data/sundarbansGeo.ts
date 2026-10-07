/**
 * Sundarbans Geospatial Coordinates & Monitoring Zones
 * Accurate coordinates for the Ganges-Brahmaputra-Meghna delta mangrove complex.
 * Bounding Box: ~ [88.8°E, 21.5°N] to [90.0°E, 22.6°N]
 */

import type { MonitoringZone } from '../types/index.ts';

export const SUNDARBANS_CENTER: [number, number] = [89.55, 22.05];
export const SUNDARBANS_BOUNDS: [[number, number], [number, number]] = [
  [88.8, 21.45], // SW
  [90.15, 22.65], // NE
];

export const MONITORING_ZONES: MonitoringZone[] = [
  {
    id: 'western-satkhira',
    name: 'Western Sundarbans (Satkhira Range)',
    bengaliName: 'পশ্চিম সুন্দরবন (সাতক্ষীরা রেঞ্জ)',
    range: 'Satkhira Wildlife Sanctuary & Raimangal Border',
    areaKm2: 1820,
    center: [89.15, 22.12],
    description: 'Bordering the Raimangal and Hariabhanga rivers adjacent to Indian Sundarbans National Park. Characterized by high salinity mangrove species (Excoecaria agallocha, Avicennia marina).',
    keyFeatures: ['Raimangal border river', 'High salinity gradient', 'Malancha River system'],
    coordinates: [
      [
        [88.95, 22.28],
        [89.32, 22.28],
        [89.35, 21.95],
        [89.05, 21.85],
        [88.92, 22.02],
        [88.95, 22.28]
      ]
    ]
  },
  {
    id: 'central-khulna',
    name: 'Central Sundarbans (Khulna Range)',
    bengaliName: 'মধ্য সুন্দরবন (খুলনা রেঞ্জ)',
    range: 'Sundarbans South & Wildlife Corridor',
    areaKm2: 2150,
    center: [89.52, 22.08],
    description: 'Heart of the mangrove forest, comprising major Royal Bengal Tiger (Panthera tigris) territories and dense Sundri (Heritiera fomes) and Gewa stands along the Sibsa River network.',
    keyFeatures: ['Sibsa River Network', 'Sundri Tree Core Zone', 'Bengal Tiger Corridor'],
    coordinates: [
      [
        [89.35, 22.32],
        [89.70, 22.32],
        [89.72, 21.90],
        [89.35, 21.95],
        [89.35, 22.32]
      ]
    ]
  },
  {
    id: 'eastern-sarankhola',
    name: 'Eastern Sundarbans (Sarankhola & Chandpai)',
    bengaliName: 'পূর্ব সুন্দরবন (শরণখোলা ও চাঁদপাই রেঞ্জ)',
    range: 'Chandpai & Sarankhola Ranges',
    areaKm2: 2410,
    center: [89.82, 22.15],
    description: 'Receives the highest freshwater flow from the Baleswar/Gorai river systems. Prime habitat for endangered Irrawaddy and Ganges river dolphins, and critical fisheries.',
    keyFeatures: ['Baleswar River Estuary', 'Freshwater zone', 'Dolphin Sanctuary corridors'],
    coordinates: [
      [
        [89.70, 22.35],
        [90.05, 22.35],
        [90.05, 21.95],
        [89.72, 21.90],
        [89.70, 22.35]
      ]
    ]
  },
  {
    id: 'coastal-bay',
    name: 'Coastal Barrier & Island Zone',
    bengaliName: 'উপকূলীয় দ্বীপ ও মোহনা অঞ্চল',
    range: 'Dublar Char, Mandarbaria & Katka Seaward Rim',
    areaKm2: 1680,
    center: [89.55, 21.72],
    description: 'The seaward fringe directly facing the Bay of Bengal. Absorbs primary cyclonic kinetic energy and tidal surges; subject to severe shoreline dynamics, erosion, and sediment deposition.',
    keyFeatures: ['Dublar Char Island', 'Katka Beach ecosystem', 'First line of cyclone barrier'],
    coordinates: [
      [
        [88.98, 21.85],
        [90.02, 21.95],
        [89.95, 21.55],
        [89.35, 21.52],
        [88.98, 21.85]
      ]
    ]
  },
  {
    id: 'river-estuary-passur',
    name: 'Passur-Sibsa River & Estuary Network',
    bengaliName: 'পশুর-শিবসা নদী ও মোহনা প্রণালী',
    range: 'Mongla Shipping Channel & Estuarine Waters',
    areaKm2: 1940,
    center: [89.62, 22.28],
    description: 'Crucial estuarine waterway connecting Mongla Port to the Bay of Bengal. Monitored for sediment turbidity, industrial shipping plumes, and seasonal tidal salinity intrusion.',
    keyFeatures: ['Mongla shipping artery', 'High tidal flux', 'Sediment & salinity dynamic zone'],
    coordinates: [
      [
        [89.48, 22.50],
        [89.75, 22.50],
        [89.70, 22.15],
        [89.45, 22.15],
        [89.48, 22.50]
      ]
    ]
  }
];

// GeoJSON for Bangladesh-India Border across Sundarbans
export const INTERNATIONAL_BORDER_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Bangladesh-India Border (Sundarbans Sector)',
        description: 'International riverine boundary demarcated along the Hariabhanga and Raimangal rivers.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [88.98, 22.55],
          [88.96, 22.40],
          [88.95, 22.25],
          [88.96, 22.10],
          [89.02, 21.92],
          [89.06, 21.78],
          [89.12, 21.55]
        ]
      }
    }
  ]
};

// GeoJSON for the World Heritage Sundarbans Reserve Forest Boundary
export const SUNDARBANS_OUTLINE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Sundarbans Reserve Forest (Bangladesh)',
        status: 'UNESCO World Heritage Site (1997)'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.95, 22.30],
            [89.20, 22.35],
            [89.50, 22.45],
            [89.80, 22.42],
            [90.05, 22.38],
            [90.08, 22.10],
            [90.00, 21.75],
            [89.70, 21.58],
            [89.30, 21.54],
            [89.02, 21.75],
            [88.95, 22.05],
            [88.95, 22.30]
          ]
        ]
      }
    }
  ]
};

// Convert Zones into GeoJSON FeatureCollection
export function getMonitoringZonesGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: MONITORING_ZONES.map(zone => ({
      type: 'Feature',
      id: zone.id,
      properties: {
        id: zone.id,
        name: zone.name,
        bengaliName: zone.bengaliName,
        range: zone.range,
        areaKm2: zone.areaKm2,
        center: zone.center,
        description: zone.description
      },
      geometry: {
        type: 'Polygon',
        coordinates: zone.coordinates
      }
    }))
  };
}
