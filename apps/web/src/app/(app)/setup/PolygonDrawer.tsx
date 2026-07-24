'use client';

import { useEffect } from 'react';
import { Polygon, Polyline, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import { area, centroid } from '@turf/turf';

/** Leaflet coordinate order: [lat, lng] */
export type LatLng = [number, number];

export interface PolygonMetrics {
  hectares: number;
  center: LatLng | null;
}

interface PolygonDrawerProps {
  points: LatLng[];
  onChange: (points: LatLng[], metrics: PolygonMetrics) => void;
  focus?: LatLng | null;
  color?: string;
}

/** Compute area (hectares) + centroid from Leaflet-order points. */
export function computePolygonMetrics(points: LatLng[]): PolygonMetrics {
  if (points.length < 3) return { hectares: 0, center: null };
  const ring = [...points, points[0]].map(([lat, lng]) => [lng, lat]); // GeoJSON order
  const poly = { type: 'Polygon', coordinates: [ring] } as any;
  const hectares = area(poly) / 10000; // m² -> hectares
  const c = centroid(poly).geometry.coordinates; // [lng, lat]
  return { hectares, center: [c[1], c[0]] as LatLng };
}

function FlyTo({ target }: { target?: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function PolygonDrawer({
  points,
  onChange,
  focus,
  color = '#16a34a',
}: PolygonDrawerProps) {
  useMapEvents({
    click(e) {
      const next: LatLng[] = [...points, [e.latlng.lat, e.latlng.lng]];
      onChange(next, computePolygonMetrics(next));
    },
  });

  return (
    <>
      <FlyTo target={focus} />
      {points.length === 2 && (
        <Polyline positions={points} pathOptions={{ color, weight: 2, dashArray: '6 6' }} />
      )}
      {points.length >= 3 && (
        <Polygon positions={points} pathOptions={{ color, weight: 2, fillOpacity: 0.15 }} />
      )}
      {points.map((p, i) => (
        <CircleMarker
          key={i}
          center={p}
          radius={5}
          pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 1 }}
        />
      ))}
    </>
  );
}
