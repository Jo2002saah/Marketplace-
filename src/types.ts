export type ArtisanCategory = 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'mechanic' | 'mason' | 'welder' | 'ac_technician' | 'pop_technician';

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedBooking?: boolean;
}

export interface Artisan {
  id: string;
  name: string;
  category: ArtisanCategory;
  location: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  rateGhs: number;
  avatar: string;
  bio: string;
  specialties: string[];
  isVerified: boolean;
  tradeCertificate: string;
  completedJobs: number;
  reviews: Review[];
  // Added for advanced core requirements
  yearsExperience: number;
  availability: 'today' | 'weekends' | 'always';
  ghanaCardNumber?: string;
  latitude: number; // For GPS map coordinate
  longitude: number; // For GPS map coordinate
  // Monetization attributes
  isPremium?: boolean;
  isFeatured?: boolean;
}

export interface Message {
  id: string;
  sender: 'customer' | 'artisan';
  text: string;
  timestamp: string;
  photoUrl?: string;
  isVoiceNote?: boolean;
  voiceNoteDuration?: string;
}

export interface ChatSession {
  artisanId: string;
  artisanName: string;
  messages: Message[];
}

export interface Booking {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanCategory: ArtisanCategory;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  date: string;
  time: string;
  description: string;
  optimizedBrief?: {
    title: string;
    optimizedDescription: string;
    scopeOfWork: string[];
    suggestedMilestones: string[];
  } | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimatedCostGhs: number;
  ratingLeft?: boolean;
  paymentStatus?: 'unpaid' | 'paid';
  paymentProvider?: 'MTN MoMo' | 'Telecel Cash' | 'AirtelTigo Money' | 'Visa/Mastercard';
  paymentNumber?: string;
}

export interface MatchmakeResult {
  recommendedArtisanCategory: ArtisanCategory;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  immediateSafetyTips: string[];
  preliminaryQuestions: string[];
}

export interface CostEstimateResult {
  estimatedRangeGhs: { min: number; max: number };
  laborCostEstimateGhs: { min: number; max: number };
  materialsEstimateGhs: { min: number; max: number };
  typicalDuration: string;
  costFactors: string[];
  materialsRequired: string[];
}
