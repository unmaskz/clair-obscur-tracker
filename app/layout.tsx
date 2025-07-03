import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { DataProvider } from "@/context/data";
import { SidebarProvider } from "@/context/sidebar";
import prisma from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clair Obscur Expedition 33 Tracker",
  description: "Track the Clair Obscur Expedition 33 with real-time updates and detailed information.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [groups, categories, locations] = await Promise.all([
    prisma.group.findMany({ orderBy: { id: "asc" }}),
    prisma.category.findMany({ orderBy: { id: "asc" }}),
    prisma.location.findMany({ include: { category: { include: { group: true }}}, orderBy: { id: "asc" }}),
  ]);

  return (
    <html lang="en">
      <head>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.13.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClerkProvider>
          <DataProvider initialData={{ groups, categories, locations }}>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </DataProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
