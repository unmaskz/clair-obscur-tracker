import { MenuIcon, Search, X } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/context/sidebar";
import { useData } from "@/context/data";

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
  const { groups } = useData();

  const toggleMarkerType = (typeId: number) => {
    setMarkerVisibility((prev: any) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }))
  }

  const getMarkerTypeInfo = (typeId: number) => {
    return markerTypes.find((type: any) => type.id === typeId)
  }

  return (
    <div
      className={`${sidebarOpen ? "w-80 md:w-96" : "w-[4.5rem]"} absolute top-0 left-0 flex h-full transition-all duration-300 overflow-hidden bg-gray-800 border-r border-gray-700 z-40`}
    >
      <div className="w-full h-full flex flex-col p-4 mb-12 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`${sidebarOpen ? "block" : "hidden"} text-xl font-bold`}>Clair Obscur Tracker</h1>
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 hover:bg-gray-700 hover:text-white">
            <MenuIcon size={20} />
          </Button>
        </div>

        { sidebarOpen && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        )}

        <div className="flex-1 overflow-hidden border-t border-b border-gray-700 py-6">
          <ScrollArea className="h-full">
            {groups.map((group: any) => (
              <div key={`group-${group.id}`} className={sidebarOpen ? "mb-6" : "mb-0"}>
                <h3 className={`${sidebarOpen ? "block" : "hidden"} font-semibold text-sm uppercase mb-3`}>{group.title}</h3>
                <div className={`${sidebarOpen ? "columns-2 gap-1" : ""}`}>
                  {group.categories.map((category: any) => {
                    const isToggled = markerVisibility[category.id];

                    return (
                      <div
                        key={`category-${category.id}`}
                        className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} p-3 ${isToggled ? "[&>*]:text-white": "[&>*]:text-gray-500"} rounded-md mb-2 hover:bg-gray-700 transition-colors cursor-pointer`}
                        onClick={() => toggleMarkerType(category.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {getMarkerTypeInfo(category.id)?.icon}
                          <span className={`${sidebarOpen ? "block" : "hidden"} text-sm font-medium ${!isToggled ? "line-through" : ""}`}>
                            {category.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex items-center justify-end pt-6 pb-3">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}