import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { DataProvider } from "@/context/data";
import Providers from "@/components/providers";
import prisma from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clair Obscur Expedition 33 Tracker",
  description: "Track the Clair Obscur Expedition 33 with real-time updates and detailed information.",
};

export default async function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 1. Get Clerk + DB user
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (!dbUser) throw new Error("User not found in DB");

  // 2. Get completed marker location IDs for this user
  const userMarkers = await prisma.marker.findMany({
    where: { userId: dbUser.id },
    select: { locationId: true },
  });

  const completedLocationIds = new Set(userMarkers.map((m) => m.locationId));

  const [groups, categories ] = await Promise.all([
    prisma.group.findMany({ include: { "categories": true }, orderBy: { id: "asc" }}),
    prisma.category.findMany({ orderBy: { id: "asc" }}),
  ]);

  const locations = await prisma.location.findMany({
    include: { category: { include: { group: true }}}, 
    orderBy: { id: "asc" },
  });

  // Add completed flag:
  const enrichedLocations = locations.map(location => ({
    ...location,
    completed: completedLocationIds.has(location.id),
  }));

  return (
    <html lang="en">
      <head>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.13.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <DataProvider groups={groups} categories={categories} locations={enrichedLocations}>
            {children}
          </DataProvider>
        </Providers>
      </body>
    </html>
  );
}
