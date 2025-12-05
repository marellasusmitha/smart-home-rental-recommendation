import { Property, PropertyType, FurnishedType, UserRole } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern 2BHK in Downtown',
    description: 'A lovely apartment with city views, close to metro station.',
    city: 'New York',
    propertyType: PropertyType.BHK2,
    furnishedType: FurnishedType.FULLY,
    rating: 4.5,
    rent: 2500,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', // Example ID
    latitude: 40.7128,
    longitude: -74.0060,
    ownerEmail: 'owner@example.com'
  },
  {
    id: '2',
    title: 'Cozy Studio near Park',
    description: 'Perfect for singles, quiet neighborhood.',
    city: 'San Francisco',
    propertyType: PropertyType.STUDIO,
    furnishedType: FurnishedType.SEMI,
    rating: 4.0,
    rent: 1800,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Direct MP4 example
    latitude: 37.7749,
    longitude: -122.4194,
    ownerEmail: 'owner@example.com'
  },
  {
    id: '3',
    title: 'Luxury 3BHK Villa',
    description: 'Spacious villa with private garden and pool access.',
    city: 'Los Angeles',
    propertyType: PropertyType.BHK3,
    furnishedType: FurnishedType.FULLY,
    rating: 4.8,
    rent: 4500,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    latitude: 34.0522,
    longitude: -118.2437,
    ownerEmail: 'landlord@test.com'
  },
  {
    id: '4',
    title: 'Affordable Apartment',
    description: 'Great value for money, near university.',
    city: 'Chicago',
    propertyType: PropertyType.APARTMENT,
    furnishedType: FurnishedType.UNFURNISHED,
    rating: 3.5,
    rent: 1200,
    imageUrl: 'https://picsum.photos/800/600?random=4',
    latitude: 41.8781,
    longitude: -87.6298,
    ownerEmail: 'owner@example.com'
  }
];

export const MOCK_USERS = [
  { email: 'tenant@test.com', password: '123', role: UserRole.TENANT, name: 'John Doe' },
  { email: 'owner@example.com', password: '123', role: UserRole.OWNER, name: 'Jane Smith' }
];