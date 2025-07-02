import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Menu } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/sidebar";

interface Props {
  filteredMarkers: any[];
}

export const Topbar = ({ filteredMarkers }: Props) => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-4 h-4" />
          </Button>
          <h2 className="font-semibold">Interactive Map</h2>
          <Badge variant="outline" className="text-xs text-white">
            {filteredMarkers.length} markers visible
          </Badge>
        </div>
        <div>
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