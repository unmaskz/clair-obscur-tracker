import { ReactNode } from "react";
import { Prisma } from "@prisma/client";

export type Group = {
  id: number;
  title: string;
  color: string;
}

export type Category = {
  id: number;
  title: string;
  icon: string;
  template?: string | null;
  group?: Group;
  groupId: number;
}

export type Location = {
  id: number;
  title: string;
  description: string;
  longitude: number;
  latitude: number;
  categoryId: number;
  category: Category;
}

export type Marker = Location & {
  completed: boolean
}

export type MarkerType = Group & {
  icon: ReactNode;
  visible: boolean;
}

export type GroupWithCategory = Prisma.GroupGetPayload<{
  include: { categories: { select: { id: true; title: true; icon: true; template: true; groupId: true } } }
}>

export type CategoryWithGroup = Prisma.CategoryGetPayload<{
  include: { group: { select: { id: true; title: true; color: true } } }
}>

export type LocationWithCategory = Prisma.LocationGetPayload<{
  include: { 
    category: {
      select: { id: true; title: true; icon: true; template: true; groupId: true },
      include: { 
        group: {
          select: { id: true; title: true; color: true }
        }
      }
    }
  }
}>