"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Clock, Play, Pause, Loader2, Save, Zap, Plus, Trash2 } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  isActive: boolean;
  messageText: string;
  triggerType: string;
  delayHours: number;
};

export default function CampaignsPage() {
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiErrorById, setAiErrorById] = useState<Record<string, string>>({});
  const [aiSuggestionsById, setAiSuggestionsById] = useState<Record<string, string[]>>({});
  const [communityName, setCommunityName] = useState("My Community");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("friendly");
  const [sequencePrompt, setSequencePrompt] = useState("I run a crypto trading community");
  const [sequenceOutput, setSequenceOutput] = useState("");
  const [sequenceLoading, setSequenceLoading] = useState(false);
  const [sequenceError, setSequenceError] = useState("");

  const templateCreated = searchParams.get("created") === "1";
  const templateName = searchParams.get("template") || "Template";
  const focusCampaignId = searchParams.get("campaignId");
  const editorRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Local edits before saving
  const [edits, setEdits] = useState<Record<string, string>>({});

  const handleCreateCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Welcome Sequence",
          messageText: "Welcome to our community! We're glad to have you here.",
          triggerType: "membership.activated",
          delayHours: 0,
          isActive: false
        }),
      });
      const data = await res.json();
      if (data.campaign) {
        setCampaigns([data.campaign, ...campaigns]);
      }
    } catch (err) {
      console.error("Failed to create campaign", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) return;

    try {
      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: false, name: `[DELETED] ${id}` }),
      });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

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

  useEffect(() => {
    if (!focusCampaignId || campaigns.length === 0) return;

    const target = editorRefs.current[focusCampaignId];
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.focus();
    target.setSelectionRange(target.value.length, target.value.length);
  }, [focusCampaignId, campaigns]);

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

  const handleWriteWithAI = async (campaignId: string) => {
    if (!niche.trim()) {
      setAiErrorById((prev) => ({ ...prev, [campaignId]: "Please enter your niche first." }));
      return;
    }

    setAiLoadingId(campaignId);
    setAiErrorById((prev) => ({ ...prev, [campaignId]: "" }));

    try {
      const res = await fetch('/api/ai/generate-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityName,
          niche,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data?.suggestions)) {
        setAiErrorById((prev) => ({
          ...prev,
          [campaignId]: data?.error || 'Failed to generate suggestions.',
        }));
        setAiSuggestionsById((prev) => ({ ...prev, [campaignId]: [] }));
        return;
      }

      setAiSuggestionsById((prev) => ({ ...prev, [campaignId]: data.suggestions }));
    } catch {
      setAiErrorById((prev) => ({
        ...prev,
        [campaignId]: 'Network error while generating suggestions.',
      }));
    } finally {
      setAiLoadingId(null);
    }
  };

  const applySuggestion = (campaignId: string, suggestion: string) => {
    setEdits((prev) => ({ ...prev, [campaignId]: suggestion }));
  };

  const handleGenerateSequence = async () => {
    const trimmedPrompt = sequencePrompt.trim();
    if (!trimmedPrompt) {
      setSequenceError('Please enter a prompt first.');
      return;
    }

    setSequenceLoading(true);
    setSequenceError('');
    setSequenceOutput('');

    try {
      const res = await fetch('/api/ai/generate-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setSequenceError(data?.error || 'Failed to generate sequence.');
        setSequenceLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSequenceOutput((prev) => prev + chunk);
      }
    } catch {
      setSequenceError('Network error while streaming AI sequence.');
    } finally {
      setSequenceLoading(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Automations</h1>
          <p className="text-slate-500 mt-2">Manage your welcome messages and drip sequences.</p>
        </div>
        <Button
          onClick={handleCreateCampaign}
          className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-2xl px-6 py-6 shadow-xl shadow-indigo-100"
        >
          <Plus className="h-5 w-5 mr-2" /> Create New Automation
        </Button>
      </div>

      {templateCreated && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-semibold text-green-800">
            {templateName} has been added to your campaigns.
          </p>
        </div>
      )}

      <Card className="border border-slate-200 rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900">AI DM Writer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
              placeholder="Community name"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
            />
            <input
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
              placeholder="Niche (e.g. crypto trading, fitness coaching)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
            <select
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="bold">Bold</option>
              <option value="playful">Playful</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900">AI Sequence Writer (Streaming)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="w-full min-h-[100px] rounded-xl border border-slate-200 p-3 text-sm"
            value={sequencePrompt}
            onChange={(e) => setSequencePrompt(e.target.value)}
            placeholder="Describe your community and goals..."
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGenerateSequence}
              disabled={sequenceLoading}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl"
            >
              {sequenceLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                'Generate Sequence'
              )}
            </Button>
          </div>
          {sequenceError ? <p className="text-sm font-semibold text-red-600">{sequenceError}</p> : null}
          <pre className="min-h-[180px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {sequenceOutput || 'Streaming output will appear here in real time...'}
          </pre>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <Send className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No campaigns found</h3>
            <p className="text-slate-500 mb-6">Reconnect Whop to generate your default campaigns.</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className={`border-none shadow-sm rounded-3xl overflow-hidden ${focusCampaignId === campaign.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
            >
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

                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <Button
                      variant={campaign.isActive ? "default" : "outline"}
                      className={`flex-1 font-bold rounded-xl ${campaign.isActive ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200' : ''}`}
                      onClick={() => handleToggle(campaign.id, campaign.isActive)}
                    >
                      {campaign.isActive ? (
                        <><Play className="h-4 w-4 mr-2" /> Active</>
                      ) : (
                        <><Pause className="h-4 w-4 mr-2" /> Paused</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Right col - Editor */}
                <div className="md:w-2/3 border border-slate-100 rounded-2xl bg-slate-50/50 p-1 flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl">
                    <div className="font-bold text-slate-900">{campaign.name} Message</div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold rounded-lg"
                        onClick={() => handleWriteWithAI(campaign.id)}
                        disabled={aiLoadingId === campaign.id}
                      >
                        {aiLoadingId === campaign.id ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Writing...</>
                        ) : (
                          'Write with AI'
                        )}
                      </Button>
                      <div className="text-xs text-slate-400 font-mono">Available variables: {"{{first_name}}"}, {"{{product_name}}"}</div>
                    </div>
                  </div>

                  <textarea
                    className="w-full flex-1 min-h-[160px] p-4 bg-transparent border-none resize-none focus:ring-0 text-slate-700 text-sm leading-relaxed"
                    ref={(el) => {
                      editorRefs.current[campaign.id] = el;
                    }}
                    value={edits[campaign.id] !== undefined ? edits[campaign.id] : campaign.messageText}
                    onChange={(e) => setEdits({ ...edits, [campaign.id]: e.target.value })}
                  />

                  {(aiSuggestionsById[campaign.id]?.length || aiErrorById[campaign.id]) ? (
                    <div className="px-4 pb-3 space-y-2">
                      {aiErrorById[campaign.id] ? (
                        <p className="text-sm font-semibold text-red-600">{aiErrorById[campaign.id]}</p>
                      ) : null}
                      {aiSuggestionsById[campaign.id]?.length ? (
                        <div className="grid gap-2">
                          {aiSuggestionsById[campaign.id].map((suggestion, index) => (
                            <button
                              key={`${campaign.id}-ai-${index}`}
                              onClick={() => applySuggestion(campaign.id, suggestion)}
                              className="text-left text-sm p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-100 transition-colors"
                              type="button"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

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
