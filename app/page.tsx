"use client"

import React, { useState } from "react";
import { Search, MapPin, Settings, Menu, X, Home, Layers } from "lucide-react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import MapboxMap from "@/components/mapbox-map";
import { useSidebar } from "@/context/sidebar";
import groups from "@/data/groups.json";
import locations from "@/data/locations.json";
import categories from "@/data/categories.json";
import { MapMarker, MarkerType } from "@/interfaces/markers.interface";
import { Topbar } from "@/components/top-bar";

const initialMarkerVisibility: Record<number, boolean> = {}
const initialMarkerTypes: MarkerType[] = []

if (categories) {
  Object.values(categories).forEach((category: any) => {
    initialMarkerTypes.push({
      id: category.id,
      title: category.title,
      icon: <MapPin className="w-4 h-4" />,
      color: "#DDA0DD",
      visible: true,
    })
    initialMarkerVisibility[category.id] = true
  })
}

export default function MapGenieClone() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [markerVisibility, setMarkerVisibility] = useState<Record<number, boolean>>(initialMarkerVisibility)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [markers, setMarkers] = useState<MapMarker[]>(
    locations.map((location: any) => ({
      id: location.id,
      type: location.category_id,
      lng: location.longitude,
      lat: location.latitude,
      title: location.title,
      description: location.description,
      visible: true,
      completed: false,
    })),
  )

  const markerTypes: MarkerType[] = Object.values(categories).map((category: any) => ({
    id: category.id,
    title: category.title,
    icon: <MapPin className="w-4 h-4" />,
    color: "#DDA0DD",
    visible: true,
  }))

  const toggleMarkerType = (typeId: number) => {
    setMarkerVisibility((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }))
  }

  const filteredMarkers = markers.filter((marker) => {
    const typeVisible = markerVisibility[marker.type]
    const matchesSearch =
      marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (marker.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return typeVisible && matchesSearch
  })

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker)
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

  const completedCount = (typeId: number) => {
    return markers.filter((marker) => marker.type === typeId && marker.completed).length
  }

  const totalCompleted = markers.filter((m) => m.completed).length
  const completionPercentage = (totalCompleted / markers.length) * 100

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden bg-gray-800 border-r border-gray-700 flex-shrink-0`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Clair Obscur: Expedition 33</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Progress Overview */}
          <Card className="mb-4 bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Progress Overview</h3>
              <div className="text-sm text-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span>Total Completed:</span>
                  <span className="font-semibold">
                    {totalCompleted}/{markers.length}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="text-center mt-1 text-xs text-gray-400">
                  {Math.round(completionPercentage)}% Complete
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold mb-3">Categories</h3>
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-4">
                {markerTypes.map((type) => (
                  <div
                    key={`${type.id}-${Math.random()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={markerVisibility[type.id]}
                        onCheckedChange={() => toggleMarkerType(type.id)}
                        className="border-gray-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div style={{ color: getMarkerTypeInfo(type.id)?.color }}>
                          {getMarkerTypeInfo(type.id)?.icon}
                        </div>
                        <span className="text-sm font-medium">{type.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-200">
                        {completedCount(type.id)}/
                        {locations.filter((location: any) => location.category_id === type.id).length}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
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
                        backgroundColor: getMarkerTypeInfo(selectedMarker.type)?.color,
                        borderColor: "#1f2937",
                      }}
                    >
                      <div className="text-gray-800 text-sm font-bold">
                        {getMarkerTypeInfo(selectedMarker.type)?.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{selectedMarker.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {getMarkerTypeInfo(selectedMarker.type)?.title}
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
