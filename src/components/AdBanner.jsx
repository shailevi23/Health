import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdBanner({ className = "" }) {
  return (
    <Card className={`border-2 border-dashed border-stone-200 bg-stone-50/50 ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="text-stone-400 text-sm">
          <p className="font-medium mb-1">Advertisement Space</p>
          <p className="text-xs">Placeholder for future ad content</p>
        </div>
      </CardContent>
    </Card>
  );
}