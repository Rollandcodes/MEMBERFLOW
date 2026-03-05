'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Send, Sparkles, Clock, Layout, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignStep {
  id: string;
  delay_days: number;
  message_content: string;
}

export default function CampaignBuilder() {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('member_joined');
  const [steps, setSteps] = useState<CampaignStep[]>([
    { id: '1', delay_days: 0, message_content: 'Welcome to the community! 🚀' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { id: newId, delay_days: 7, message_content: '' }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, field: keyof CampaignStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
        // Step 5: AI Campaign Generator logic
        const response = await fetch('/api/campaigns/generate', {
            method: 'POST',
            body: JSON.stringify({
                community_type: 'SaaS',
                creator_niche: 'Software Development',
                campaign_goal: 'Onboarding & Retention'
            })
        });
        const data = await response.json();
        if (data.campaign) {
            setName(data.campaign.name);
            setSteps(data.campaign.steps);
        }
    } catch (error) {
        console.error('AI generation failed', error);
    } finally {
        setIsGenerating(false);
    }
  };

  const saveCampaign = async () => {
    console.log('Saving campaign:', { name, trigger, steps });
    alert('Campaign saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Builder</h1>
          <p className="text-muted-foreground">Design automated messaging flows for your Whop members.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={generateWithAI}
            disabled={isGenerating}
            className="border-indigo-200 hover:bg-indigo-50 text-indigo-600 font-semibold"
          >
            <Sparkles className={cn("mr-2 h-4 w-4", isGenerating && "animate-spin")} />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Button onClick={saveCampaign} className="bg-indigo-600 hover:bg-indigo-700">
            <Send className="mr-2 h-4 w-4" />
            Launch Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Layout className="mr-2 h-5 w-5 text-indigo-500" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input 
                placeholder="e.g. Welcome Sequence" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger Event</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
              >
                <option value="member_joined">New Member Joined</option>
                <option value="member_upgraded">Membership Upgraded</option>
                <option value="member_cancelled">Membership Cancelled</option>
                <option value="member_inactive">Member Inactive (30 days)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {steps.map((step, index) => (
            <Card key={step.id} className="relative border-l-4 border-l-indigo-500 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-xs">STEP {index + 1}</span>
                    <CardTitle className="text-base font-semibold">Message Step</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Send after</span>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      className="w-20 h-8" 
                      value={step.delay_days}
                      onChange={(e) => updateStep(step.id, 'delay_days', parseInt(e.target.value))}
                    />
                    <span className="text-sm font-medium">days</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    <label className="text-sm font-medium text-slate-700">DM Content</label>
                  </div>
                  <textarea 
                    className="w-full h-32 p-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder:text-muted-foreground"
                    placeholder="Hey {name}, welcome to the community! Let me know if you need anything..."
                    value={step.message_content}
                    onChange={(e) => updateStep(step.id, 'message_content', e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground italic">Available variables: {'{name}'}, {'{tier}'}, {'{email}'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            variant="dashed" 
            className="w-full border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-8 text-lg font-medium transition-all"
            onClick={addStep}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Another Step
          </Button>
        </div>
      </div>
    </div>
  );
}
