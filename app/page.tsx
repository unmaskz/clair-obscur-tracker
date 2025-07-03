"use client"

import React, { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MapboxMap from "@/components/mapbox-map";
import { Topbar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import { useData } from "@/context/data";
import { Marker, MarkerType } from "@/types/data";

const initialMarkerVisibility: Record<number, boolean> = {}
const initialMarkerTypes: MarkerType[] = []

export default function MapGenieClone() {
  const { groups, categories, locations } = useData();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [markerVisibility, setMarkerVisibility] = useState<Record<number, boolean>>(initialMarkerVisibility);

  categories.forEach((category: any) => {
    initialMarkerTypes.push({
      id: category.id,
      title: category.title,
      icon: <MapPin className="w-4 h-4" />,
      color: "#DDA0DD",
      visible: true,
    })
    initialMarkerVisibility[category.id] = true;
  });

  useEffect(() => {
    const newMarkers: Marker[] = locations.map((location) => ({
      ...location,
      completed: false,
    }))
    setMarkers(newMarkers)
  }, [locations])

  const markerTypes: MarkerType[] = categories.map((category: any) => ({
    id: category.id,
    title: category.title,
    icon: <MapPin className="w-4 h-4" />,
    color: "#DDA0DD",
    visible: true,
  }))

  const filteredMarkers = markers.filter((marker) => {
    const typeVisible = markerVisibility[marker.category.id]
    const matchesSearch =
      marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (marker.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return typeVisible && matchesSearch
  })

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  }

  const toggleMarkerCompletion = (markerId: number) => {
    setMarkers((prev) =>
      prev.map((marker) => (marker.id === markerId ? { ...marker, completed: !marker.completed } : marker)),
    )

    if (selectedMarker && selectedMarker.id === markerId) {
      setSelectedMarker({ ...selectedMarker, completed: !selectedMarker.completed })
    }
  }

  const getMarkerTypeInfo = (typeId: number) => {
    return markerTypes.find((type) => type.id === typeId)
  }

  const getGroupInfo = (groupId: number) => {
    return groups.find((group: any) => group.id === groupId);
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar locations={locations} markerVisibility={markerVisibility} setMarkerVisibility={setMarkerVisibility} markers={markers} markerTypes={markerTypes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMarkers={filteredMarkers} />

      <div className="flex-1 relative overflow-hidden">
        <Topbar filteredMarkers={filteredMarkers} />

        {/* Mapbox Map */}
        <div className="w-full h-full pt-16">
          <MapboxMap
            markers={filteredMarkers}
            markerTypes={markerTypes}
            markerVisibility={markerVisibility}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          />
        </div>

        {/* Selected Marker Info */}
        {selectedMarker && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto z-20">
            <Card className="bg-gray-800/95 backdrop-blur-sm border-gray-600 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                      style={{
                        backgroundColor: getGroupInfo(selectedMarker?.category?.groupId)?.color,
                        borderColor: "#1f2937",
                      }}
                    >
                      <div className="text-gray-800 text-sm font-bold">
                        <span className={`icon-${selectedMarker.category.icon}`}></span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{selectedMarker.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {getMarkerTypeInfo(selectedMarker.category.id)?.title}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="default" size="sm" onClick={() => setSelectedMarker(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-300 mb-4 leading-relaxed">
                  <Markdown>{selectedMarker.description}</Markdown>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={selectedMarker.completed ? "default" : "secondary"}
                    className={selectedMarker.completed ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {selectedMarker.completed ? "✓ Completed" : "Not Found"}
                  </Badge>
                  <Button
                    size="sm"
                    variant={selectedMarker.completed ? "secondary" : "default"}
                    onClick={() => toggleMarkerCompletion(selectedMarker.id)}
                    className="ml-2"
                  >
                    {selectedMarker.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
