"use server";

import { prisma } from "@/lib/prisma";
import { BusinessCard } from "@/types/business-card";

export async function getBusinessCard(
  id: string
): Promise<BusinessCard | null> {
  const businessCard = await prisma.businessCard.findUnique({
    where: { id },
  });

  if (!businessCard) return null;

  return {
    ...businessCard,
    createdAt: businessCard.createdAt.toISOString(),
    updatedAt: businessCard.updatedAt.toISOString(),
  };
}
