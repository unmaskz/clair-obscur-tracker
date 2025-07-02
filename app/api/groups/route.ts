import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const groups = await prisma.group.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return NextResponse.json(groups);
}