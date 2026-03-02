import { mockUsers } from './mockUsers';
import type { CelebrityData } from '../context/AppContext';

/**
 * A normalized profile shape used by call/chat screens.
 * Works for both mockUsers and celebrities.
 */
export interface ResolvedProfile {
  id: string;
  name: string;
  avatar: string;
  city: string;
  age: number;
  online: boolean;
  verified: boolean;
  rating: number;
  interests: string[];
  isCeleb: boolean;
}

/**
 * Looks up a user first in mockUsers, then in the celebrities array.
 * Returns a normalized profile object.
 */
export function resolveProfile(
  id: string | undefined,
  celebrities: CelebrityData[]
): ResolvedProfile {
  if (!id) {
    const u = mockUsers[0];
    return {
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      city: u.city,
      age: u.age,
      online: u.online,
      verified: u.verified,
      rating: u.rating,
      interests: u.interests,
      isCeleb: false,
    };
  }

  // Try mockUsers first
  const mockUser = mockUsers.find((u) => u.id === id);
  if (mockUser) {
    return {
      id: mockUser.id,
      name: mockUser.name,
      avatar: mockUser.avatar,
      city: mockUser.city,
      age: mockUser.age,
      online: mockUser.online,
      verified: mockUser.verified,
      rating: mockUser.rating,
      interests: mockUser.interests,
      isCeleb: false,
    };
  }

  // Try celebrities
  const celeb = celebrities.find((c) => c.id === id);
  if (celeb) {
    return {
      id: celeb.id,
      name: celeb.name,
      avatar: celeb.image,
      city: celeb.category,
      age: 0,
      online: celeb.isOnline,
      verified: celeb.isVerified,
      rating: celeb.rating,
      interests: celeb.tags,
      isCeleb: true,
    };
  }

  // Fallback
  const fallback = mockUsers[0];
  return {
    id: fallback.id,
    name: fallback.name,
    avatar: fallback.avatar,
    city: fallback.city,
    age: fallback.age,
    online: fallback.online,
    verified: fallback.verified,
    rating: fallback.rating,
    interests: fallback.interests,
    isCeleb: false,
  };
}
