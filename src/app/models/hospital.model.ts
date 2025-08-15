export interface DeliveryCost {
  normal: string | number;  // Allow both string and number for compatibility
  cesarean?: string | number;
  _id?: string;
  // Add compatibility fields for the components that expect these
  currency?: string;
  emergency?: string | number;
  cs?: string | number;
}

export interface Comment {
  text: string;
  author: string;
  createdAt: Date;
}

export interface Hospital {
  _id?: string;  // API uses _id instead of id, made optional for mock data
  id?: string;  // For backwards compatibility with component templates
  state: string;
  name: string;
  location: string;
  services: string[];
  delivery_cost: DeliveryCost;
  contact: string;
  type: string;  // Public, Private, Teaching, etc.
  admin_code?: string;
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  showDetails?: boolean; // Added to control expandable rows in the UI
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HospitalsResponse {
  [state: string]: Hospital[];
}
