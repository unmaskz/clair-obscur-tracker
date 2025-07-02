"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import { MapMarker, MarkerType } from "@/interfaces/markers.interface";

interface MapboxMapProps {
  markers: MapMarker[]
  markerTypes: MarkerType[]
  markerVisibility: Record<string, boolean>
  onMarkerClick: (marker: MapMarker) => void
  className?: string
}

// Set your Mapbox access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapboxMap({
  markers,
  markerTypes,
  markerVisibility,
  onMarkerClick,
  className = "",
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              `${window.location.origin}/tileset/{z}/{y}/{x}.jpg`
            ],
            tileSize: 256,
            mapbox_logo: false,
            bounds: [-1.4, 0, 0, 1.4],
          }
        },
        layers: [
          {
            id: 'raster-layer',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 10,
            maxzoom: 14,
          }
        ]
      },
      center: [-0.72951396769895, 0.68198170340672],
      zoom: 11,
    });
    
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.current.on("load", () => {
      setMapLoaded(true)
    });

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, []);

  // Update markers when visibility or markers change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add visible markers
    markers.forEach((marker) => {
      const markerType = markerTypes.find((type) => type.id === marker.type);
      if (!markerType || !markerVisibility[marker.type]) return;

      // Create marker element
      const el = document.createElement("div")
      el.className = "custom-marker"
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${markerType.color};
        border: 2px solid #1f2937;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        position: absolute;
      `;

      // Add icon (simplified for HTML)
      el.innerHTML = `
        <div style="color: #1f2937; font-size: 14px; font-weight: bold;">
          <span style="display: none" class="icomoon">${markerType.icon}</span>
          ${getMarkerSymbol(markerType.title)}
        </div>
        ${marker.completed ? '<div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #10b981; border: 2px solid #1f2937; border-radius: 50%;"></div>' : ""}
      `;

      // Create and add marker
      const mapboxMarker = new mapboxgl.Marker(el, { offset: [0, 0]}).setLngLat([marker.lng, marker.lat]).addTo(map.current!);

      // Add click handler
      el.addEventListener("click", () => {
        onMarkerClick(marker);
      })

      markersRef.current[marker.id] = mapboxMarker;
    })
  }, [markers, markerTypes, markerVisibility, mapLoaded, onMarkerClick]);

  // Helper function to get marker symbol
  const getMarkerSymbol = (type: string): string => {
    const symbols: { [key: string]: string } = {
      Treasures: "💎",
      Weapons: "⚔️",
      Armor: "🛡️",
      Secrets: "👁️",
      Collectibles: "⭐",
      "Key Locations": "📍",
      Location: "📍",
      "Point of Interest": "ℹ️",
      Shortcut: "➡️",
      "Music Record": "🎵",
      "Journal Entry": "📖",
      Weapon: "⚔️",
      Pictos: "🖼️",
      "Quest Item": "❓",
      Tint: "🎨",
      Chroma: "🌈",
      "Chroma Catalyst": "🧪",
      "Colour of Lumina": "✨",
      Recoat: "🖌️",
      "Story Boss": "💀",
      "Optional Boss": "😈",
      "World Boss": "🌍",
      Enemy: "👾",
      Character: "👤",
      "Lost Gestral": "👻",
      Merchant: "💰",
    }
    return symbols[type] || "📍"
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
