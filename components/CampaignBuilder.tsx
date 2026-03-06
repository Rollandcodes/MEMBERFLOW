'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Send, Wand2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export default function CampaignBuilder() {
  const [steps, setSteps] = useState([
    { id: '1', delay: 0, content: 'Hey {name}! Welcome to the community. How can I help you get started?' },
    { id: '2', delay: 3, content: 'Just checking in! How are you enjoying things so far?' },
  ]);

  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { id: newId, delay: 1, content: '' }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Builder</h1>
          <p className="text-muted-foreground">Create automated messaging sequences for your members.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-200">
            Save Draft
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6 shadow-lg shadow-indigo-100">
            <Send className="mr-2 h-4 w-4" />
            Launch Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {steps.map((step, index) => (
            <Card key={step.id} className="relative overflow-hidden rounded-3xl border-gray-100 shadow-sm group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Message Step</CardTitle>
                    <CardDescription>Configure timing and content</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">Wait</span>
                    <Input 
                      type="number" 
                      className="w-20 h-9 rounded-xl border-gray-200 font-bold text-center" 
                      defaultValue={step.delay} 
                    />
                    <span className="text-sm font-bold text-gray-700">days after trigger</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                      Message Content
                    </label>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Supports Markdown</span>
                  </div>
                  <textarea 
                    className="w-full min-h-[120px] p-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-700 font-medium leading-relaxed"
                    placeholder="Enter your message here..."
                    defaultValue={step.content}
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['{name}', '{tier}', '{community}'].map(tag => (
                      <button key={tag} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100/50">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            onClick={addStep}
            variant="outline" 
            className="w-full py-8 rounded-3xl border-dashed border-2 border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-lg"
          >
            <Plus className="mr-2 h-6 w-6" />
            Add Another Step
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-none bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-1 shadow-xl">
            <div className="bg-indigo-600/50 backdrop-blur-xl rounded-[calc(1.5rem-4px)] p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Wand2 className="h-6 w-6 text-yellow-300" />
                </div>
                <h3 className="font-black text-xl tracking-tight">AI Assistant</h3>
              </div>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                Let MemberFlow AI generate a high-converting sequence based on your community type.
              </p>
              <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black py-6 rounded-2xl shadow-lg">
                Generate Sequence
              </Button>
            </div>
          </Card>

          <Card className="rounded-3xl border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Campaign Tips
            </h3>
            <ul className="space-y-4">
              {[
                'Keep first messages under 200 characters for best engagement.',
                'Wait at least 2 days between follow-up messages.',
                'Personalize using the {name} tag to build trust.',
              ].map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 font-medium flex gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
