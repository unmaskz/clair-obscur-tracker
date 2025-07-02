import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { SidebarProvider } from "@/context/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clair Obscur Expedition 33 Tracker",
  description: "Track the Clair Obscur Expedition 33 with real-time updates and detailed information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <html lang="en">
          <head>
            <link
              href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.13.0/mapbox-gl.css"
              rel="stylesheet"
            />
          </head>
          <body>
            {children}
          </body>
        </html>
      </SidebarProvider>
    </ClerkProvider>
  );
}
