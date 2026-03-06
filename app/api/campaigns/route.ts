import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// GET all campaigns for the current company
export async function GET(req: NextRequest) {
    const companyId = cookies().get("memberflow_company_id")?.value;
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const campaigns = await prisma.campaign.findMany({
        where: { companyId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ campaigns });
}

// POST to update a campaign
export async function POST(req: NextRequest) {
    const companyId = cookies().get("memberflow_company_id")?.value;
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { id, isActive, messageText } = body;
    if (!id) return NextResponse.json({ error: "Missing campaign ID" }, { status: 400 });

    // Ensure this campaign belongs to this company
    const existing = await prisma.campaign.findFirst({
        where: { id, companyId },
    });

    if (!existing) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const updated = await prisma.campaign.update({
        where: { id },
        data: {
            isActive: isActive !== undefined ? isActive : existing.isActive,
            messageText: messageText || existing.messageText,
        },
    });

    return NextResponse.json({ campaign: updated });
}
