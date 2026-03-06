"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Clock, Play, Pause, Loader2, Save, Zap } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  isActive: boolean;
  messageText: string;
  triggerType: string;
  delayHours: number;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Local edits before saving
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.campaigns) {
          setCampaigns(data.campaigns);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load campaigns", err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
    );

    try {
      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle campaign", err);
      // Revert on fail
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
      );
    }
  };

  const handleSaveMessage = async (id: string) => {
    const newMessage = edits[id];
    if (!newMessage) return;

    setSavingId(id);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, messageText: newMessage }),
      });
      const data = await res.json();

      if (data.campaign) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === id ? data.campaign : c))
        );
        // Clear edit state for this box
        const newEdits = { ...edits };
        delete newEdits[id];
        setEdits(newEdits);
      }
    } catch (err) {
      console.error("Failed to save message", err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Automations</h1>
        <p className="text-slate-500 mt-2">Manage your welcome messages and drip sequences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <Send className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No campaigns found</h3>
            <p className="text-slate-500 mb-6">Reconnect Whop to generate your default campaigns.</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-none shadow-sm rounded-3xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Left col - Details */}
                <div className="md:w-1/3 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trigger</span>
                    </div>
                    <div className="text-sm font-semibold bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-slate-700 font-mono inline-block">
                      {campaign.triggerType}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timing</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {campaign.delayHours === 0 ? "Send immediately" : `Send after ${campaign.delayHours} hours`}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Button
                      variant={campaign.isActive ? "default" : "outline"}
                      className={`w-full font-bold rounded-xl ${campaign.isActive ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200' : ''}`}
                      onClick={() => handleToggle(campaign.id, campaign.isActive)}
                    >
                      {campaign.isActive ? (
                        <><Play className="h-4 w-4 mr-2" /> Active</>
                      ) : (
                        <><Pause className="h-4 w-4 mr-2" /> Paused</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Right col - Editor */}
                <div className="md:w-2/3 border border-slate-100 rounded-2xl bg-slate-50/50 p-1 flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl">
                    <div className="font-bold text-slate-900">{campaign.name} Message</div>
                    <div className="text-xs text-slate-400 font-mono">Available variables: {"{{first_name}}"}, {"{{product_name}}"}</div>
                  </div>

                  <textarea
                    className="w-full flex-1 min-h-[160px] p-4 bg-transparent border-none resize-none focus:ring-0 text-slate-700 text-sm leading-relaxed"
                    value={edits[campaign.id] !== undefined ? edits[campaign.id] : campaign.messageText}
                    onChange={(e) => setEdits({ ...edits, [campaign.id]: e.target.value })}
                  />

                  {edits[campaign.id] !== undefined && edits[campaign.id] !== campaign.messageText && (
                    <div className="p-3 bg-white border-t border-slate-100 flex justify-end rounded-b-xl">
                      <Button
                        size="sm"
                        onClick={() => handleSaveMessage(campaign.id)}
                        disabled={savingId === campaign.id}
                        className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-lg shadow-md"
                      >
                        {savingId === campaign.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
