import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

/**
 * Decodes an encoded polyline string into an array of LatLng tuples.
 * (ORS and Google Maps use the same polyline encoding algorithm)
 */
const decodePolyline = (encoded: string): [number, number][] => {
  let points: [number, number][] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
};

// Helper component to auto-fit bounds
const AutoBounds = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);
  return null;
};

interface RouteMapProps {
  encodedGeometry?: string;
  origin?: { lat: number; lng: number; label: string };
  destination?: { lat: number; lng: number; label: string };
  height?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({ 
  encodedGeometry, 
  origin, 
  destination, 
  height = '300px' 
}) => {
  const [points, setPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (encodedGeometry) {
      setPoints(decodePolyline(encodedGeometry));
    }
  }, [encodedGeometry]);

  const fallbackCenter: [number, number] = [0, 0];

  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer 
        center={points.length > 0 ? points[0] : (origin ? [origin.lat, origin.lng] : fallbackCenter)} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {points.length > 0 && (
          <>
            <Polyline positions={points} color="#4F46E5" weight={5} opacity={0.8} />
            <AutoBounds points={points} />
          </>
        )}

        {origin && (
          <Marker position={[origin.lat, origin.lng]}>
            <Popup>{origin.label}</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>{destination.label}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
