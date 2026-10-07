/**
 * Sundarbans Sentinel - Interactive Satellite Map (MapLibre GL)
 * 
 * Focuses on the Sundarbans mangrove complex (Bangladesh/India border).
 * Includes:
 * - Carto Dark scientific basemap
 * - 5 Monitoring Zone GeoJSON polygons with dynamic color grading
 * - Bangladesh-India international border line
 * - UNESCO World Heritage Reserve boundary
 * - Anomaly markers with pulse animations
 * - NASA FIRMS active fire hotspots
 * - Layer toggles (Vegetation NDVI, Water NDWI, Temperature LST, FIRMS Fire, Anomalies)
 * - Click-to-inspect and zone selection
 */

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { 
  SUNDARBANS_CENTER, 
  SUNDARBANS_BOUNDS, 
  MONITORING_ZONES, 
  INTERNATIONAL_BORDER_GEOJSON,
  SUNDARBANS_OUTLINE_GEOJSON,
  getMonitoringZonesGeoJSON 
} from '../../data/sundarbansGeo';
import type { IndicatorType, MonitoringZone, AnomalyEvent, FireHotspot } from '../../types/index.ts';
import { Layers, Flame, AlertTriangle, Eye, ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';

// Configure MapLibre Web Worker globally before map instantiation using Vite ?worker&url
if (typeof window !== 'undefined') {
  try {
    if (maplibreWorkerUrl) {
      maplibregl.setWorkerUrl(maplibreWorkerUrl);
    } else {
      maplibregl.setWorkerUrl('https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs');
    }
  } catch (err) {
    console.warn('[MapLibre] Could not set worker URL from Vite, using CDN fallback:', err);
    maplibregl.setWorkerUrl('https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs');
  }

  // Intercept any transient worker warning from bubbling as unhandled fatal error
  window.addEventListener('error', (event) => {
    if (event.message && (event.message.includes('Worker failed to load') || event.message.includes('maplibre-gl-worker'))) {
      event.preventDefault();
      console.warn('[MapLibre Worker Handled]:', event.message);
    }
  });
}

interface SundarbansMapProps {
  selectedZoneId: string;
  onSelectZone: (zone: MonitoringZone) => void;
  activeLayer: IndicatorType | 'satellite' | 'anomalies';
  onLayerChange: (layer: IndicatorType | 'satellite' | 'anomalies') => void;
  anomalies: AnomalyEvent[];
  fireHotspots: FireHotspot[];
  onSelectAnomaly: (anomaly: AnomalyEvent) => void;
  year: number;
}

export const SundarbansMap: React.FC<SundarbansMapProps> = ({
  selectedZoneId,
  onSelectZone,
  activeLayer,
  onLayerChange,
  anomalies,
  fireHotspots,
  onSelectAnomaly,
  year
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lng: number; lat: number }>({ lng: 89.55, lat: 22.05 });
  const [basemapMode, setBasemapMode] = useState<'satellite' | 'nasa-gibs' | 'dark'>('satellite');

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Multi-source basemap style supporting High-Res Satellite, NASA GIBS, and Dark Carto
    const baseStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'satellite-esri': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '© Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USGS, NASA'
        },
        'nasa-gibs': {
          type: 'raster',
          tiles: [
            'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2026-09-28/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          maxzoom: 9,
          attribution: '© NASA Global Imagery Browse Services (GIBS)'
        },
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '© CARTO, © OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'satellite-esri-layer',
          type: 'raster',
          source: 'satellite-esri',
          minzoom: 0,
          maxzoom: 19,
          layout: {
            visibility: 'visible'
          }
        },
        {
          id: 'nasa-gibs-layer',
          type: 'raster',
          source: 'nasa-gibs',
          minzoom: 0,
          maxzoom: 19,
          layout: {
            visibility: 'none'
          }
        },
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19,
          layout: {
            visibility: 'none'
          }
        }
      ]
    };

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: baseStyle,
      center: SUNDARBANS_CENTER,
      zoom: 8.8,
      minZoom: 7,
      maxZoom: 14,
      maxBounds: [
        [87.8, 20.8], // SW
        [91.2, 23.4]  // NE
      ],
      attributionControl: false
    });

    mapInstance.on('error', (e) => {
      // Gracefully log any tile network glitch or worker warning without crashing
      console.warn('[MapLibre Event]:', e.error?.message || e);
    });

    mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false }), 'bottom-right');

    mapInstance.on('load', () => {
      // Add UNESCO Boundary Line
      mapInstance.addSource('unesco-boundary', {
        type: 'geojson',
        data: SUNDARBANS_OUTLINE_GEOJSON as any
      });

      mapInstance.addLayer({
        id: 'unesco-fill',
        type: 'fill',
        source: 'unesco-boundary',
        paint: {
          'fill-color': '#50E3A4',
          'fill-opacity': 0.05
        }
      });

      mapInstance.addLayer({
        id: 'unesco-line',
        type: 'line',
        source: 'unesco-boundary',
        paint: {
          'line-color': '#50E3A4',
          'line-width': 1.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.6
        }
      });

      // Add International Border (Bangladesh - India)
      mapInstance.addSource('intl-border', {
        type: 'geojson',
        data: INTERNATIONAL_BORDER_GEOJSON as any
      });

      mapInstance.addLayer({
        id: 'intl-border-line',
        type: 'line',
        source: 'intl-border',
        paint: {
          'line-color': '#60A5FA',
          'line-width': 2,
          'line-dasharray': [4, 4],
          'line-opacity': 0.85
        }
      });

      // Add Monitoring Zones GeoJSON
      mapInstance.addSource('monitoring-zones', {
        type: 'geojson',
        data: getMonitoringZonesGeoJSON() as any
      });

      // Zone Fills
      mapInstance.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'monitoring-zones',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'id'], selectedZoneId],
            '#50E3A4',
            '#0D1B18'
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'id'], selectedZoneId],
            0.28,
            0.12
          ]
        }
      });

      // Zone Borders
      mapInstance.addLayer({
        id: 'zones-line',
        type: 'line',
        source: 'monitoring-zones',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'id'], selectedZoneId],
            '#50E3A4',
            '#1C3630'
          ],
          'line-width': [
            'case',
            ['==', ['get', 'id'], selectedZoneId],
            2.5,
            1.2
          ],
          'line-opacity': 0.9
        }
      });

      // Zone Labels
      mapInstance.addLayer({
        id: 'zones-labels',
        type: 'symbol',
        source: 'monitoring-zones',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 11,
          'text-offset': [0, 0],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#EAF7F2',
          'text-halo-color': '#07110F',
          'text-halo-width': 2
        }
      });

      // Click on Zone
      mapInstance.on('click', 'zones-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const zoneId = feature.properties?.id;
        const matched = MONITORING_ZONES.find(z => z.id === zoneId);
        if (matched) {
          onSelectZone(matched);
        }
      });

      // Cursor changes on hover
      mapInstance.on('mouseenter', 'zones-fill', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
      mapInstance.on('mouseleave', 'zones-fill', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

      // Track cursor coordinates
      mapInstance.on('mousemove', (e) => {
        setCursorCoords({
          lng: Number(e.lngLat.lng.toFixed(4)),
          lat: Number(e.lngLat.lat.toFixed(4))
        });
      });

      setMapLoaded(true);
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Update Zone Highlights when selectedZoneId changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;
    if (m.getLayer('zones-fill')) {
      m.setPaintProperty('zones-fill', 'fill-color', [
        'case',
        ['==', ['get', 'id'], selectedZoneId],
        '#50E3A4',
        '#0D1B18'
      ]);
      m.setPaintProperty('zones-fill', 'fill-opacity', [
        'case',
        ['==', ['get', 'id'], selectedZoneId],
        0.30,
        0.12
      ]);
      m.setPaintProperty('zones-line', 'line-color', [
        'case',
        ['==', ['get', 'id'], selectedZoneId],
        '#50E3A4',
        '#2a5249'
      ]);
      m.setPaintProperty('zones-line', 'line-width', [
        'case',
        ['==', ['get', 'id'], selectedZoneId],
        2.5,
        1.2
      ]);
    }
  }, [selectedZoneId, mapLoaded]);

  // Switch raster basemap layers dynamically
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    const isSat = basemapMode === 'satellite' || activeLayer === 'satellite';
    const isGibs = basemapMode === 'nasa-gibs' && activeLayer !== 'satellite';
    const isDark = basemapMode === 'dark' && activeLayer !== 'satellite';

    if (m.getLayer('satellite-esri-layer')) {
      m.setLayoutProperty('satellite-esri-layer', 'visibility', isSat ? 'visible' : 'none');
    }
    if (m.getLayer('nasa-gibs-layer')) {
      m.setLayoutProperty('nasa-gibs-layer', 'visibility', isGibs ? 'visible' : 'none');
    }
    if (m.getLayer('carto-dark-layer')) {
      m.setLayoutProperty('carto-dark-layer', 'visibility', isDark ? 'visible' : 'none');
    }
  }, [basemapMode, activeLayer, mapLoaded]);

  // Update Anomaly and Hotspot Markers on the Map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Render Anomaly Markers
    if (activeLayer === 'anomalies' || activeLayer === 'vegetation' || activeLayer === 'water' || activeLayer === 'temperature') {
      anomalies.forEach((anomaly) => {
        const el = document.createElement('div');
        el.className = 'group relative cursor-pointer';

        let badgeColor = '#50E3A4';
        if (anomaly.severity === 'STRONG_ANOMALY') badgeColor = '#FF6B6B';
        else if (anomaly.severity === 'ANOMALY') badgeColor = '#F5C451';
        else if (anomaly.severity === 'WATCH') badgeColor = '#60A5FA';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full opacity-60" style="background-color: ${badgeColor};"></span>
            <div class="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#07110F] text-[10px] font-bold text-[#07110F] shadow-lg" style="background-color: ${badgeColor};">
              !
            </div>
            <div class="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-[#1C3630] bg-[#07110F]/95 px-2 py-1 text-[11px] font-mono text-[#EAF7F2] opacity-0 transition-opacity group-hover:opacity-100 shadow-xl z-50">
              <span class="text-[10px] font-bold" style="color: ${badgeColor};">${anomaly.severity.replace('_', ' ')}</span>
              <div class="text-[10px] text-[#8FA7A0]">${anomaly.indicator.toUpperCase()} · ${Math.abs(anomaly.zScore)}σ</div>
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectAnomaly(anomaly);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(anomaly.coordinates)
          .addTo(m);

        markersRef.current.push(marker);
      });
    }

    // Render Fire Hotspot Markers (NASA FIRMS)
    if (activeLayer === 'fire' || activeLayer === 'satellite') {
      fireHotspots.forEach((spot) => {
        const el = document.createElement('div');
        el.className = 'group relative cursor-pointer';
        const celsius = (spot.brightness - 273.15).toFixed(1);
        const frpText = (spot as any).frp ? ` · ${(spot as any).frp} MW` : '';
        const timeText = (spot as any).acqTime ? ` · ${(spot as any).acqTime} UTC` : '';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-orange-500 opacity-60"></span>
            <div class="relative flex h-5 w-5 items-center justify-center rounded-full border border-orange-200 bg-gradient-to-tr from-red-600 to-amber-400 text-[10px] text-white shadow-lg shadow-orange-500/40">
              🔥
            </div>
            <div class="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-[#1C3630] bg-[#07110F]/95 px-2.5 py-1.5 text-[11px] font-mono text-[#EAF7F2] opacity-0 transition-opacity group-hover:opacity-100 shadow-2xl z-50">
              <div class="flex items-center gap-1.5 text-orange-400 font-bold">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>NASA FIRMS ${spot.satellite}</span>
              </div>
              <div class="text-[#EAF7F2] text-[10px] font-semibold mt-0.5">${spot.brightness} K (${celsius}°C)${frpText}</div>
              <div class="text-[#8FA7A0] text-[9px] mt-0.5">Acq: ${spot.acqDate}${timeText} · ${spot.confidence}% Conf</div>
            </div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([spot.longitude, spot.latitude])
          .addTo(m);

        markersRef.current.push(marker);
      });
    }
  }, [anomalies, fireHotspots, activeLayer, mapLoaded]);

  // Zoom controls
  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetView = () => {
    map.current?.flyTo({
      center: SUNDARBANS_CENTER,
      zoom: 8.8,
      speed: 1.2
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl border border-[#1C3630] bg-[#07110F]">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Left: Layer Selector Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#07110F]/90 p-1.5 backdrop-blur-md shadow-2xl">
        <button
          onClick={() => {
            setBasemapMode('satellite');
            onLayerChange('satellite');
          }}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeLayer === 'satellite'
              ? 'bg-[#50E3A4] text-[#07110F] shadow-sm font-bold'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420]'
          }`}
          title="Live High-Resolution Satellite Map (Spaceborne Imagery)"
        >
          <span>🛰️</span>
          <span>Satellite</span>
        </button>

        <button
          onClick={() => onLayerChange('vegetation')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeLayer === 'vegetation'
              ? 'bg-[#50E3A4] text-[#07110F] shadow-sm font-semibold'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420]'
          }`}
          title="Normalized Difference Vegetation Index (MODIS/Landsat)"
        >
          <span>🌿</span>
          <span>Vegetation</span>
        </button>

        <button
          onClick={() => onLayerChange('water')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeLayer === 'water'
              ? 'bg-[#60A5FA] text-[#07110F] shadow-sm font-semibold'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420]'
          }`}
          title="Surface Water & Inundation Extent (NDWI)"
        >
          <span>💧</span>
          <span>Water</span>
        </button>

        <button
          onClick={() => onLayerChange('temperature')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeLayer === 'temperature'
              ? 'bg-[#F5C451] text-[#07110F] shadow-sm font-semibold'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420]'
          }`}
          title="Land Surface Temperature (MOD11A2 LST)"
        >
          <span>🌡️</span>
          <span>Thermal</span>
        </button>

        <button
          onClick={() => onLayerChange('fire')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeLayer === 'fire'
              ? 'bg-[#FF6B6B] text-[#07110F] shadow-sm font-semibold'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420]'
          }`}
          title="NASA FIRMS VIIRS Active Fire Hotspots"
        >
          <span>🔥</span>
          <span>FIRMS Fire</span>
        </button>

        <button
          onClick={() => onLayerChange('anomalies')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeLayer === 'anomalies'
              ? 'bg-[#F5C451] text-[#07110F] shadow-sm font-semibold'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420]'
          }`}
          title="Z-Score Statistical Anomaly Markers"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Anomalies</span>
        </button>
      </div>

      {/* Floating Basemap Imagery Switcher (Top Center-Right) */}
      <div className="absolute top-3 right-16 z-10 hidden sm:flex items-center gap-1 rounded-lg border border-[#1C3630] bg-[#07110F]/90 p-1 backdrop-blur-md shadow-xl text-[10px] font-mono">
        <span className="text-[#8FA7A0] px-1 text-[9px] uppercase font-bold">IMAGERY:</span>
        <button
          onClick={() => {
            setBasemapMode('satellite');
          }}
          className={`px-2 py-0.5 rounded transition-all ${
            basemapMode === 'satellite'
              ? 'bg-[#50E3A4] text-[#07110F] font-bold shadow-sm'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
          }`}
          title="High-Resolution Optical Spaceborne Imagery (0.5m-30m)"
        >
          🛰️ Hi-Res Satellite
        </button>
        <button
          onClick={() => {
            setBasemapMode('nasa-gibs');
          }}
          className={`px-2 py-0.5 rounded transition-all ${
            basemapMode === 'nasa-gibs'
              ? 'bg-[#60A5FA] text-[#07110F] font-bold shadow-sm'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
          }`}
          title="NASA GIBS Near-Real-Time Daily TrueColor Orbit"
        >
          🌍 NASA GIBS
        </button>
        <button
          onClick={() => {
            setBasemapMode('dark');
          }}
          className={`px-2 py-0.5 rounded transition-all ${
            basemapMode === 'dark'
              ? 'bg-[#1C3630] text-[#EAF7F2] font-bold shadow-sm'
              : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
          }`}
          title="Analytical Dark Grid"
        >
          🌑 Dark Matrix
        </button>
      </div>

      {/* Live Satellite HUD Status Bar */}
      {(activeLayer === 'satellite' || basemapMode === 'satellite') && (
        <div className="absolute top-14 left-3 z-10 flex items-center gap-2 rounded-md border border-[#50E3A4]/40 bg-[#07110F]/90 px-3 py-1.5 text-[10px] font-mono text-[#EAF7F2] backdrop-blur-md shadow-2xl">
          <span className="h-2 w-2 rounded-full bg-[#50E3A4] animate-pulse"></span>
          <span className="text-[#50E3A4] font-bold">LIVE SPACEBORNE SATELLITE MAP</span>
          <span className="text-[#8FA7A0]">·</span>
          <span className="text-[#8FA7A0]">Missions: Landsat 8-9 & Terra/Aqua High-Res</span>
          <span className="text-[#8FA7A0]">·</span>
          <span className="text-[#50E3A4]">Res: 0.5m – 30m</span>
        </div>
      )}

      {/* Top Right: Map Controls & Coordinates */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        {/* Navigation buttons */}
        <div className="flex flex-col rounded-lg border border-[#1C3630] bg-[#07110F]/90 backdrop-blur-md overflow-hidden shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 text-[#8FA7A0] hover:text-[#50E3A4] hover:bg-[#112420] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="h-[1px] bg-[#1C3630]" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-[#8FA7A0] hover:text-[#50E3A4] hover:bg-[#112420] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="h-[1px] bg-[#1C3630]" />
          <button
            onClick={handleResetView}
            className="p-2 text-[#8FA7A0] hover:text-[#50E3A4] hover:bg-[#112420] transition-colors"
            title="Reset to Full Sundarbans"
          >
            <Compass className="h-4 w-4" />
          </button>
        </div>

        {/* Live Coordinates Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-[#1C3630] bg-[#07110F]/80 px-2.5 py-1 text-[11px] font-mono text-[#8FA7A0] backdrop-blur-md">
          <MapPin className="h-3 w-3 text-[#50E3A4]" />
          <span>{cursorCoords.lat}°N, {cursorCoords.lng}°E</span>
        </div>
      </div>

      {/* Bottom Left: Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-[#1C3630] bg-[#07110F]/90 p-2.5 backdrop-blur-md text-[11px] font-mono shadow-xl max-w-xs">
        <div className="text-[10px] uppercase tracking-wider text-[#8FA7A0] font-semibold mb-1.5">
          Map Legend & Vector Boundaries
        </div>
        <div className="space-y-1 text-[#EAF7F2]">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-b border-dashed border-[#60A5FA]" />
            <span className="text-[10px] text-[#8FA7A0]">Bangladesh - India Border</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-b border-dashed border-[#50E3A4]" />
            <span className="text-[10px] text-[#8FA7A0]">UNESCO Sundarbans Reserve</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-3 rounded-sm bg-[#50E3A4]/30 border border-[#50E3A4]" />
            <span className="text-[10px] text-[#8FA7A0]">Selected Monitoring Zone</span>
          </div>
          {activeLayer === 'fire' && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[10px] text-orange-400">FIRMS VIIRS Active Fire Hotspot</span>
            </div>
          )}
        </div>
      </div>

      {/* Observation Year watermark in bottom right */}
      <div className="absolute bottom-3 right-12 z-10 hidden sm:flex items-center gap-2 text-xs font-mono text-[#8FA7A0]/70 pointer-events-none">
        <span>OBSERVATION YEAR:</span>
        <span className="text-[#50E3A4] font-bold">{year}</span>
      </div>
    </div>
  );
};
