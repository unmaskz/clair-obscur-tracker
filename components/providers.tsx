import { ClerkProvider } from "@clerk/nextjs";

import { TooltipProvider } from "@/components/ui/tooltip";
import { MapProvider } from "@/context/map";
import { SidebarProvider } from "@/context/sidebar";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <MapProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </MapProvider>
      </SidebarProvider>
    </ClerkProvider>
  );
}