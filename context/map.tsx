"use client";

import React, { createContext, useContext, useState } from "react";
import { Marker } from "@/types/data";

type MapContextType = {
  selectedMarker: Marker | null;
  setSelectedMarker: (marker: Marker | null) => void;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  return (
    <MapContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
