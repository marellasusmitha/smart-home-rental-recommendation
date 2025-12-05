export enum UserRole {
  TENANT = 'TENANT',
  OWNER = 'OWNER'
}

export enum PropertyType {
  APARTMENT = 'Apartment',
  HOUSE = 'Individual House',
  BHK2 = '2BHK',
  BHK3 = '3BHK',
  STUDIO = 'Studio'
}

export enum FurnishedType {
  FULLY = 'Fully Furnished',
  SEMI = 'Semi Furnished',
  UNFURNISHED = 'Unfurnished'
}

export interface User {
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text
  name?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  propertyType: PropertyType | string;
  furnishedType: FurnishedType | string;
  rating: number;
  rent: number;
  imageUrl: string;
  videoUrl?: string; // YouTube or MP4
  latitude: number;
  longitude: number;
  ownerEmail: string;
}

export interface Notification {
  id: string;
  ownerEmail: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AppState {
  currentUser: User | null;
  properties: Property[];
  favorites: Record<string, string[]>; // userEmail -> propertyIds[]
  notifications: Record<string, Notification[]>; // ownerEmail -> Notification[]
}