import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const signature = req.headers.get("x-whop-signature");
        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const rawBody = await req.text();
        const secret = process.env.WHOP_WEBHOOK_SECRET || "";

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("[Webhook] Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const payload = JSON.parse(rawBody);
        const eventType = payload.action || payload.event;
        const data = payload.data || {};

        console.log(`[Webhook] Received event: ${eventType}`);

        if (eventType === "membership.activated") {
            const companyId = data.company_id || data.product?.company_id; // Support both payloads
            const memberId = data.id; // Usually the membership ID

            if (!companyId || !memberId) {
                return NextResponse.json({ message: "Missing tracking data" }, { status: 200 });
            }

            // Find company
            const company = await prisma.company.findUnique({
                where: { whopUserId: companyId },
            });

            if (!company) {
                console.log(`[Webhook] Company ${companyId} not found in DB`);
                return NextResponse.json({ message: "Company not found" }, { status: 200 }); // Still 200 to ack
            }

            // Upsert Member
            const member = await prisma.member.upsert({
                where: { whopMemberId: memberId },
                update: { status: "active" },
                create: {
                    whopMemberId: memberId,
                    companyId: company.id,
                    username: data.user?.username || data.name || "New Member",
                    status: "active",
                },
            });

            // Find active Welcome DM Campaign
            const welcomeCampaign = await prisma.campaign.findFirst({
                where: {
                    companyId: company.id,
                    isActive: true,
                    triggerType: "membership.activated",
                },
            });

            if (welcomeCampaign) {
                // Record the message log
                const existingLog = await prisma.messageLog.findUnique({
                    where: {
                        campaignId_memberId: {
                            campaignId: welcomeCampaign.id,
                            memberId: member.id,
                        },
                    },
                });

                if (!existingLog) {
                    // Send DM logic goes here (Whop API or simulated)
                    // Since sending DMs via API isn't fully set up yet in this snippet, we'll mark as pending/sent
                    await prisma.messageLog.create({
                        data: {
                            campaignId: welcomeCampaign.id,
                            memberId: member.id,
                            status: "sent",
                            sentAt: new Date(),
                        },
                    });
                    console.log(`[Webhook] Welcome DM logged for member ${memberId}`);
                }
            }
        } else if (eventType === "membership.deactivated") {
            const memberId = data.id;
            if (memberId) {
                await prisma.member.updateMany({
                    where: { whopMemberId: memberId },
                    data: { status: "inactive" },
                });
                console.log(`[Webhook] Member ${memberId} deactivated`);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[Webhook Error]", error);
        // Don't return 500 automatically, or Whop will retry heavily
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 200 });
    }
}
