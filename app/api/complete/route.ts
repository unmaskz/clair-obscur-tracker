import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the internal user
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get and validate locationId from body
    const body = await req.json();
    const { locationId } = body;

    if (typeof locationId !== "number") {
      return NextResponse.json({ error: "Invalid locationId" }, { status: 400 });
    }

    // Check for existing marker
    const existingMarker = await prisma.marker.findUnique({
      where: {
        userId_locationId: {
          userId: user.id,
          locationId,
        },
      },
    });

    if (existingMarker) {
      const updatedMarker = await prisma.marker.update({
        where: {
          userId_locationId: {
            userId: user.id,
            locationId,
          },
        },
        data: { completed: false },
      });

      return NextResponse.json(
        { message: "Marker updated to completed: false", marker: updatedMarker },
        { status: 200 }
      );
    }

    const newMarker = await prisma.marker.create({
      data: {
        userId: user.id,
        locationId,
        completed: true,
      },
    });

    return NextResponse.json(
      { message: "New marker created with completed: true", marker: newMarker },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/markers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
