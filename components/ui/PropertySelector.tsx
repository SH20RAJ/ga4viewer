"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Property {
  propertyId: string;
  propertyName: string;
}

interface PropertySelectorProps {
  onSelect: (id: string) => void;
  selected: string;
}

export function PropertySelector({ onSelect, selected }: PropertySelectorProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties ?? []);
        if (data.properties?.length > 0 && !selected) {
          onSelect(data.properties[0].propertyId);
        }
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [onSelect, selected]);

  if (loading) {
    return <div className="h-9 w-48 bg-slate-200 animate-pulse rounded-md" />;
  }

  if (properties.length === 0) {
    return (
      <div className="text-sm text-slate-500 border rounded-md px-3 py-2 bg-white">
        No GA4 properties found
      </div>
    );
  }

  return (
    <Select value={selected} onValueChange={onSelect}>
      <SelectTrigger className="w-48 bg-white">
        <SelectValue placeholder="Select property" />
      </SelectTrigger>
      <SelectContent>
        {properties.map((p) => (
          <SelectItem key={p.propertyId} value={p.propertyId}>
            {p.propertyName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
