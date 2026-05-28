import axios from 'axios';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/errors/AppError';
import { IRoutingProvider, Coordinates, RouteResult, MatrixResult, GeocodeResult } from './IRoutingProvider';

export class ORSProvider implements IRoutingProvider {
  private readonly baseUrl = 'https://api.openrouteservice.org/v2';
  private readonly geocodeUrl = 'https://api.openrouteservice.org/geocode';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = env.ORS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ORS_API_KEY is missing. ORS provider will fail.');
    }
  }

  private getHeaders() {
    return {
      Authorization: this.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    };
  }

  async calculateRoute(origin: Coordinates, destination: Coordinates): Promise<RouteResult> {
    try {
      // ORS expects coordinates as [longitude, latitude]
      const body = {
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat]
        ],
        format: 'json'
      };

      const response = await axios.post(`${this.baseUrl}/directions/driving-car/json`, body, {
        headers: this.getHeaders()
      });

      const route = response.data.routes[0];
      
      return {
        distanceMeters: route.summary.distance,
        durationSeconds: route.summary.duration,
        geometry: route.geometry,
      };
    } catch (error: any) {
      console.error('ORS calculateRoute failed:', error.response?.data || error.message);
      throw new AppError('Routing calculation failed', 502);
    }
  }

  async calculateMatrix(origins: Coordinates[], destinations: Coordinates[]): Promise<MatrixResult> {
    try {
      const locations = [
        ...origins.map(o => [o.lng, o.lat]),
        ...destinations.map(d => [d.lng, d.lat])
      ];

      // ORS Matrix API uses indices to define origins and destinations
      const originIndices = origins.map((_, i) => i);
      const destIndices = destinations.map((_, i) => origins.length + i);

      const body = {
        locations,
        metrics: ['distance', 'duration'],
        sources: originIndices,
        destinations: destIndices
      };

      const response = await axios.post(`${this.baseUrl}/matrix/driving-car`, body, {
        headers: this.getHeaders()
      });

      return {
        distances: response.data.distances,
        durations: response.data.durations,
      };
    } catch (error: any) {
      console.error('ORS calculateMatrix failed:', error.response?.data || error.message);
      throw new AppError('Routing matrix calculation failed', 502);
    }
  }

  async geocode(address: string): Promise<GeocodeResult | null> {
    try {
      const response = await axios.get(`${this.geocodeUrl}/search`, {
        params: {
          api_key: this.apiKey,
          text: address,
          size: 1,
          'boundary.country': 'IN', // Focus on India
        },
      });

      const features = response.data?.features;
      if (!features || features.length === 0) return null;

      const feature = features[0];
      const [lng, lat] = feature.geometry.coordinates;
      const label = feature.properties?.label || address;

      return { lat, lng, label };
    } catch (error: any) {
      console.error('ORS geocode failed:', error.response?.data || error.message);
      return null; // Gracefully return null instead of throwing
    }
  }
}

