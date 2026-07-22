'use client';
import { useEffect } from 'react';
import {
  MapContainer, TileLayer, Marker, Polygon, Popup, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type LatLng = [number, number];

/** Fixes gray tiles (invalidateSize) and frames the boundary/point (fitBounds). */
function MapFix({ center, boundary }: { center: LatLng | null; boundary: LatLng[] | null }) {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    fix();
    const t = setTimeout(fix, 250);
    const ro = new ResizeObserver(fix);
    ro.observe(map.getContainer());
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [map]);
  useEffect(() => {
    if (boundary && boundary.length >= 3) {
      map.fitBounds(boundary as [[number, number], [number, number]], { padding: [24, 24], maxZoom: 17 });
    } else if (center) {
      map.setView(center, 15);
    }
  }, [map, center, boundary]);
  return null;
}

export default function FarmMap({
  center, boundary, name, height = 260,
}: {
  center: LatLng | null;
  boundary: LatLng[] | null;
  name?: string;
  height?: number;
}) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const defaultCenter: LatLng = center ?? [32.4279, 53.688];
  const zoom = center || (boundary && boundary.length >= 3) ? 14 : 5;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      style={{ height, width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFix center={center} boundary={boundary} />
      {boundary && boundary.length >= 3 ? (
        <Polygon positions={boundary} pathOptions={{ color: '#16a34a', weight: 2, fillOpacity: 0.2 }} />
      ) : center ? (
        <Marker position={center}><Popup>{name}</Popup></Marker>
      ) : null}
    </MapContainer>
  );
}
