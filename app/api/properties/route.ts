import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGA4Properties } from "@/lib/ga/properties";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const saved = await prisma.property.findMany({ where: { userId } });
  if (saved.length > 0) {
    return NextResponse.json({ properties: saved });
  }

  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    select: { access_token: true },
  });

  if (!account?.access_token) {
    return NextResponse.json({ properties: [] });
  }

  const properties = await getGA4Properties(account.access_token);
  return NextResponse.json({ properties });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { propertyId, propertyName } = await req.json();
  const userId = session.user.id;

  const property = await prisma.property.upsert({
    where: { userId_propertyId: { userId, propertyId } },
    create: { userId, propertyId, propertyName },
    update: { propertyName },
  });

  return NextResponse.json({ property });
}
