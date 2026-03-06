'use client';

import { useEffect, useRef, useState } from 'react';
import routeData from './routeData.json';

export default function RouteMapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [activeWaypoint, setActiveWaypoint] = useState(null);

  const flyToWaypoint = (i) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const place = routeData.places[i];
    const marker = markersRef.current[i];
    setActiveWaypoint(i);
    map.flyTo([place.lat, place.lng], 17, { duration: 0.8 });
    if (marker) {
      setTimeout(() => marker.openPopup(), 500);
    }
  };

  const navigateTo = (place) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`,
      '_blank'
    );
  };

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const L = require('leaflet');

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current, { zoomControl: true });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Route by <a href="https://openrouteservice.org">ORS</a>',
      maxZoom: 19,
    }).addTo(map);

    const route = routeData.routes[0];
    const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);

    // Route outline + main line
    L.polyline(coords, { color: '#1e3a5f', weight: 7, opacity: 0.4 }).addTo(map);
    const routeLine = L.polyline(coords, {
      color: '#2563eb',
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    // Waypoint markers
    const places = routeData.places;
    const markers = [];

    const startIcon = L.divIcon({
      html: '<div style="background:#16a34a;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">S</div>',
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const endIcon = L.divIcon({
      html: '<div style="background:#dc2626;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">E</div>',
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const makeWaypointIcon = (num) =>
      L.divIcon({
        html: `<div style="background:#f59e0b;color:white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:10px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${num}</div>`,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

    places.forEach((place, i) => {
      let icon;
      if (i === 0) icon = startIcon;
      else if (i === places.length - 1) icon = endIcon;
      else icon = makeWaypointIcon(i);

      const label =
        i === 0 ? 'Start' : i === places.length - 1 ? 'End' : `Stop ${i}`;

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:13px;min-width:160px;">
            <strong>${label}</strong><br/>
            <span style="color:#555;">${place.placeName}</span>
            <br/><br/>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}"
               target="_blank" rel="noopener"
               style="display:inline-flex;align-items:center;gap:4px;background:#2563eb;color:white;padding:4px 10px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
              Navigate
            </a>
          </div>`
        );
      markers.push(marker);
    });

    markersRef.current = markers;

    // ── Playground compound ──
    const start = places[0];
    const routeStart = coords[0];
    const oY = 0.00055;
    const oX = 0.0008;

    const pgCenter = [start.lat + oY * 0.6, start.lng];
    const pgCorners = [
      [pgCenter[0] - oY, pgCenter[1] - oX],
      [pgCenter[0] - oY, pgCenter[1] + oX],
      [pgCenter[0] + oY, pgCenter[1] + oX],
      [pgCenter[0] + oY, pgCenter[1] - oX],
    ];

    L.polygon(pgCorners, {
      color: '#15803d',
      weight: 3,
      fillColor: '#dcfce7',
      fillOpacity: 0.55,
    }).addTo(map);

    const innerPad = 0.15;
    const innerCorners = pgCorners.map((c) => [
      pgCenter[0] + (c[0] - pgCenter[0]) * (1 - innerPad),
      pgCenter[1] + (c[1] - pgCenter[1]) * (1 - innerPad),
    ]);
    L.polygon(innerCorners, {
      color: '#22c55e',
      weight: 1.5,
      fillColor: '#86efac',
      fillOpacity: 0.4,
      dashArray: '4 3',
    }).addTo(map);

    const pgLabel = L.divIcon({
      html: `<div style="font-size:11px;font-weight:700;color:#15803d;background:rgba(255,255,255,0.85);padding:2px 8px;border-radius:4px;border:1px solid #86efac;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">Playground</div>`,
      className: '',
      iconAnchor: [38, 10],
    });
    L.marker(pgCenter, { icon: pgLabel, interactive: false }).addTo(map);

    // Gate
    const gateLat = pgCenter[0] - oY;
    const gateLng = pgCenter[1];

    const gateIcon = L.divIcon({
      html: `<div style="width:30px;height:16px;background:linear-gradient(135deg,#854d0e,#a16207);border:2px solid #fef9c3;border-radius:3px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.35);"><div style="width:2px;height:10px;background:#fef9c3;margin:0 3px;"></div><div style="width:2px;height:10px;background:#fef9c3;margin:0 3px;"></div></div>`,
      className: '',
      iconSize: [30, 16],
      iconAnchor: [15, 8],
    });
    L.marker([gateLat, gateLng], { icon: gateIcon })
      .addTo(map)
      .bindPopup(
        '<div style="font-size:13px;"><strong>Entry Gate</strong><br/>Playground entrance connecting to the road</div>'
      );

    const gapHalf = 0.00012;
    L.polyline(
      [[gateLat, pgCenter[1] - oX], [gateLat, gateLng - gapHalf]],
      { color: '#15803d', weight: 3 }
    ).addTo(map);
    L.polyline(
      [[gateLat, gateLng + gapHalf], [gateLat, pgCenter[1] + oX]],
      { color: '#15803d', weight: 3 }
    ).addTo(map);

    L.polyline([[gateLat, gateLng], routeStart], {
      color: '#a16207',
      weight: 3,
      dashArray: '6 6',
      opacity: 0.8,
    }).addTo(map);

    [[gateLat, gateLng], routeStart].forEach((pt) => {
      L.circleMarker(pt, {
        radius: 3,
        color: '#a16207',
        fillColor: '#fef9c3',
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);
    });

    map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const summary = routeData.routes[0]?.summary;
  const properties = routeData.routes[0]?.properties;

  const formatDuration = (seconds) => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
  };

  return (
    <div className="relative w-full h-screen">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Route info panel */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg z-[1000] max-w-xs w-80 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
          <h2 className="text-base font-bold text-white">Cycling Route</h2>
          <p className="text-blue-100 text-xs mt-0.5">
            {routeData.places.length} waypoints
          </p>
        </div>

        {/* Waypoints list */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Waypoints
          </h3>
          <div className="max-h-72 overflow-y-auto -mx-1">
            {routeData.places.map((place, i) => {
              const isStart = i === 0;
              const isEnd = i === routeData.places.length - 1;
              const isActive = activeWaypoint === i;

              return (
                <div
                  key={i}
                  onClick={() => flyToWaypoint(i)}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all group ${
                    isActive
                      ? 'bg-blue-50 ring-1 ring-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Number badge */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm ${
                      isStart
                        ? 'bg-green-600'
                        : isEnd
                        ? 'bg-red-600'
                        : 'bg-amber-500'
                    }`}
                  >
                    {isStart ? 'S' : isEnd ? 'E' : i}
                  </span>

                  {/* Place info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">
                      {place.placeName}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Locate button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        flyToWaypoint(i);
                      }}
                      className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      title="Zoom to point"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M11 8v6" />
                        <path d="M8 11h6" />
                      </svg>
                    </button>

                    {/* Navigate button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(place);
                      }}
                      className="w-7 h-7 rounded-md bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                      title="Navigate with Google Maps"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 11l19-9-9 19-2-8-8-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fit all button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => {
              const map = mapInstanceRef.current;
              if (!map) return;
              setActiveWaypoint(null);
              const route = routeData.routes[0];
              const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
              const L = require('leaflet');
              map.flyToBounds(L.latLngBounds(coords), {
                padding: [30, 30],
                duration: 0.8,
              });
            }}
            className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
          >
            Show Full Route
          </button>
        </div>

        <div className="border-t px-3 py-2 text-[10px] text-gray-400">
          openrouteservice.org | OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
}
