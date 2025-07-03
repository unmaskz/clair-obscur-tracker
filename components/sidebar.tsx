import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card ,CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/context/sidebar";

interface Props {
  filteredMarkers: any[];
  searchQuery: any;
  setSearchQuery: (query: string) => void;
  markers: any[];
  markerTypes: any;
  markerVisibility: any;
  setMarkerVisibility: any;
  locations: any;
}

export const Sidebar = ({ locations, setMarkerVisibility, markerVisibility, markerTypes, markers, searchQuery, setSearchQuery, filteredMarkers }: Props) => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const completedCount = (typeId: number) => {
    return markers.filter((marker) => marker.category.id === typeId && marker.completed).length
  }

  const toggleMarkerType = (typeId: number) => {
    setMarkerVisibility((prev: any) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }))
  }

  const getMarkerTypeInfo = (typeId: number) => {
    return markerTypes.find((type: any) => type.id === typeId)
  }

  const totalCompleted = markers.filter((m) => m.completed).length
  const completionPercentage = (totalCompleted / markers.length) * 100

  return (
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
            <h3 className="text-white font-semibold mb-2">Progress Overview</h3>
            
            { markers && markers.length > 0 && (
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
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold mb-3">Categories</h3>
          <ScrollArea className="h-full">
            <div className="space-y-2 pr-4">
              {markerTypes.map((type: any) => (
                <div
                  key={`category-${type.id}`}
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
                      {locations.filter((location: any) => location.categoryId === type.id).length}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}