"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DECISION_RESULTS,
  getDecisionNode,
  type DecisionPathId,
} from "@/lib/tools/decision-tree";

export function DecisionTreeTool() {
  const [nodeId, setNodeId] = useState("start");
  const [resultId, setResultId] = useState<DecisionPathId | null>(null);

  const node = getDecisionNode(nodeId);
  const result = resultId ? DECISION_RESULTS[resultId] : null;

  function reset() {
    setNodeId("start");
    setResultId(null);
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-primary/30 bg-card/60">
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <p className="text-muted-foreground">{result.summary}</p>
            <div>
              <p className="mb-2 font-medium">Mirá primero:</p>
              <ul className="flex flex-col gap-2">
                {result.indicators.map((ind) => (
                  <li key={ind.slug}>
                    <Link
                      href={
                        ind.learnSlug
                          ? `/aprende/${ind.learnSlug}`
                          : `/indicador/${ind.slug}`
                      }
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {ind.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium">Tips:</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {result.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Button type="button" variant="outline" onClick={reset}>
          Empezar de nuevo
        </Button>
      </div>
    );
  }

  if (!node) return null;

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base">{node.question ?? node.text}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {node.options?.map((opt) => (
          <Button
            key={opt.nextId}
            type="button"
            variant="outline"
            className="h-auto justify-start py-3 text-left"
            onClick={() => {
              const next = getDecisionNode(opt.nextId);
              if (next?.result) {
                setResultId(next.result);
              } else {
                setNodeId(opt.nextId);
              }
            }}
          >
            {opt.label}
          </Button>
        ))}
        {nodeId !== "start" ? (
          <Button type="button" variant="ghost" onClick={reset} className="text-sm">
            Volver al inicio
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
