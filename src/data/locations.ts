import type { LocationInfo } from '../types';

export const LOCATIONS: LocationInfo[] = [
  { city: 'Ahmedabad', pincode: '380015', label: 'Ahmedabad • 380015', lat: 23.0225, lon: 72.5714 },
  { city: 'Bengaluru', pincode: '560001', label: 'Bengaluru • 560001', lat: 12.9081, lon: 77.6625 },
  { city: 'Mumbai',    pincode: '400001', label: 'Mumbai • 400001',    lat: 18.9388, lon: 72.8354 },
  { city: 'Delhi',     pincode: '110001', label: 'Delhi • 110001',     lat: 28.6139, lon: 77.2090 },
  { city: 'Pune',      pincode: '411001', label: 'Pune • 411001',      lat: 18.5204, lon: 73.8567 }
];

export const DEFAULT_LOCATION = LOCATIONS[0]; // Ahmedabad 380015
