/// <reference types="next" />
export const dynamic = 'force-dynamic';

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

// POST to update or create a campaign
export async function POST(req: NextRequest) {
    const companyId = cookies().get("memberflow_company_id")?.value;
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { id, isActive, messageText, name, triggerType, delayHours } = body;

    // CREATE logic
    if (!id) {
        if (!name || !messageText) {
            return NextResponse.json({ error: "Missing name or messageText for new campaign" }, { status: 400 });
        }

        const newCampaign = await prisma.campaign.create({
            data: {
                companyId,
                name,
                messageText,
                triggerType: triggerType || 'membership.activated',
                delayHours: delayHours !== undefined ? delayHours : 0,
                isActive: isActive !== undefined ? isActive : true,
            }
        });

        return NextResponse.json({ campaign: newCampaign });
    }

    // UPDATE logic
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
            name: name || existing.name,
            isActive: isActive !== undefined ? isActive : existing.isActive,
            messageText: messageText || existing.messageText,
            triggerType: triggerType || existing.triggerType,
            delayHours: delayHours !== undefined ? delayHours : existing.delayHours,
        },
    });

    return NextResponse.json({ campaign: updated });
}
