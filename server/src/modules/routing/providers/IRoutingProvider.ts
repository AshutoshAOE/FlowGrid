export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteResult {
  distanceMeters: number;
  durationSeconds: number;
  geometry: string; // Encoded polyline
}

export interface MatrixResult {
  distances: number[][]; // [originIndex][destinationIndex] in meters
  durations: number[][]; // [originIndex][destinationIndex] in seconds
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
}

export interface IRoutingProvider {
  /**
   * Calculates a detailed route between two points.
   */
  calculateRoute(origin: Coordinates, destination: Coordinates): Promise<RouteResult>;

  /**
   * Calculates a matrix of distances/durations between multiple origins and destinations.
   */
  calculateMatrix(origins: Coordinates[], destinations: Coordinates[]): Promise<MatrixResult>;

  /**
   * Geocodes an address string into coordinates.
   */
  geocode(address: string): Promise<GeocodeResult | null>;
}
