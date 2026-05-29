"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/**
 * Interactive OSM map of BIPE's twelve-district Eastern-UP catchment.
 *
 * Leaflet is loaded lazily inside useEffect so it never executes during
 * SSR (Leaflet calls `window` at import time). Pins are drawn with
 * divIcons — no PNG icon assets, no Leaflet image-asset URL gymnastics.
 *
 * Coordinates are district headquarters except for "BIPE Phoolpur",
 * which is the campus itself (Gajokhar, Phoolpur).
 */
type Pin = {
  name: string;
  hi: string;
  lat: number;
  lon: number;
  kind: "home" | "major" | "active";
};

const PINS: Pin[] = [
  // Home — BIPE campus inside Varanasi district.
  { name: "BIPE Phoolpur", hi: "BIPE फूलपुर",  lat: 25.46, lon: 83.06, kind: "home" },
  // Major — closest belts.
  { name: "Varanasi",      hi: "वाराणसी",       lat: 25.32, lon: 82.97, kind: "major" },
  { name: "Mau",           hi: "मऊ",            lat: 25.94, lon: 83.56, kind: "major" },
  { name: "Ghazipur",      hi: "गाज़ीपुर",       lat: 25.58, lon: 83.58, kind: "major" },
  { name: "Jaunpur",       hi: "जौनपुर",         lat: 25.75, lon: 82.69, kind: "major" },
  { name: "Bhadohi",       hi: "भदोही",          lat: 25.40, lon: 82.57, kind: "major" },
  // Active — wider Eastern-UP draw.
  { name: "Azamgarh",      hi: "आज़मगढ़",       lat: 26.07, lon: 83.18, kind: "active" },
  { name: "Chandauli",     hi: "चंदौली",         lat: 25.27, lon: 83.27, kind: "active" },
  { name: "Mirzapur",      hi: "मिर्ज़ापुर",       lat: 25.15, lon: 82.57, kind: "active" },
  { name: "Sonebhadra",    hi: "सोनभद्र",         lat: 24.69, lon: 83.07, kind: "active" },
  { name: "Ballia",        hi: "बलिया",          lat: 25.76, lon: 84.15, kind: "active" },
  { name: "Gorakhpur",     hi: "गोरखपुर",        lat: 26.76, lon: 83.37, kind: "active" },
  { name: "Kushinagar",    hi: "कुशीनगर",        lat: 26.74, lon: 83.89, kind: "active" },
];

export default function CatchmentMap() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    let mapInstance: import("leaflet").Map | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;

      mapInstance = L.map(ref.current, {
        center: [25.6, 83.1],
        zoom: 9,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      PINS.forEach((p) => {
        const isHome = p.kind === "home";
        const size = isHome ? 26 : 18;
        const icon = L.divIcon({
          html: `<div class="bipe-pin bipe-pin-${p.kind}">
                   <span class="bipe-pin-dot"></span>
                 </div>`,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
        L.marker([p.lat, p.lon], { icon, title: p.name })
          .bindTooltip(
            `<strong>${p.name}</strong>${isHome ? "" : ` <span style="color:#888">·</span> <span style="font-family:var(--font-serif),serif;font-style:italic">${p.hi}</span>`}`,
            { permanent: true, direction: "right", offset: [size / 2 + 4, 0], className: "bipe-tooltip" }
          )
          .addTo(mapInstance!);
      });

      // Fit bounds to all pins so every district is on-screen even on
      // narrow containers; gentle padding for label breathing room.
      const bounds = L.latLngBounds(PINS.map((p) => [p.lat, p.lon] as [number, number]));
      mapInstance.fitBounds(bounds, { padding: [30, 30] });
    })();

    return () => {
      cancelled = true;
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .bipe-pin {
          display: flex; align-items: center; justify-content: center;
          width: 100%; height: 100%;
        }
        .bipe-pin-dot {
          display: block;
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(10,26,63,0.35);
        }
        .bipe-pin-home .bipe-pin-dot {
          background: var(--accent, #f97316);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent, #f97316) 25%, transparent),
                      0 6px 16px rgba(10,26,63,0.4);
        }
        .bipe-pin-major .bipe-pin-dot { background: var(--brand, #1e3a72); }
        .bipe-pin-active .bipe-pin-dot {
          background: color-mix(in oklab, var(--brand, #1e3a72) 55%, white);
        }
        .bipe-tooltip {
          background: #ffffff;
          color: var(--ink, #0a0a0a);
          border: 1px solid var(--line, #e5e7eb);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(10,26,63,0.12);
          font-family: var(--font-sans), system-ui, sans-serif;
        }
        .bipe-tooltip:before { display: none; }
        .leaflet-container {
          background: var(--paper-2, #f5f5f0);
          font-family: var(--font-sans), system-ui, sans-serif;
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.85) !important;
          font-size: 10px !important;
        }
      `}</style>
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
