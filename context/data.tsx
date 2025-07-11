"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

import type { Group, Location, Category } from "@/types/data";

interface LocationWithMarker extends Location {
  completed?: boolean;
}

interface DataContextType {
  groups: Group[];
  categories: Category[];
  locations: LocationWithMarker[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  groups: Group[];
  categories: Category[];
  locations: Location[];
  children: ReactNode;
}

export function DataProvider({ groups, categories, locations, children }: DataProviderProps) {
  return (
    <DataContext.Provider value={{ groups, categories, locations }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}