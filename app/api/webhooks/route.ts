export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

// Validate Whop webhook signature using HMAC-SHA256
function validateWebhookSignature(
    body: string,
    signature: string,
    secret: string
): boolean {
    try {
        const expectedSig = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");
        return crypto.timingSafeEqual(
            Buffer.from(signature, "hex"),
            Buffer.from(expectedSig, "hex")
        );
    } catch {
        return false;
    }
}

// Send standard Welcome DM
async function sendWelcomeDM(
    companyToken: string,
    userId: string,
    messageText: string
) {
    try {
        const res = await fetch(`https://api.whop.com/v5/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${companyToken}`, // User token from OAuth
            },
            body: JSON.stringify({
                recipient_id: userId,
                content: messageText,
            }),
        });

        return res.ok;
    } catch (err) {
        console.error(`[MemberFlow] Error sending welcome DM:`, err);
        return false;
    }
}

async function handleMembershipActivated(data: any) {
    const { membership, user, product } = data;

    if (!membership?.id || !user?.id) {
        return { processed: false, reason: "missing_data" };
    }

    console.log(`[MemberFlow] New member activated: ${user.username}`);

    // 1. Find the company that owns this membership/product
    // Webhooks from Whop include action data but not always the installer's whop ID directly inside membership payload.
    // Wait, the webhook is sent TO our app webhook URL. We need to identify WHICH company this belongs to.
    // We can look up the company by checking which company has active OAuth tokens that can access this product,
    // OR simpler: Whop passes `company_id` in the root of the webhook event or inside the membership object.
    const whopCompanyId = membership?.company_id || data?.company_id;

    if (!whopCompanyId) {
        console.error(`[MemberFlow] No company_id found in webhook`);
        return { processed: false, reason: "missing_company_id" };
    }

    const company = await prisma.company.findUnique({
        where: { whopUserId: whopCompanyId },
        include: {
            campaigns: {
                where: { isActive: true, triggerType: "membership.activated" },
            },
        },
    });

    if (!company) {
        console.error(`[MemberFlow] Unrecognized company: ${whopCompanyId}`);
        return { processed: false, reason: "company_not_found" };
    }

    // 2. Upsert the Member in our DB
    const member = await prisma.member.upsert({
        where: { whopMemberId: membership.id },
        create: {
            whopMemberId: membership.id,
            companyId: company.id,
            username: user.username || "Member",
            status: "active",
        },
        update: {
            status: "active",
            username: user.username || "Member",
        },
    });

    // 3. Process Campaigns (Welcome DMs)
    // Step 7 logic is embedded right here: if they have a welcome DM campaign, we send it instantly.
    for (const campaign of company.campaigns) {
        // Check if we already sent this campaign to this member
        const existingLog = await prisma.messageLog.findUnique({
            where: {
                campaignId_memberId: {
                    campaignId: campaign.id,
                    memberId: member.id,
                },
            },
        });

        if (!existingLog && company.accessToken) {
            // It's a new interaction
            const messageBody = campaign.messageText
                .replace("{{first_name}}", user.username || "there")
                .replace("{{product_name}}", product?.title || "our community");

            if (campaign.delayHours === 0) {
                // Send immediately
                const success = await sendWelcomeDM(company.accessToken, user.id, messageBody);

                await prisma.messageLog.create({
                    data: {
                        campaignId: campaign.id,
                        memberId: member.id,
                        status: success ? "sent" : "failed",
                        sentAt: success ? new Date() : null,
                        error: success ? null : "Failed to send via Whop API",
                    },
                });
            } else {
                // Delayed send - mark as pending for a cron job to pick up
                await prisma.messageLog.create({
                    data: {
                        campaignId: campaign.id,
                        memberId: member.id,
                        status: "pending",
                    },
                });
            }
        }
    }

    return { processed: true, action: "membership_activated" };
}

async function handleMembershipDeactivated(data: any) {
    const { membership } = data;
    if (!membership?.id) return { processed: false };

    // Mark member as inactive in our DB
    await prisma.member.updateMany({
        where: { whopMemberId: membership.id },
        data: { status: "inactive" },
    });

    // We could also cancel pending message logs here if desired

    return { processed: true, action: "membership_deactivated" };
}

export async function POST(request: NextRequest) {
    let body: string;

    try {
        body = await request.text();
    } catch {
        return NextResponse.json({ error: "Cannot read body" }, { status: 400 });
    }

    // Validate signature
    const signature = request.headers.get("x-whop-signature") || "";
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || "";

    if (webhookSecret && !validateWebhookSignature(body, signature, webhookSecret)) {
        console.warn("[MemberFlow] Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let event: any;
    try {
        event = JSON.parse(body);
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { action: type, data } = event; // Webhooks from Whop use 'action' field
    console.log(`[MemberFlow] Webhook received: ${type}`);

    try {
        let result;

        switch (type) {
            case "membership.went_valid": // Whop V5 webhook event
            case "membership.activated":   // Legacy/Alternate naming
                result = await handleMembershipActivated(data);
                break;

            case "membership.went_invalid":
            case "membership.deactivated":
                result = await handleMembershipDeactivated(data);
                break;

            default:
                console.log(`[MemberFlow] Unhandled event type: ${type}`);
                result = { processed: false, reason: "unhandled_event" };
        }

        return NextResponse.json({ ok: true, ...result });
    } catch (err) {
        console.error(`[MemberFlow] Error processing webhook ${type}:`, err);
        return NextResponse.json(
            { error: "Processing failed" },
            { status: 500 }
        );
    }
}

// Whop sends a GET to verify the endpoint exists
export async function GET() {
    return NextResponse.json({ status: "MemberFlow webhook endpoint active" });
}
