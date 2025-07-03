"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

import type { Group, Location, Category } from "@/types/data";

type DataContextType = {
  groups: Group[]
  locations: Location[]
  categories: Category[]
  setGroups: Dispatch<SetStateAction<Group[]>>
  setLocations: Dispatch<SetStateAction<Location[]>>
  setCategories: Dispatch<SetStateAction<Category[]>>
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children, initialData }: {
  children: ReactNode;
  initialData: {
    groups: Group[];
    locations: Location[];
    categories: Category[];
  }
}) {
  const [groups, setGroups] = useState(initialData.groups);
  const [locations, setLocations] = useState(initialData.locations);
  const [categories, setCategories] = useState(initialData.categories);

  return (
    <DataContext.Provider value={{ groups, locations, categories, setGroups, setLocations, setCategories }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
