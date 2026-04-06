export interface FarmRecord {
  id: string;
  cropName: string;
  plantingDate: string;
  harvestDate: string;
  cost: number;
  expectedRevenue: number;
  status: 'Growing' | 'Harvested' | 'Planned';
  notes?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}
