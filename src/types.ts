export interface ServiceItem {
  id: string;
  title: string;
  category: 'individual' | 'anxiety' | 'trauma' | 'couples' | 'telehealth';
  shortDescription: string;
  detailedDescription: string;
  whoItIsFor: string[];
  whatWeDo: string[];
  modalities: string[];
  sessionLength: string;
  rate: string;
  badge?: string;
  iconName: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientContext: string;
  durationWithUs: string;
  tag: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string[];
  keyTakeaways: string[];
}

export interface BookingFormData {
  serviceType: string;
  format: 'in-person' | 'telehealth';
  date: string;
  timeSlot: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  agreedToTerms: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  isCrisis?: boolean;
}
