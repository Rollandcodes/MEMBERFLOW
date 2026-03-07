/// <reference types="next" />
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// GET all campaigns for the current company
export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const companyId = cookieStore.get("memberflow_company_id")?.value;
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { plan: true, name: true },
    });

    const campaigns = await prisma.campaign.findMany({
        where: { companyId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
        campaigns,
        companyPlan: company?.plan === "free" ? "free" : "pro",
        companyName: company?.name || "MemberFlow Community",
    });
}

// POST to update or create a campaign
export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const companyId = cookieStore.get("memberflow_company_id")?.value;
    if (!companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: any = {};
    try {
        const rawBody = await req.text();
        body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { id, isActive, messageText, name, triggerType, delayHours } = body;

    // Onboarding default create path: POST /api/campaigns with no payload.
    if (!id && !name && !messageText) {
        const existingDefault = await prisma.campaign.findFirst({
            where: {
                companyId,
                name: "Welcome Sequence",
                triggerType: "membership.activated",
            },
            orderBy: { createdAt: "asc" },
        });

        if (existingDefault) {
            return NextResponse.json({ campaign: existingDefault, created: false });
        }

        const defaultCampaign = await prisma.campaign.create({
            data: {
                companyId,
                name: "Welcome Sequence",
                messageText: "Hey {{first_name}}! Welcome to the community. Glad to have you here.",
                triggerType: "membership.activated",
                delayHours: 0,
                isActive: true,
            },
        });

        return NextResponse.json({ campaign: defaultCampaign, created: true }, { status: 201 });
    }

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
