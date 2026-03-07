export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const companyId = cookies().get("memberflow_company_id")?.value;
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await prisma.member.findMany({
        where: { companyId },
        orderBy: { joinedAt: "desc" },
        take: 50,
    });

    return NextResponse.json({ members });
}
