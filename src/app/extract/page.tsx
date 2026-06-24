"use client";

/**
 * Structured extraction demo (T1-2).
 * Textarea -> POST /api/extract -> show the validated JSON.
 * Route: /extract
 */

import { useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

import type { Extraction } from "@/lib/schemas/extraction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const EXAMPLE = "Customer is angry because order 1234 is delayed.";

// Map each enum value to a Badge variant so the result reads at a glance.
const sentimentVariant = {
  negative: "destructive",
  neutral: "secondary",
  positive: "default",
} as const;

const priorityVariant = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
} as const;

export default function ExtractPage() {
  const [text, setText] = useState(EXAMPLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extraction | null>(null);

  async function extract() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      setResult(data as Extraction);
    } catch {
      setError("Network error. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Structured Extraction</h1>
          <p className="text-text-secondary text-sm">
            Turn a free-text message into structured data — the engine behind
            ticket triage, lead qualification, and CRM tagging.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Paste a customer message.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="e.g. Customer is angry because order 1234 is delayed."
            />
            <div className="flex items-center gap-2">
              <Button onClick={extract} disabled={loading || !text.trim()}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {loading ? "Extracting…" : "Extract"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setText(EXAMPLE)}
                disabled={loading}
              >
                Reset example
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="border-danger/30 bg-danger/5 text-danger flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>Validated against the Zod schema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={sentimentVariant[result.sentiment]}>
                  sentiment: {result.sentiment}
                </Badge>
                <Badge variant={priorityVariant[result.priority]}>
                  priority: {result.priority}
                </Badge>
                <Badge variant="outline">topic: {result.topic}</Badge>
              </div>

              <div>
                <p className="text-text-secondary text-xs font-medium uppercase">
                  Summary
                </p>
                <p className="text-sm">{result.summary}</p>
              </div>

              <Separator />

              <div>
                <p className="text-text-secondary mb-1 text-xs font-medium uppercase">
                  Raw JSON
                </p>
                <pre className="bg-surface-secondary overflow-x-auto rounded-md p-3 text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
