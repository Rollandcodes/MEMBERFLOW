/// <reference types="node" />
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    let community_type, creator_niche, campaign_goal, audience;
    try {
        const body = await req.json();
        community_type = body.community_type;
        creator_niche = body.creator_niche;
        campaign_goal = body.campaign_goal;
        audience = body.audience;

        const prompt = `
            You are a community automation expert. Generate a multi-step JSON onboarding/retention campaign for a Whop community.
            Community Type: ${community_type}
            Creator Niche: ${creator_niche}
            Campaign Goal: ${campaign_goal}
            Target Audience: ${audience || 'New Members'}

            Return a JSON object with:
            - name: String (catchy campaign name)
            - category: String
            - steps: Array of objects with { delay_days: Number, message_content: String }
            
            Use placeholders: {name} for member name and {tier} for membership tier.
            Keep messages concise, friendly, and high-value.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: "You are a helpful assistant that only outputs valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Failed to generate content");
        
        const generatedCampaign = JSON.parse(content);

        // Optional: Persist the generation request metadata to Supabase
        await supabase.from('campaign_generations').insert({ 
            community_type, 
            creator_niche, 
            campaign_goal,
            generated_name: generatedCampaign.name 
        });

        return NextResponse.json({ 
            success: true, 
            campaign: generatedCampaign
        });
    } catch (error: any) {
        console.error('AI Generator error:', error);
        // Fallback to a sophisticated rule-based generator if OpenAI fails/is not configured
        const fallbackCampaign = {
            name: `${community_type} ${campaign_goal} Sequence`,
            category: community_type,
            steps: [
                {
                    id: 'step_1',
                    delay_days: 0,
                    message_content: `Hey {name}! Welcome to our ${community_type} community. We're excited to have you here in the ${creator_niche} space. Check out our first guide in the members area!`,
                    step_order: 1
                },
                {
                    id: 'step_2',
                    delay_days: 3,
                    message_content: `Hi {name}, just checking in! How are you enjoying the ${community_type} community so far? If you have any questions about ${creator_niche}, feel free to ask!`,
                    step_order: 2
                }
            ]
        };

        return NextResponse.json({ 
            success: true, 
            campaign: fallbackCampaign,
            is_fallback: true
        });
    }
}
