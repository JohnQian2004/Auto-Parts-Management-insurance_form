// Mock Travel Data - Shared across all travel components

// Image Server Configuration
const API_URL_IMAGE_SERVE = 'http://localhost:5003/image';

// Helper function to generate random cachebust parameter
function getRandomCacheBust(): number {
  return Math.floor(Math.random() * 100000);
}

// Helper function to generate image URL with random cachebust
export function getImageUrl(): string {
  return `${API_URL_IMAGE_SERVE}?random=true&cachebust=${getRandomCacheBust()}`;
}

// Helper function to generate multiple image URLs
export function getMultipleImageUrls(count: number = 4): string[] {
  return Array.from({ length: count }, () => getImageUrl());
}

// ===== CATEGORY INTERFACE AND MOCK DATA =====
export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const mockCategories: Category[] = [
  {
    id: 0,
    name: "All Categories",
    description: "Browse all available travel experiences",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    id: 1,
    name: "Pilgrimage",
    description: "Sacred religious journeys and spiritual experiences",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Adventure",
    description: "Thrilling outdoor activities and challenging expeditions",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Holiday",
    description: "Relaxing leisure trips and family vacations",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Bus Tour",
    description: "Guided group tours with comfortable transportation",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Cultural",
    description: "Immersive experiences in local traditions and heritage",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Historical",
    description: "Educational tours of significant historical sites",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Short Breaks",
    description: "Quick getaways and weekend escapes",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  }
];

// ===== HELPER FUNCTIONS FOR CATEGORIES =====
export function getCategoryById(id: number): Category | null {
  return mockCategories.find(category => category.id === id) || null;
}

export function getAllCategories(): Category[] {
  return mockCategories;
}

export function getCategoryByName(name: string): Category | null {
  return mockCategories.find(category => category.name.toLowerCase() === name.toLowerCase()) || null;
}

export interface Activity {
  time: string;
  description: string;
}

export interface Meal {
  type: string;
  description: string;
}

export interface TripItinerary {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals: Meal[];
  accommodation?: string;
}

export interface DateAvailability {
  date: string;
  available: number;
  maxCapacity: number;
  price?: number; // Optional: price might vary by date/season
}

export interface TravelCompanion {
  id: number;
  firstName: string;
  lastName: string;
  dob: string; // Date of birth in YYYY-MM-DD format
  sex: 'Male' | 'Female' | 'Other';
  passportNumber: string;
  nationality: string;
  email?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  specialRequests?: string;
  isPrimaryContact?: boolean;
}

export interface TripData {
  id: number;
  name: string;
  destination: string;
  duration: string;
  basePrice: number;
  image: string;
  images: string[];
  availability: DateAvailability[]; // Replaces availableDates and capacity
  categoryId: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: TripItinerary[];
  highlights: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: { min: number; max: number }; // Kept for user communication about typical group size
  maxCapacity: number; // Maximum capacity for this trip (for user display)
  bestTime: string;
  cancellationPolicy: string;
  imageModels?: {
    id: number;
    fileName: string;
    fileSize?: number;
    description: string;
    sortOrder: number;
    isActive: boolean;
    isMainImage: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    tripId: number;
  }[]; // Add this line to support the new image system
}

export const mockTripData: { [key: number]: TripData } = {
  1: {
    id: 1,
    name: "Sacred Sikh Pilgrimage Tour - Pakistan",
    destination: "Lahore & Nankana Sahib, Pakistan",
    duration: "7 days",
    basePrice: 899.99,
    image: "https://www.imusafir.pk/blog/wp-content/uploads/2024/10/kartarpur-sahib-a-visit-v0-ybtrzdlevwra1-scaled.jpg",
    images: [
      "https://www.imusafir.pk/blog/wp-content/uploads/2024/10/kartarpur-sahib-a-visit-v0-ybtrzdlevwra1-scaled.jpg",
      "https://thepakistanitraveller.assamartist.com/wp-content/uploads/2024/11/Sikh-Pilgrimage-Heritage-Trail-Map-of-Pakistan-By-Assam-Artist-Watermarks.jpg",
      "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTQ5OTYyNzQwLTRlNDItMTFlZi1hYzA1LTVmMzMyMjcyZGNhNS5qcGc=",
      "https://static.wixstatic.com/media/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png/v1/fill/w_2500,h_1667,al_c/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png",
      "https://thepakistanitraveller.assamartist.com/wp-content/uploads/2024/11/Sikh-Pilgrimage-Heritage-Trail-Map-of-Pakistan-By-Assam-Artist-Watermarks.jpg",
      "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTQ5OTYyNzQwLTRlNDItMTFlZi1hYzA1LTVmMzMyMjcyZGNhNS5qcGc=",
      "https://static.wixstatic.com/media/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png/v1/fill/w_2500,h_1667,al_c/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png",
      "https://thepakistanitraveller.assamartist.com/wp-content/uploads/2024/11/Sikh-Pilgrimage-Heritage-Trail-Map-of-Pakistan-By-Assam-Artist-Watermarks.jpg",
      "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTQ5OTYyNzQwLTRlNDItMTFlZi1hYzA1LTVmMzMyMjcyZGNhNS5qcGc=",
      "https://static.wixstatic.com/media/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png/v1/fill/w_2500,h_1667,al_c/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png",
      "https://static.wixstatic.com/media/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png/v1/fill/w_2500,h_1667,al_c/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png",
      "https://thepakistanitraveller.assamartist.com/wp-content/uploads/2024/11/Sikh-Pilgrimage-Heritage-Trail-Map-of-Pakistan-By-Assam-Artist-Watermarks.jpg",
      "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTQ5OTYyNzQwLTRlNDItMTFlZi1hYzA1LTVmMzMyMjcyZGNhNS5qcGc=",
      "https://static.wixstatic.com/media/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png/v1/fill/w_2500,h_1667,al_c/c4636e_d6df0a8f7f394865855fce927ef09ec6~mv2.png",
      "https://thepakistanitraveller.assamartist.com/wp-content/uploads/2024/11/Sikh-Pilgrimage-Heritage-Trail-Map-of-Pakistan-By-Assam-Artist-Watermarks.jpg",
      "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTQ5OTYyNzQwLTRlNDItMTFlZi1hYzA1LTVmMzMyMjcyZGNhNS5qcGc=",

    ],

    availability: [
      { date: "2026-04-15", available: 24, maxCapacity: 30, price: 899.99 },
      { date: "2026-05-20", available: 18, maxCapacity: 30, price: 899.99 },
      { date: "2026-06-10", available: 22, maxCapacity: 30, price: 899.99 },
      { date: "2026-10-15", available: 15, maxCapacity: 30, price: 999.99 },
      { date: "2026-11-12", available: 28, maxCapacity: 30, price: 899.99 }
    ],
    categoryId: 1,
    description: "Embark on a spiritual journey to the most sacred Sikh sites in Pakistan, including the birthplace of Guru Nanak Dev Ji and other historically significant gurdwaras. Experience the rich Sikh heritage with professional guides and complete visa assistance.",
    inclusions: [
      "Pakistan visa processing assistance",
      "4-star hotel accommodation throughout the tour",
      "All domestic transportation in air-conditioned vehicles",
      "Professional Sikh history guide (English/Punjabi speaking)",
      "Entry fees to all gurdwaras and historical sites",
      "Vegetarian meals (breakfast, lunch, dinner) as per Sikh dietary laws",
      "Langar experiences at major gurdwaras",
      "Border crossing assistance via Kartarpur Corridor",
      "Airport transfers (Lahore/Islamabad)",
      "Traditional Punjabi cultural show",
      "Bottled water throughout the journey",
      "Travel insurance within Pakistan",
      "Sacred souvenirs and religious books"
    ],
    exclusions: [
      "International flights to/from Pakistan",
      "India-Pakistan visa fees (approx $60 USD)",
      "Personal shopping and souvenirs",
      "Tips for guides and drivers",
      "Phone calls and internet charges",
      "Laundry services",
      "Medical expenses and prescriptions",
      "Any activities not mentioned in itinerary",
      "Emergency evacuation insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Lahore - Gurdwara Dera Sahib",
        description: "Begin your spiritual journey at the historic city of Lahore with a visit to the martyrdom site of Guru Arjan Dev Ji",
        activities: [
          { time: "10:00 AM", description: "Arrival at Lahore Airport, meet and greet" },
          { time: "12:00 PM", description: "Hotel check-in and welcome briefing" },
          { time: "02:00 PM", description: "Visit Gurdwara Dera Sahib (martyrdom site of Guru Arjan Dev)" },
          { time: "04:00 PM", description: "Explore Lahore Fort and Badshahi Mosque" },
          { time: "06:00 PM", description: "Evening prayers and kirtan at Gurdwara Dera Sahib" },
          { time: "08:00 PM", description: "Traditional Punjabi dinner at hotel" }
        ],
        meals: [
          { type: "Lunch", description: "Welcome vegetarian lunch at hotel" },
          { type: "Dinner", description: "Traditional Punjabi cuisine" }
        ],
        accommodation: "4-star hotel in Lahore city center"
      },
      {
        day: 2,
        title: "Nankana Sahib - Birthplace of Guru Nanak",
        description: "Visit the most sacred site for Sikhs - the birthplace of Guru Nanak Dev Ji",
        activities: [
          { time: "08:00 AM", description: "Early morning departure to Nankana Sahib (75km from Lahore)" },
          { time: "10:00 AM", description: "Visit Gurdwara Janam Asthan - birthplace of Guru Nanak" },
          { time: "12:00 PM", description: "Participate in langar (community kitchen)" },
          { time: "02:00 PM", description: "Visit Gurdwara Bal Lila - childhood playground of Guru Nanak" },
          { time: "04:00 PM", description: "Visit Gurdwara Tambu Sahib" },
          { time: "06:00 PM", description: "Evening prayers and meditation" },
          { time: "08:00 PM", description: "Overnight stay at gurdwara guest house" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Langar at Gurdwara Janam Asthan" },
          { type: "Dinner", description: "Simple vegetarian meal at gurdwara" }
        ],
        accommodation: "Gurdwara guest house in Nankana Sahib"
      },
      {
        day: 3,
        title: "Kartarpur Sahib - Final Resting Place",
        description: "Visit the gurdwara where Guru Nanak spent his final years via the historic Kartarpur Corridor",
        activities: [
          { time: "09:00 AM", description: "Return journey to Lahore" },
          { time: "11:00 AM", description: "Travel to Kartarpur Corridor border crossing" },
          { time: "01:00 PM", description: "Cross into Kartarpur via the corridor" },
          { time: "02:00 PM", description: "Visit Gurdwara Darbar Sahib Kartarpur" },
          { time: "04:00 PM", description: "Explore the museum and Guru Nanak's final resting place" },
          { time: "06:00 PM", description: "Evening prayers and kirtan" },
          { time: "08:00 PM", description: "Return to Lahore via corridor" }
        ],
        meals: [
          { type: "Breakfast", description: "Early breakfast at gurdwara" },
          { type: "Lunch", description: "Langar at Kartarpur Sahib" },
          { type: "Dinner", description: "Dinner at Lahore hotel" }
        ],
        accommodation: "4-star hotel in Lahore"
      },
      {
        day: 4,
        title: "Hasan Abdal - Panja Sahib",
        description: "Journey to the sacred site where Guru Nanak's handprint is preserved",
        activities: [
          { time: "08:00 AM", description: "Early departure to Hasan Abdal (2-hour drive)" },
          { time: "10:30 AM", description: "Visit Gurdwara Panja Sahib" },
          { time: "12:00 PM", description: "See the sacred rock with Guru Nanak's handprint" },
          { time: "01:00 PM", description: "Learn about the historical significance from guide" },
          { time: "03:00 PM", description: "Participate in langar service" },
          { time: "05:00 PM", description: "Evening prayers and meditation" },
          { time: "07:00 PM", description: "Return journey to Lahore" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Langar at Panja Sahib" },
          { type: "Dinner", description: "Dinner at Lahore hotel" }
        ],
        accommodation: "4-star hotel in Lahore"
      },
      {
        day: 5,
        title: "Sacha Sauda & Local Gurdwaras",
        description: "Visit additional sacred sites and explore Sikh heritage in Punjab",
        activities: [
          { time: "09:00 AM", description: "Visit Gurdwara Sacha Sauda in Farooqabad" },
          { time: "11:00 AM", description: "Learn about Guru Nanak's trade dispute resolution" },
          { time: "01:00 PM", description: "Visit local Sikh heritage sites in Lahore" },
          { time: "03:00 PM", description: "Explore Sikh museum and library" },
          { time: "05:00 PM", description: "Traditional Punjabi cultural show" },
          { time: "07:00 PM", description: "Group dinner with local Sikh community" },
          { time: "09:00 PM", description: "Free time for personal reflection" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Traditional Punjabi vegetarian meal" },
          { type: "Dinner", description: "Community dinner with local Sikhs" }
        ],
        accommodation: "4-star hotel in Lahore"
      },
      {
        day: 6,
        title: "Rohri Sahib & Spiritual Reflection",
        description: "Visit the final major gurdwara and spend time in spiritual contemplation",
        activities: [
          { time: "09:00 AM", description: "Visit Gurdwara Rohri Sahib in Airwan" },
          { time: "11:00 AM", description: "Historical tour of the gurdwara complex" },
          { time: "01:00 PM", description: "Personal prayer and meditation time" },
          { time: "03:00 PM", description: "Group discussion on spiritual experiences" },
          { time: "05:00 PM", description: "Purchase religious books and souvenirs" },
          { time: "07:00 PM", description: "Farewell dinner with traditional entertainment" },
          { time: "09:00 PM", description: "Final evening prayers together" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Langar at Rohri Sahib" },
          { type: "Dinner", description: "Special farewell dinner" }
        ],
        accommodation: "4-star hotel in Lahore"
      },
      {
        day: 7,
        title: "Departure",
        description: "Final prayers and departure from Lahore",
        activities: [
          { time: "09:00 AM", description: "Final visit to Gurdwara Dera Sahib for morning prayers" },
          { time: "11:00 AM", description: "Hotel check-out and luggage collection" },
          { time: "12:00 PM", description: "Last-minute shopping at local markets" },
          { time: "02:00 PM", description: "Group lunch and sharing of experiences" },
          { time: "04:00 PM", description: "Transfer to Lahore Airport" },
          { time: "06:00 PM", description: "Departure assistance and farewell" }
        ],
        meals: [
          { type: "Breakfast", description: "Final breakfast at hotel" },
          { type: "Lunch", description: "Farewell group lunch" }
        ],
        accommodation: "Check-out and departure"
      }
    ],
    highlights: [
      "Visit birthplace of Guru Nanak Dev Ji at Nankana Sahib",
      "Experience the sacred handprint at Panja Sahib",
      "Cross the historic Kartarpur Corridor",
      "Participate in authentic langar experiences",
      "Professional Sikh history guide throughout",
      "Complete visa and border crossing assistance",
      "Stay overnight at sacred gurdwara guest house",
      "Traditional Punjabi cultural experiences",
      "Small group pilgrimage (max 30 people)",
      "All vegetarian meals following Sikh dietary laws"
    ],
    difficulty: "Easy",
    groupSize: { min: 8, max: 30 },
    maxCapacity: 30,
    bestTime: "October to March (cooler weather)",
    cancellationPolicy: "Free cancellation up to 14 days before departure (visa fees non-refundable)"
  },
  2: {
    id: 2,
    name: "Sacred Umrah Pilgrimage - Makkah & Madinah",
    destination: "Makkah & Madinah, Saudi Arabia",
    duration: "8 days",
    basePrice: 2899.99,
    image: "https://i3.wp.com/mawakebholidays.com//storage/2024/09/Umrah-Rituals-Tips-and-Insights-mawakeb-travel-Umrah-trips-to-mecca-tours-to-Umrah-madina-Mecca-Saudi-Arabia-Umrah-by-Air-Umrah-programs.png",
    images: [
      "https://i3.wp.com/mawakebholidays.com//storage/2024/09/Umrah-Rituals-Tips-and-Insights-mawakeb-travel-Umrah-trips-to-mecca-tours-to-Umrah-madina-Mecca-Saudi-Arabia-Umrah-by-Air-Umrah-programs.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY5HcASlDlEpfg499R3NBsxe9dryh70mG-8A&s",
      "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2022/07/25/3351786-530607822.jpg?itok=jGzYso5I",
      "https://www.makkahtour.co.uk/img/may/1.jpg",
    ],
    availability: [
      { date: "2026-04-20", available: 35, maxCapacity: 40, price: 2899.99 },
      { date: "2026-05-15", available: 28, maxCapacity: 40, price: 3199.99 },
      { date: "2026-06-10", available: 32, maxCapacity: 40, price: 2899.99 },
      { date: "2026-09-05", available: 25, maxCapacity: 40, price: 3399.99 },
      { date: "2026-11-20", available: 38, maxCapacity: 40, price: 2899.99 }
    ],
    categoryId: 1,
    description: "Perform the sacred Umrah pilgrimage visiting the holiest sites in Islam. Experience spiritual fulfillment at Masjid al-Haram in Makkah and Masjid an-Nabawi in Madinah with complete guidance and premium accommodations.",
    inclusions: [
      "Saudi Arabia Umrah visa processing assistance",
      "5-star hotel accommodation walking distance to Haram",
      "All domestic transportation in luxury air-conditioned vehicles",
      "Professional Islamic scholar guide (Arabic/English/Urdu)",
      "Complete Umrah ritual guidance and support",
      "All halal meals (breakfast, lunch, dinner) throughout journey",
      "Ihram clothing and prayer materials provided",
      "Zamzam water supply and religious books",
      "Airport transfers (Jeddah/Madinah airports)",
      "24/7 medical support and emergency assistance",
      "Group coordination for all religious activities",
      "Ziyarat tours to historical Islamic sites",
      "Travel insurance within Saudi Arabia",
      "Complimentary dates and Arabic coffee"
    ],
    exclusions: [
      "International flights to/from Saudi Arabia",
      "Saudi Arabia visa fees (approx $200 USD)",
      "Personal shopping and souvenirs",
      "Optional excursions outside religious sites",
      "Tips for guides and drivers",
      "Laundry services and personal items",
      "Phone calls and international internet",
      "Excess baggage fees",
      "Personal medical expenses and prescriptions",
      "Any activities not mentioned in itinerary"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jeddah - Journey to Makkah",
        description: "Begin your sacred Umrah pilgrimage with arrival in the holy city of Makkah",
        activities: [
          { time: "10:00 AM", description: "Arrival at King Abdulaziz International Airport, Jeddah" },
          { time: "12:00 PM", description: "Transfer to Makkah (1.5-hour journey)" },
          { time: "02:00 PM", description: "Hotel check-in near Masjid al-Haram" },
          { time: "04:00 PM", description: "Orientation and Ihram preparation guidance" },
          { time: "06:00 PM", description: "First visit to Masjid al-Haram for prayers" },
          { time: "08:00 PM", description: "Group dinner and spiritual preparation" }
        ],
        meals: [
          { type: "Lunch", description: "Halal meal during transfer" },
          { type: "Dinner", description: "Traditional Arabian cuisine at hotel" }
        ],
        accommodation: "5-star hotel walking distance to Haram"
      },
      {
        day: 2,
        title: "Umrah Performance Day 1 - Tawaf & Sa'i",
        description: "Perform the sacred rituals of Tawaf around the Kaaba and Sa'i between Safa and Marwah",
        activities: [
          { time: "04:00 AM", description: "Pre-dawn preparation and spiritual guidance" },
          { time: "05:00 AM", description: "Enter Ihram state and proceed to Masjid al-Haram" },
          { time: "06:00 AM", description: "Perform Tawaf al-Umrah (7 circuits around Kaaba)" },
          { time: "08:00 AM", description: "Prayer at Maqam Ibrahim and Zamzam water" },
          { time: "09:00 AM", description: "Perform Sa'i between Safa and Marwah hills" },
          { time: "11:00 AM", description: "Hair cutting ceremony (men) / Hair trimming (women)" },
          { time: "12:00 PM", description: "Completion of Umrah - exit from Ihram" },
          { time: "02:00 PM", description: "Rest and reflection time" },
          { time: "06:00 PM", description: "Evening prayers at Masjid al-Haram" }
        ],
        meals: [
          { type: "Breakfast", description: "Light pre-ritual breakfast" },
          { type: "Lunch", description: "Celebration meal after Umrah completion" },
          { type: "Dinner", description: "Buffet dinner at hotel" }
        ],
        accommodation: "5-star hotel walking distance to Haram"
      },
      {
        day: 3,
        title: "Makkah Ziyarat - Historical Islamic Sites",
        description: "Visit the historical sites significant to Islamic history around Makkah",
        activities: [
          { time: "09:00 AM", description: "Visit Cave of Hira (Jabal al-Nour)" },
          { time: "11:00 AM", description: "Jabal Thawr and Cave of Thawr" },
          { time: "01:00 PM", description: "Visit to Jannat al-Mu'alla cemetery" },
          { time: "03:00 PM", description: "Masjid al-Jinn (Mosque of Jinn)" },
          { time: "05:00 PM", description: "Personal prayers at Masjid al-Haram" },
          { time: "07:00 PM", description: "Evening Tawaf (optional additional circuits)" },
          { time: "09:00 PM", description: "Group reflection and Islamic lectures" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Packed halal lunch during tours" },
          { type: "Dinner", description: "Traditional Saudi cuisine" }
        ],
        accommodation: "5-star hotel walking distance to Haram"
      },
      {
        day: 4,
        title: "Additional Prayers & Preparation for Madinah",
        description: "Final prayers in Makkah and preparation for journey to Madinah",
        activities: [
          { time: "05:00 AM", description: "Fajr prayers at Masjid al-Haram" },
          { time: "07:00 AM", description: "Hotel check-out and luggage preparation" },
          { time: "09:00 AM", description: "Final Tawaf al-Wada (Farewell Tawaf)" },
          { time: "11:00 AM", description: "Shopping for religious items and souvenirs" },
          { time: "02:00 PM", description: "Departure to Madinah (5-hour comfortable journey)" },
          { time: "07:00 PM", description: "Arrival and check-in at Madinah hotel" },
          { time: "08:30 PM", description: "First visit to Masjid an-Nabawi for Maghrib prayers" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Lunch during travel to Madinah" },
          { type: "Dinner", description: "Welcome dinner in Madinah" }
        ],
        accommodation: "5-star hotel near Masjid an-Nabawi"
      },
      {
        day: 5,
        title: "Masjid an-Nabawi - Prophet's Mosque",
        description: "Spiritual experience at the Prophet's Mosque and Islamic history exploration",
        activities: [
          { time: "05:00 AM", description: "Fajr prayers at Masjid an-Nabawi" },
          { time: "07:00 AM", description: "Visit to Rawdah Sharif (blessed garden)" },
          { time: "09:00 AM", description: "Prayers at Prophet Muhammad's tomb area" },
          { time: "11:00 AM", description: "Islamic history lecture in mosque premises" },
          { time: "01:00 PM", description: "Visit to Quba Mosque (first mosque built by Prophet)" },
          { time: "03:00 PM", description: "Qiblatain Mosque (two Qiblas mosque)" },
          { time: "05:00 PM", description: "Personal prayers and Quran recitation" },
          { time: "07:00 PM", description: "Evening prayers at Prophet's Mosque" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Lunch near Quba Mosque" },
          { type: "Dinner", description: "Traditional Madinah cuisine" }
        ],
        accommodation: "5-star hotel near Masjid an-Nabawi"
      },
      {
        day: 6,
        title: "Madinah Ziyarat - Battle Sites & Historical Places",
        description: "Visit significant Islamic historical sites around Madinah",
        activities: [
          { time: "08:00 AM", description: "Visit to Mount Uhud and battlefield site" },
          { time: "10:00 AM", description: "Martyrs' cemetery at Uhud" },
          { time: "12:00 PM", description: "Date farms and agricultural areas" },
          { time: "02:00 PM", description: "Seven Mosques (Sab'a Masajid)" },
          { time: "04:00 PM", description: "Al-Baqi cemetery (companions' burial ground)" },
          { time: "06:00 PM", description: "Final prayers at Masjid an-Nabawi" },
          { time: "08:00 PM", description: "Farewell dinner and group sharing" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Traditional lunch at date farm" },
          { type: "Dinner", description: "Special farewell dinner" }
        ],
        accommodation: "5-star hotel near Masjid an-Nabawi"
      },
      {
        day: 7,
        title: "Return to Jeddah & Shopping",
        description: "Return journey to Jeddah with shopping opportunities",
        activities: [
          { time: "08:00 AM", description: "Final prayers at Masjid an-Nabawi" },
          { time: "10:00 AM", description: "Hotel check-out and departure to Jeddah" },
          { time: "03:00 PM", description: "Arrival in Jeddah and hotel check-in" },
          { time: "05:00 PM", description: "Shopping at traditional souks and malls" },
          { time: "07:00 PM", description: "Visit to Jeddah Corniche waterfront" },
          { time: "09:00 PM", description: "Final group dinner and reflection" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Lunch during travel to Jeddah" },
          { type: "Dinner", description: "Final group dinner at Jeddah" }
        ],
        accommodation: "5-star hotel near Jeddah airport"
      },
      {
        day: 8,
        title: "Departure",
        description: "Final prayers and departure from Saudi Arabia",
        activities: [
          { time: "09:00 AM", description: "Final prayers and spiritual reflection" },
          { time: "11:00 AM", description: "Hotel check-out and airport transfer" },
          { time: "12:00 PM", description: "Last-minute shopping at airport" },
          { time: "02:00 PM", description: "Departure assistance and farewell" }
        ],
        meals: [
          { type: "Breakfast", description: "Final breakfast at hotel" }
        ],
        accommodation: "Check-out and departure"
      }
    ],
    highlights: [
      "Performance of complete Umrah pilgrimage with guidance",
      "Stay within walking distance of Masjid al-Haram",
      "Visit to Prophet's Mosque and Rawdah Sharif",
      "Professional Islamic scholar guidance throughout",
      "Ziyarat tours to all significant Islamic historical sites",
      "Traditional Saudi Arabian cultural experiences",
      "24/7 religious and medical support",
      "Small group experience (max 40 pilgrims)",
      "Complete Ihram clothing and religious materials",
      "Zamzam water and blessed items included"
    ],
    difficulty: "Easy",
    groupSize: { min: 15, max: 40 },
    maxCapacity: 40,
    bestTime: "Year-round (avoid Hajj season July-September)",
    cancellationPolicy: "Free cancellation up to 21 days before departure (visa fees non-refundable)"
  },
  3: {
    id: 3,
    name: "Complete Hajj Pilgrimage - Makkah & Madinah",
    destination: "Makkah, Mina, Arafat & Madinah, Saudi Arabia",
    duration: "14 days",
    basePrice: 8999.99,
    image: "https://dailypost.ng/wp-content/uploads/2019/07/Hajj2-1.jpg",
    images: [
      "https://dailypost.ng/wp-content/uploads/2019/07/Hajj2-1.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY5HcASlDlEpfg499R3NBsxe9dryh70mG-8A&s",
      "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2022/07/25/3351786-530607822.jpg?itok=jGzYso5I",
      "https://www.makkahtour.co.uk/img/may/1.jpg",
    ],
    availability: [
      { date: "2026-06-15", available: 45, maxCapacity: 50, price: 8999.99 },
      { date: "2026-07-20", available: 38, maxCapacity: 50, price: 9499.99 },
      { date: "2026-08-10", available: 42, maxCapacity: 50, price: 9999.99 }
    ],
    categoryId: 1,
    description: "Perform the complete Hajj pilgrimage, one of the Five Pillars of Islam. Experience the most sacred journey with expert guidance through all essential rituals including Arafat, Mina, and Muzdalifah with luxury accommodations and comprehensive support.",
    inclusions: [
      "Saudi Arabia Hajj visa processing and government quota allocation",
      "Luxury 5-star hotel accommodation near Masjid al-Haram",
      "Premium tented accommodation in Mina during Hajj days",
      "All domestic transportation in VIP air-conditioned vehicles",
      "Professional Islamic scholar and Hajj guide (Arabic/English/Urdu)",
      "Complete Hajj ritual guidance and step-by-step assistance",
      "All halal meals (breakfast, lunch, dinner) throughout journey",
      "Multiple sets of Ihram clothing and all prayer materials",
      "Zamzam water supply and comprehensive religious book package",
      "Airport transfers (Jeddah/Madinah airports)",
      "24/7 medical support team and emergency assistance",
      "Group coordination for all Hajj rituals and prayers",
      "Ziyarat tours to all historical Islamic sites",
      "Premium travel insurance within Saudi Arabia",
      "Traditional dates, Arabic coffee, and blessed items",
      "Barber services for men's hair cutting after Hajj",
      "Luggage handling and porter services during travel"
    ],
    exclusions: [
      "International flights to/from Saudi Arabia",
      "Saudi Arabia Hajj visa fees (approx $800 USD)",
      "Personal shopping and souvenirs beyond included items",
      "Optional additional Umrah performances",
      "Tips for guides, drivers, and service staff",
      "Laundry services and personal hygiene items",
      "International phone calls and premium internet",
      "Excess baggage fees and cargo services",
      "Personal medical expenses and specialized prescriptions",
      "Wheelchair or mobility assistance services",
      "Private room upgrades (standard is shared accommodation)",
      "Any rituals or services not mentioned in itinerary"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jeddah - Journey to Makkah",
        description: "Begin the sacred Hajj pilgrimage with arrival and preparation in Makkah",
        activities: [
          { time: "10:00 AM", description: "Arrival at King Abdulaziz International Airport, Jeddah" },
          { time: "12:00 PM", description: "VIP transfer to Makkah with Hajj orientation" },
          { time: "02:00 PM", description: "Check-in at luxury hotel near Masjid al-Haram" },
          { time: "04:00 PM", description: "Comprehensive Hajj preparation session and Ihram guidance" },
          { time: "06:00 PM", description: "First visit to Masjid al-Haram for prayers and familiarization" },
          { time: "08:00 PM", description: "Welcome dinner and group introduction" }
        ],
        meals: [
          { type: "Lunch", description: "Premium halal meal during transfer" },
          { type: "Dinner", description: "Traditional Arabian welcome feast" }
        ],
        accommodation: "5-star hotel walking distance to Haram"
      },
      {
        day: 2,
        title: "Hajj Preparation - Umrah Performance",
        description: "Perform Umrah and complete preparation for the main Hajj rituals",
        activities: [
          { time: "04:00 AM", description: "Pre-dawn spiritual preparation and Ihram donning" },
          { time: "05:00 AM", description: "Enter state of Ihram and proceed to Masjid al-Haram" },
          { time: "06:00 AM", description: "Perform Tawaf al-Qudum (Arrival Tawaf)" },
          { time: "08:00 AM", description: "Sa'i between Safa and Marwah hills" },
          { time: "10:00 AM", description: "Remain in Ihram state for Hajj (no hair cutting)" },
          { time: "12:00 PM", description: "Rest and spiritual reflection" },
          { time: "02:00 PM", description: "Hajj education session - rituals explanation" },
          { time: "06:00 PM", description: "Group prayers at Masjid al-Haram" },
          { time: "08:00 PM", description: "Final preparations for departure to Mina" }
        ],
        meals: [
          { type: "Breakfast", description: "Light pre-ritual breakfast" },
          { type: "Lunch", description: "Simple meal maintaining Ihram state" },
          { type: "Dinner", description: "Nutritious dinner at hotel" }
        ],
        accommodation: "5-star hotel walking distance to Haram"
      },
      {
        day: 3,
        title: "8th Dhul Hijjah - Departure to Mina (Yawm al-Tarwiyah)",
        description: "First official day of Hajj - journey to Mina for overnight stay",
        activities: [
          { time: "09:00 AM", description: "Final preparations and group assembly" },
          { time: "10:00 AM", description: "Departure to Mina in organized convoy" },
          { time: "12:00 PM", description: "Arrival and settling in premium tented accommodation" },
          { time: "01:00 PM", description: "Zuhr prayers in congregation at Mina" },
          { time: "03:00 PM", description: "Rest and spiritual reflection in tents" },
          { time: "04:00 PM", description: "Asr prayers and group Islamic lectures" },
          { time: "06:00 PM", description: "Maghrib prayers and community bonding" },
          { time: "08:00 PM", description: "Isha prayers and night spent in worship" },
          { time: "10:00 PM", description: "Overnight stay in Mina as per Sunnah" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel before departure" },
          { type: "Lunch", description: "Meal service in Mina tents" },
          { type: "Dinner", description: "Simple Iftar-style meal in Mina" }
        ],
        accommodation: "Premium air-conditioned tents in Mina"
      },
      {
        day: 4,
        title: "9th Dhul Hijjah - Day of Arafat (Yawm Arafat)",
        description: "The most important day of Hajj - standing at Mount Arafat for prayers and supplications",
        activities: [
          { time: "05:00 AM", description: "Fajr prayers and light breakfast in Mina" },
          { time: "07:00 AM", description: "Departure from Mina to Mount Arafat" },
          { time: "09:00 AM", description: "Arrival at Arafat and settling in designated area" },
          { time: "10:00 AM", description: "Continuous prayers, supplications, and Quran recitation" },
          { time: "12:00 PM", description: "Combined Zuhr and Asr prayers (Jam' Taqdim)" },
          { time: "02:00 PM", description: "Continued worship and spiritual reflection at Arafat" },
          { time: "04:00 PM", description: "Peak time for prayers and seeking forgiveness" },
          { time: "06:30 PM", description: "Sunset departure from Arafat to Muzdalifah" },
          { time: "08:00 PM", description: "Arrival at Muzdalifah for Maghrib and Isha prayers" },
          { time: "10:00 PM", description: "Overnight stay under the open sky (weather permitting)" }
        ],
        meals: [
          { type: "Breakfast", description: "Light breakfast in Mina" },
          { type: "Lunch", description: "Packed meal service at Arafat" },
          { type: "Dinner", description: "Simple meal at Muzdalifah" }
        ],
        accommodation: "Overnight at Muzdalifah (outdoor/basic shelter)"
      },
      {
        day: 5,
        title: "10th Dhul Hijjah - Eid al-Adha & Jamarat (Yawm an-Nahr)",
        description: "Eid day with stoning ritual, sacrifice, hair cutting, and Tawaf al-Ifadah",
        activities: [
          { time: "05:00 AM", description: "Fajr prayers at Muzdalifah and pebble collection" },
          { time: "06:00 AM", description: "Return journey to Mina after sunrise" },
          { time: "08:00 AM", description: "Stoning of Jamarat al-Aqaba (large pillar only)" },
          { time: "10:00 AM", description: "Animal sacrifice (Qurbani) arranged by tour operators" },
          { time: "12:00 PM", description: "Hair cutting/trimming ceremony for men and women" },
          { time: "01:00 PM", description: "Partial exit from Ihram state (first Tahallul)" },
          { time: "02:00 PM", description: "Return to Makkah for Tawaf al-Ifadah" },
          { time: "04:00 PM", description: "Perform Sa'i (if not done during Umrah)" },
          { time: "06:00 PM", description: "Complete exit from Ihram (second Tahallul)" },
          { time: "08:00 PM", description: "Eid celebration dinner and congratulations" }
        ],
        meals: [
          { type: "Breakfast", description: "Early breakfast at Muzdalifah" },
          { type: "Lunch", description: "Eid celebration meal in Makkah" },
          { type: "Dinner", description: "Special Eid dinner at hotel" }
        ],
        accommodation: "5-star hotel near Masjid al-Haram"
      },
      {
        day: 6,
        title: "11th Dhul Hijjah - Tashriq Day 1 & Stoning",
        description: "First day of Tashriq - return to Mina for stoning all three Jamarat",
        activities: [
          { time: "09:00 AM", description: "Return to Mina for Tashriq days" },
          { time: "11:00 AM", description: "Settle in tented accommodation" },
          { time: "01:00 PM", description: "Zuhr prayers in congregation" },
          { time: "02:00 PM", description: "Stoning all three Jamarat (small, medium, large)" },
          { time: "04:00 PM", description: "Asr prayers and rest in Mina" },
          { time: "06:00 PM", description: "Maghrib prayers and Islamic lectures" },
          { time: "08:00 PM", description: "Isha prayers and community activities" },
          { time: "10:00 PM", description: "Night prayers and reflection" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel before departure" },
          { type: "Lunch", description: "Lunch service in Mina" },
          { type: "Dinner", description: "Dinner in Mina tents" }
        ],
        accommodation: "Premium air-conditioned tents in Mina"
      },
      {
        day: 7,
        title: "12th Dhul Hijjah - Tashriq Day 2 & Optional Departure",
        description: "Second day of Tashriq with stoning ritual and option to leave Mina",
        activities: [
          { time: "10:00 AM", description: "Morning prayers and spiritual preparation" },
          { time: "01:00 PM", description: "Zuhr prayers in Mina" },
          { time: "02:00 PM", description: "Second day stoning of all three Jamarat" },
          { time: "04:00 PM", description: "Option to leave Mina or stay for third day" },
          { time: "05:00 PM", description: "For those leaving: departure to Makkah" },
          { time: "06:00 PM", description: "For those staying: Maghrib prayers in Mina" },
          { time: "08:00 PM", description: "Group decision and preparation for next day" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast in Mina" },
          { type: "Lunch", description: "Lunch in Mina" },
          { type: "Dinner", description: "Dinner in Mina or Makkah hotel" }
        ],
        accommodation: "Mina tents or 5-star hotel in Makkah"
      },
      {
        day: 8,
        title: "13th Dhul Hijjah - Final Stoning & Tawaf al-Wada",
        description: "Final day of Hajj rituals with last stoning and farewell Tawaf",
        activities: [
          { time: "10:00 AM", description: "Final morning in Mina or arrival from Makkah" },
          { time: "01:00 PM", description: "Final stoning of all three Jamarat (for those who stayed)" },
          { time: "03:00 PM", description: "Departure from Mina to Makkah" },
          { time: "05:00 PM", description: "Rest and preparation for Tawaf al-Wada" },
          { time: "07:00 PM", description: "Perform Tawaf al-Wada (Farewell Tawaf)" },
          { time: "09:00 PM", description: "Hajj completion celebration and congratulations" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast in Mina" },
          { type: "Lunch", description: "Lunch in Mina" },
          { type: "Dinner", description: "Hajj completion celebration dinner" }
        ],
        accommodation: "5-star hotel near Masjid al-Haram"
      },
      {
        day: 9,
        title: "Makkah Ziyarat & Historical Sites",
        description: "Visit important Islamic historical sites around Makkah",
        activities: [
          { time: "09:00 AM", description: "Visit Cave of Hira (Jabal al-Nour) where first revelation came" },
          { time: "11:00 AM", description: "Jabal Thawr and Cave of Thawr (Migration hiding place)" },
          { time: "01:00 PM", description: "Visit Jannat al-Mu'alla cemetery (Khadijah's burial)" },
          { time: "03:00 PM", description: "Masjid al-Jinn and other historical mosques" },
          { time: "05:00 PM", description: "Optional additional Tawaf at Masjid al-Haram" },
          { time: "07:00 PM", description: "Shopping for religious items and souvenirs" },
          { time: "09:00 PM", description: "Group reflection on Hajj experience" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Packed lunch during site visits" },
          { type: "Dinner", description: "Traditional Saudi dinner" }
        ],
        accommodation: "5-star hotel near Masjid al-Haram"
      },
      {
        day: 10,
        title: "Departure to Madinah - The Prophet's City",
        description: "Journey to the blessed city of Madinah",
        activities: [
          { time: "08:00 AM", description: "Final prayers at Masjid al-Haram" },
          { time: "10:00 AM", description: "Hotel check-out and departure to Madinah" },
          { time: "03:00 PM", description: "Arrival in Madinah and hotel check-in" },
          { time: "05:00 PM", description: "First visit to Masjid an-Nabawi for Asr prayers" },
          { time: "07:00 PM", description: "Maghrib prayers at Prophet's Mosque" },
          { time: "09:00 PM", description: "Welcome dinner in Madinah and orientation" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at Makkah hotel" },
          { type: "Lunch", description: "Lunch during travel to Madinah" },
          { type: "Dinner", description: "Welcome dinner in Madinah" }
        ],
        accommodation: "5-star hotel near Masjid an-Nabawi"
      },
      {
        day: 11,
        title: "Masjid an-Nabawi - The Prophet's Mosque",
        description: "Full day spiritual experience at the Prophet's Mosque",
        activities: [
          { time: "05:00 AM", description: "Fajr prayers at Masjid an-Nabawi" },
          { time: "07:00 AM", description: "Visit to Rawdah Sharif (the blessed garden)" },
          { time: "09:00 AM", description: "Prayers near Prophet Muhammad's tomb (Hujra Sharif)" },
          { time: "11:00 AM", description: "Islamic history lecture in mosque premises" },
          { time: "01:00 PM", description: "Visit to Quba Mosque (first mosque)" },
          { time: "03:00 PM", description: "Qiblatain Mosque (mosque of two Qiblas)" },
          { time: "05:00 PM", description: "Return for Maghrib prayers at Prophet's Mosque" },
          { time: "07:00 PM", description: "Personal prayer time and Quran recitation" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Lunch near Quba Mosque" },
          { type: "Dinner", description: "Traditional Madinah cuisine" }
        ],
        accommodation: "5-star hotel near Masjid an-Nabawi"
      },
      {
        day: 12,
        title: "Madinah Historical Sites & Battle Locations",
        description: "Comprehensive tour of Islamic historical sites in Madinah",
        activities: [
          { time: "08:00 AM", description: "Visit Mount Uhud and Uhud battlefield" },
          { time: "10:00 AM", description: "Martyrs' cemetery and graves of companions" },
          { time: "12:00 PM", description: "Visit to local date farms and agricultural areas" },
          { time: "02:00 PM", description: "Seven Mosques (Sab'a Masajid) tour" },
          { time: "04:00 PM", description: "Al-Baqi cemetery (companions' final resting place)" },
          { time: "06:00 PM", description: "Final afternoon prayers at Masjid an-Nabawi" },
          { time: "08:00 PM", description: "Farewell dinner with traditional entertainment" }
        ],
        meals: [
          { type: "Breakfast", description: "Breakfast at hotel" },
          { type: "Lunch", description: "Traditional lunch at date farm" },
          { type: "Dinner", description: "Special farewell dinner" }
        ],
        accommodation: "5-star hotel near Masjid an-Nabawi"
      },
      {
        day: 13,
        title: "Final Day in Madinah & Return to Jeddah",
        description: "Last prayers in Madinah and journey back to Jeddah",
        activities: [
          { time: "08:00 AM", description: "Final Fajr prayers at Masjid an-Nabawi" },
          { time: "10:00 AM", description: "Hotel check-out and final visit to Prophet's Mosque" },
          { time: "12:00 PM", description: "Departure from Madinah to Jeddah" },
          { time: "05:00 PM", description: "Arrival in Jeddah and airport hotel check-in" },
          { time: "07:00 PM", description: "Final shopping at traditional markets" },
          { time: "09:00 PM", description: "Final group dinner and Hajj reflection ceremony" }
        ],
        meals: [
          { type: "Breakfast", description: "Final breakfast at Madinah hotel" },
          { type: "Lunch", description: "Lunch during travel to Jeddah" },
          { type: "Dinner", description: "Final group dinner and celebration" }
        ],
        accommodation: "5-star airport hotel in Jeddah"
      },
      {
        day: 14,
        title: "Departure - Return Home as Hajji",
        description: "Final departure from Saudi Arabia as a Hajji (Hajj pilgrim)",
        activities: [
          { time: "09:00 AM", description: "Final prayers and spiritual reflection session" },
          { time: "11:00 AM", description: "Hotel check-out and airport transfer" },
          { time: "12:00 PM", description: "Airport shopping and final preparations" },
          { time: "02:00 PM", description: "Departure assistance and farewell ceremony" },
          { time: "04:00 PM", description: "Final group photo and Hajji congratulations" }
        ],
        meals: [
          { type: "Breakfast", description: "Final breakfast before departure" }
        ],
        accommodation: "Check-out and departure as Hajji"
      }
    ],
    highlights: [
      "Complete Hajj pilgrimage with expert Islamic scholar guidance",
      "Luxury accommodation within walking distance of both Harams",
      "Premium air-conditioned tents during Mina stay",
      "Full participation in all essential Hajj rituals (Arafat, Muzdalifah, Mina)",
      "Professional stoning assistance at Jamarat",
      "Visit to Prophet's Mosque and Rawdah Sharif in Madinah",
      "Comprehensive Ziyarat tours to all historical Islamic sites",
      "24/7 medical support throughout the journey",
      "VIP transportation and luggage handling",
      "Traditional Saudi cultural experiences and cuisine",
      "Small group experience (max 50 pilgrims) for personalized attention",
      "Complete religious materials and multiple Ihram sets",
      "Zamzam water and blessed items package",
      "Hajj completion certificate and commemorative gifts"
    ],
    difficulty: "Moderate",
    groupSize: { min: 25, max: 50 },
    maxCapacity: 50,
    bestTime: "Dhul Hijjah (Islamic calendar - dates vary yearly)",
    cancellationPolicy: "Free cancellation up to 45 days before departure (visa and quota fees non-refundable after processing)"
  },
  4: {
    id: 4,
    name: "Amsterdam Canal Cruise",
    destination: "Amsterdam, Netherlands",
    duration: "2 days",
    basePrice: 199.99,
    image: getImageUrl(),
    images: getMultipleImageUrls(4),
    availability: [
      { date: "2026-03-10", available: 5, maxCapacity: 15, price: 199.99 },
      { date: "2026-03-17", available: 10, maxCapacity: 15, price: 199.99 },
      { date: "2026-04-07", available: 0, maxCapacity: 15, price: 199.99 }
    ],
    categoryId: 3,
    description: "Enjoy a relaxing canal cruise, visit world-class museums, and explore the charming streets of Amsterdam.",
    inclusions: [
      "Canal cruise with dinner",
      "Museum pass (Rijksmuseum, Van Gogh)",
      "Hotel stay in city center",
      "Guided walking tour",
      "Bike rental for city exploration",
      "Professional local guide",
      "Welcome drink at hotel"
    ],
    exclusions: [
      "Flights",
      "Meals (except canal dinner)",
      "Airport transfers",
      "Personal expenses",
      "Optional Anne Frank House tickets"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Canal Cruise",
        description: "Begin with a scenic canal cruise and city orientation",
        activities: [
          { time: "10:00 AM", description: "Hotel check-in and welcome" },
          { time: "11:00 AM", description: "Canal cruise with dinner" },
          { time: "06:00 PM", description: "Evening walking tour of Red Light District" },
          { time: "08:00 PM", description: "Optional: Anne Frank House visit" }
        ],
        meals: [{ type: "Dinner", description: "Canal cruise dinner" }],
        accommodation: "4-star hotel in city center"
      },
      {
        day: 2,
        title: "Museums & Departure",
        description: "Explore world-class museums before departure",
        activities: [
          { time: "09:00 AM", description: "Rijksmuseum guided tour" },
          { time: "11:00 AM", description: "Van Gogh Museum visit" },
          { time: "02:00 PM", description: "Bike tour of city" },
          { time: "04:00 PM", description: "Optional: Shopping at Nine Streets" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }],
        accommodation: "Check-out and departure"
      }
    ],
    highlights: [
      "Canal cruise with dinner",
      "Museum pass included",
      "Bike rental included",
      "Professional local guide",
      "Small group (max 8 people)"
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 8 },
    maxCapacity: 15,
    bestTime: "March to October",
    cancellationPolicy: "Free cancellation up to 5 days before departure"
  },
  5: {
    id: 5,
    name: "Prague Castle Tour",
    destination: "Prague, Czech Republic",
    duration: "3 days",
    basePrice: 249.99,
    image: getImageUrl(),
    images: getMultipleImageUrls(4),
    availability: [
      { date: "2026-03-12", available: 10, maxCapacity: 18, price: 249.99 },
      { date: "2026-04-02", available: 8, maxCapacity: 18, price: 249.99 },
      { date: "2026-04-23", available: 0, maxCapacity: 18, price: 249.99 }
    ],
    categoryId: 2,
    description: "Step back in time with a comprehensive tour of Prague Castle, Charles Bridge, and the Old Town Square.",
    inclusions: [
      "Guided castle tour",
      "Walking tour of Old Town",
      "Hotel accommodation",
      "Charles Bridge visit",
      "Astronomical Clock show",
      "Czech beer tasting",
      "Professional historian guide",
      "Welcome dinner with traditional Czech cuisine"
    ],
    exclusions: [
      "Flights",
      "Personal expenses",
      "Airport transfers",
      "Optional excursions",
      "Tips for guides"
    ],
    itinerary: [
      {
        day: 1,
        title: "Prague Castle & Welcome",
        description: "Explore the largest ancient castle complex in the world",
        activities: [
          { time: "10:00 AM", description: "Hotel check-in and orientation" },
          { time: "11:00 AM", description: "Prague Castle guided tour" },
          { time: "02:00 PM", description: "St. Vitus Cathedral visit" },
          { time: "04:00 PM", description: "Golden Lane walk" },
          { time: "06:00 PM", description: "Evening: Traditional Czech dinner" }
        ],
        meals: [{ type: "Dinner", description: "Welcome Czech dinner" }],
        accommodation: "4-star hotel in Old Town"
      },
      {
        day: 2,
        title: "Old Town & Charles Bridge",
        description: "Discover the medieval heart of Prague",
        activities: [
          { time: "09:00 AM", description: "Old Town Square walk" },
          { time: "11:00 AM", description: "Astronomical Clock show" },
          { time: "02:00 PM", description: "Charles Bridge guided tour" },
          { time: "04:00 PM", description: "Jewish Quarter visit" },
          { time: "06:00 PM", description: "Evening: Czech beer tasting" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Beer tasting" }],
        accommodation: "4-star hotel in Old Town"
      },
      {
        day: 3,
        title: "Final Explorations",
        description: "Last day to explore and shop before departure",
        activities: [
          { time: "09:00 AM", description: "Wenceslas Square walk" },
          { time: "11:00 AM", description: "Optional: Shopping at Palladium" },
          { time: "02:00 PM", description: "Farewell lunch" },
          { time: "04:00 PM", description: "Optional: River cruise" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Farewell lunch" }],
        accommodation: "Check-out and departure"
      }
    ],
    highlights: [
      "Prague Castle comprehensive tour",
      "Czech beer tasting experience",
      "Professional historian guide",
      "Traditional Czech cuisine",
      "Small group (max 10 people)"
    ],
    difficulty: "Easy",
    groupSize: { min: 2, max: 10 },
    maxCapacity: 18,
    bestTime: "March to November",
    cancellationPolicy: "Free cancellation up to 7 days before departure"
  },
  6: {
    id: 6,
    name: "Swiss Alps Adventure",
    destination: "Swiss Alps, Switzerland",
    duration: "6 days",
    basePrice: 599.99,
    image: getImageUrl(),
    images: getMultipleImageUrls(4),
    availability: [
      { date: "2026-04-01", available: 3, maxCapacity: 12, price: 599.99 },
      { date: "2026-04-15", available: 9, maxCapacity: 12, price: 599.99 },
      { date: "2026-05-01", available: 0, maxCapacity: 12, price: 599.99 }
    ],
    categoryId: 2,
    description: "Experience the breathtaking beauty of the Swiss Alps with hiking, scenic train rides, and charming village visits.",
    inclusions: [
      "Mountain excursions",
      "Train passes for scenic routes",
      "Hotel accommodation in mountain villages",
      "Breakfast included daily",
      "Professional mountain guide",
      "Cable car passes",
      "Traditional Swiss dinner",
      "Equipment rental (hiking poles, etc.)"
    ],
    exclusions: [
      "Flights",
      "Ski equipment rental",
      "Personal expenses",
      "Optional spa treatments",
      "Tips for guides"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Zermatt",
        description: "Begin your alpine adventure in the car-free village of Zermatt",
        activities: [
          { time: "10:00 AM", description: "Hotel check-in and safety briefing" },
          { time: "11:00 AM", description: "Zermatt village orientation walk" },
          { time: "06:00 PM", description: "Evening: Traditional Swiss fondue dinner" },
          { time: "08:00 PM", description: "Optional: Stargazing session" }
        ],
        meals: [{ type: "Dinner", description: "Welcome Swiss fondue dinner" }],
        accommodation: "4-star hotel in Zermatt"
      },
      {
        day: 2,
        title: "Matterhorn Views",
        description: "Experience the iconic Matterhorn from multiple viewpoints",
        activities: [
          { time: "09:00 AM", description: "Cable car to Klein Matterhorn" },
          { time: "11:00 AM", description: "Hiking around Matterhorn viewpoints" },
          { time: "02:00 PM", description: "Gornergrat cogwheel train ride" },
          { time: "06:00 PM", description: "Evening: Mountain sunset viewing" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Mountain lunch" }],
        accommodation: "4-star hotel in Zermatt"
      },
      {
        day: 3,
        title: "Scenic Train to Interlaken",
        description: "Travel through stunning alpine landscapes to Interlaken",
        activities: [
          { time: "09:00 AM", description: "Scenic train journey to Interlaken" },
          { time: "11:00 AM", description: "Interlaken orientation walk" },
          { time: "02:00 PM", description: "Lake Thun boat cruise" },
          { time: "06:00 PM", description: "Evening: Swiss chocolate tasting" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Chocolate tasting" }],
        accommodation: "4-star hotel in Interlaken"
      },
      {
        day: 4,
        title: "Jungfraujoch Adventure",
        description: "Visit the Top of Europe at Jungfraujoch",
        activities: [
          { time: "09:00 AM", description: "Cogwheel train to Jungfraujoch" },
          { time: "11:00 AM", description: "Ice Palace visit" },
          { time: "02:00 PM", description: "Alpine hiking trails" },
          { time: "06:00 PM", description: "Evening: Traditional Swiss dinner" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Swiss dinner" }],
        accommodation: "4-star hotel in Interlaken"
      },
      {
        day: 5,
        title: "Lucerne & Lake",
        description: "Explore the charming city of Lucerne and its lake",
        activities: [
          { time: "09:00 AM", description: "Train to Lucerne" },
          { time: "11:00 AM", description: "Chapel Bridge walk" },
          { time: "02:00 PM", description: "Lake Lucerne boat cruise" },
          { time: "04:00 PM", description: "Old Town walking tour" },
          { time: "06:00 PM", description: "Evening: Swiss wine tasting" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Wine tasting" }],
        accommodation: "4-star hotel in Lucerne"
      },
      {
        day: 6,
        title: "Final Alpine Day",
        description: "Last day to explore and enjoy the alpine beauty",
        activities: [
          { time: "09:00 AM", description: "Mount Pilatus cable car ride" },
          { time: "11:00 AM", description: "Optional hiking trails" },
          { time: "02:00 PM", description: "Farewell Swiss lunch" },
          { time: "04:00 PM", description: "Shopping for souvenirs" }
        ],
        meals: [{ type: "Breakfast", description: "Breakfast at hotel" }, { type: "Dinner", description: "Farewell lunch" }],
        accommodation: "Check-out and departure"
      }
    ],
    highlights: [
      "Matterhorn views",
      "Jungfraujoch Top of Europe",
      "Scenic train journeys",
      "Professional mountain guide",
      "Small group (max 8 people)"
    ],
    difficulty: "Challenging",
    groupSize: { min: 2, max: 8 },
    maxCapacity: 12,
    bestTime: "June to September",
    cancellationPolicy: "Free cancellation up to 14 days before departure"
  }
};

// Mock Travel Companions Collection
export const mockTravelCompanions: TravelCompanion[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    dob: "1985-03-15",
    sex: "Female",
    passportNumber: "US123456789",
    nationality: "American",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0123",
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Spouse",
      phone: "+1-555-0124"
    },
    dietaryRestrictions: ["Vegetarian"],
    medicalConditions: [],
    specialRequests: "Window seat preference",
    isPrimaryContact: true
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Chen",
    dob: "1990-07-22",
    sex: "Male",
    passportNumber: "CA987654321",
    nationality: "Canadian",
    email: "michael.chen@email.com",
    phone: "+1-416-555-0125",
    emergencyContact: {
      name: "Lisa Chen",
      relationship: "Sister",
      phone: "+1-416-555-0126"
    },
    dietaryRestrictions: [],
    medicalConditions: ["Asthma"],
    specialRequests: "Aisle seat preferred",
    isPrimaryContact: false
  },
  {
    id: 3,
    firstName: "Emma",
    lastName: "Rodriguez",
    dob: "1988-11-08",
    sex: "Female",
    passportNumber: "ES456789123",
    nationality: "Spanish",
    email: "emma.rodriguez@email.com",
    phone: "+34-91-555-0127",
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Father",
      phone: "+34-91-555-0128"
    },
    dietaryRestrictions: ["Gluten-free"],
    medicalConditions: [],
    specialRequests: "Early check-in if possible",
    isPrimaryContact: false
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Wilson",
    dob: "1982-04-30",
    sex: "Male",
    passportNumber: "GB789123456",
    nationality: "British",
    email: "james.wilson@email.com",
    phone: "+44-20-555-0129",
    emergencyContact: {
      name: "Emma Wilson",
      relationship: "Wife",
      phone: "+44-20-555-0130"
    },
    dietaryRestrictions: [],
    medicalConditions: ["Diabetes"],
    specialRequests: "Accessible room if available",
    isPrimaryContact: false
  },
  {
    id: 5,
    firstName: "Sophie",
    lastName: "Dubois",
    dob: "1992-09-14",
    sex: "Female",
    passportNumber: "FR321654987",
    nationality: "French",
    email: "sophie.dubois@email.com",
    phone: "+33-1-555-0131",
    emergencyContact: {
      name: "Pierre Dubois",
      relationship: "Brother",
      phone: "+33-1-555-0132"
    },
    dietaryRestrictions: ["Vegan"],
    medicalConditions: [],
    specialRequests: "Quiet room preferred",
    isPrimaryContact: false
  },
  {
    id: 6,
    firstName: "Lucas",
    lastName: "Müller",
    dob: "1987-12-03",
    sex: "Male",
    passportNumber: "DE147258369",
    nationality: "German",
    email: "lucas.mueller@email.com",
    phone: "+49-30-555-0133",
    emergencyContact: {
      name: "Anna Müller",
      relationship: "Mother",
      phone: "+49-30-555-0134"
    },
    dietaryRestrictions: [],
    medicalConditions: ["Hypertension"],
    specialRequests: "Non-smoking room",
    isPrimaryContact: false
  },
  {
    id: 7,
    firstName: "Isabella",
    lastName: "Santos",
    dob: "1995-01-25",
    sex: "Female",
    passportNumber: "BR963852741",
    nationality: "Brazilian",
    email: "isabella.santos@email.com",
    phone: "+55-11-555-0135",
    emergencyContact: {
      name: "Maria Santos",
      relationship: "Mother",
      phone: "+55-11-555-0136"
    },
    dietaryRestrictions: ["Lactose intolerant"],
    medicalConditions: [],
    specialRequests: "High floor room preferred",
    isPrimaryContact: false
  },
  {
    id: 8,
    firstName: "Alexander",
    lastName: "Petrov",
    dob: "1989-06-18",
    sex: "Male",
    passportNumber: "RU852963741",
    nationality: "Russian",
    email: "alexander.petrov@email.com",
    phone: "+7-495-555-0137",
    emergencyContact: {
      name: "Elena Petrov",
      relationship: "Wife",
      phone: "+7-495-555-0138"
    },
    dietaryRestrictions: [],
    medicalConditions: ["Allergies to nuts"],
    specialRequests: "Connecting rooms if traveling with family",
    isPrimaryContact: false
  },
  {
    id: 9,
    firstName: "Yuki",
    lastName: "Tanaka",
    dob: "1993-08-07",
    sex: "Female",
    passportNumber: "JP741852963",
    nationality: "Japanese",
    email: "yuki.tanaka@email.com",
    phone: "+81-3-555-0139",
    emergencyContact: {
      name: "Hiroshi Tanaka",
      relationship: "Father",
      phone: "+81-3-555-0140"
    },
    dietaryRestrictions: ["Pescatarian"],
    medicalConditions: [],
    specialRequests: "Traditional Japanese breakfast if available",
    isPrimaryContact: false
  },
  {
    id: 10,
    firstName: "David",
    lastName: "O'Connor",
    dob: "1984-02-12",
    sex: "Male",
    passportNumber: "AU369258147",
    nationality: "Australian",
    email: "david.oconnor@email.com",
    phone: "+61-2-555-0141",
    emergencyContact: {
      name: "Patricia O'Connor",
      relationship: "Sister",
      phone: "+61-2-555-0142"
    },
    dietaryRestrictions: [],
    medicalConditions: ["Sleep apnea"],
    specialRequests: "CPAP machine access needed",
    isPrimaryContact: false
  }
];

// ===== AUTO-INITIALIZATION: ENSURE SINGLE PRIMARY CONTACT =====
// This ensures that when the mock data is loaded, there is always exactly one primary contact
(function initializeMockData() {
  // Check if there are multiple primary contacts and fix if needed
  const primaryCompanions = mockTravelCompanions.filter(companion => companion.isPrimaryContact);

  if (primaryCompanions.length > 1) {
    // Keep only the first primary contact, demote the rest
    const firstPrimary = primaryCompanions[0];
    primaryCompanions.slice(1).forEach(companion => {
      companion.isPrimaryContact = false;
    });
    console.log(`🔧 Auto-fixed: Multiple primary contacts detected. Kept ${firstPrimary.firstName} ${firstPrimary.lastName} as primary contact.`);
  } else if (primaryCompanions.length === 0) {
    // If no primary contact exists, designate the first companion as primary
    if (mockTravelCompanions.length > 0) {
      mockTravelCompanions[0].isPrimaryContact = true;
      console.log(`🔧 Auto-fixed: No primary contact found. Designated ${mockTravelCompanions[0].firstName} ${mockTravelCompanions[0].lastName} as primary contact.`);
    }
  } else {
    // Exactly one primary contact - this is correct
    const primary = primaryCompanions[0];
    console.log(`✅ Mock data loaded successfully with ${primary.firstName} ${primary.lastName} as primary contact.`);
  }
})();

// Helper function to get all travel companions
export function getAllTravelCompanions(): TravelCompanion[] {
  return mockTravelCompanions;
}

// Helper function to get travel companion by ID
export function getTravelCompanionById(id: number): TravelCompanion | null {
  return mockTravelCompanions.find(companion => companion.id === id) || null;
}

// Helper function to get primary contact companions
export function getPrimaryContactCompanions(): TravelCompanion[] {
  return mockTravelCompanions.filter(companion => companion.isPrimaryContact);
}

// Helper function to get companions by nationality
export function getCompanionsByNationality(nationality: string): TravelCompanion[] {
  return mockTravelCompanions.filter(companion => companion.nationality === nationality);
}

// Helper function to get companions with dietary restrictions
export function getCompanionsWithDietaryRestrictions(): TravelCompanion[] {
  return mockTravelCompanions.filter(companion =>
    companion.dietaryRestrictions && companion.dietaryRestrictions.length > 0
  );
}

// Helper function to get companions with medical conditions
export function getCompanionsWithMedicalConditions(): TravelCompanion[] {
  return mockTravelCompanions.filter(companion =>
    companion.medicalConditions && companion.medicalConditions.length > 0
  );
}

// Helper function to get all trips
export function getAllTrips(): TripData[] {
  return Object.values(mockTripData);
}

// Helper function to get trip by ID
export function getTripById(id: number): TripData | null {
  return mockTripData[id] || null;
}

// Helper function to get trips by category
export function getTripsByCategory(categoryId: number): TripData[] {
  return getAllTrips().filter(trip => trip.categoryId === categoryId);
}

// Helper function to get trips by category name
export function getTripsByCategoryName(categoryName: string): TripData[] {
  const category = getCategoryByName(categoryName);
  return category ? getTripsByCategory(category.id) : [];
}

// Helper function to get available categories
export function getAvailableCategories(): Category[] {
  return mockCategories;
}

// Helper function to get available category names (for backward compatibility)
export function getAvailableCategoryNames(): string[] {
  return mockCategories.map(category => category.name);
}

// Helper function to get category name for a trip
export function getTripCategoryName(trip: TripData): string {
  const category = getCategoryById(trip.categoryId);
  return category ? category.name : 'Unknown Category';
}

// Helper function to get category for a trip
export function getTripCategory(trip: TripData): Category | null {
  return getCategoryById(trip.categoryId);
}

// Helper function to get available dates for a trip
export function getAvailableDates(tripId: number): DateAvailability[] {
  const trip = getTripById(tripId);
  return trip ? trip.availability.filter(date => date.available > 0) : [];
}

// Helper function to get all available dates across all trips
export function getAllAvailableDates(): DateAvailability[] {
  return getAllTrips().flatMap(trip =>
    trip.availability.filter(date => date.available > 0)
  );
}

// Helper function to check if a specific date is available for a trip
export function isDateAvailable(tripId: number, date: string): boolean {
  const trip = getTripById(tripId);
  if (!trip) return false;

  const dateAvailability = trip.availability.find(d => d.date === date);
  return dateAvailability ? dateAvailability.available > 0 : false;
}

// Helper function to get trips with available dates
export function getTripsWithAvailability(): TripData[] {
  return getAllTrips().filter(trip =>
    trip.availability.some(date => date.available > 0)
  );
}

// Helper function to get trips by capacity range
export function getTripsByCapacityRange(minCapacity: number, maxCapacity: number): TripData[] {
  return getAllTrips().filter(trip =>
    trip.maxCapacity >= minCapacity && trip.maxCapacity <= maxCapacity
  );
}

// Helper function to get trips suitable for a specific group size
export function getTripsForGroupSize(groupSize: number): TripData[] {
  return getAllTrips().filter(trip =>
    trip.groupSize.min <= groupSize && trip.groupSize.max >= groupSize
  );
}

// ===== TRAVEL COMPANION MANAGEMENT FUNCTIONS =====

/**
 * Ensures only one travel companion is marked as primary contact
 * If a new primary contact is designated, any existing primary contact is automatically demoted
 */
export function ensureSinglePrimaryContact(companionId: number): void {
  // First, demote any existing primary contact
  mockTravelCompanions.forEach(companion => {
    if (companion.isPrimaryContact) {
      companion.isPrimaryContact = false;
    }
  });

  // Then, promote the specified companion to primary contact
  const targetCompanion = mockTravelCompanions.find(companion => companion.id === companionId);
  if (targetCompanion) {
    targetCompanion.isPrimaryContact = true;
  }
}

/**
 * Adds a new travel companion, ensuring only one primary contact exists
 */
export function addTravelCompanion(companion: Omit<TravelCompanion, 'id'>): TravelCompanion {
  // Generate a new unique ID
  const newId = Math.max(...mockTravelCompanions.map(c => c.id)) + 1;

  const newCompanion: TravelCompanion = {
    ...companion,
    id: newId
  };

  // If this companion is being added as primary contact, ensure no other primary contact exists
  if (newCompanion.isPrimaryContact) {
    ensureSinglePrimaryContact(newId);
  }

  mockTravelCompanions.push(newCompanion);
  return newCompanion;
}

/**
 * Updates an existing travel companion, ensuring only one primary contact exists
 */
export function updateTravelCompanion(id: number, updates: Partial<TravelCompanion>): TravelCompanion | null {
  const companionIndex = mockTravelCompanions.findIndex(c => c.id === id);
  if (companionIndex === -1) return null;

  const updatedCompanion = { ...mockTravelCompanions[companionIndex], ...updates };

  // If this companion is being updated to be primary contact, ensure no other primary contact exists
  if (updatedCompanion.isPrimaryContact) {
    ensureSinglePrimaryContact(id);
  }

  mockTravelCompanions[companionIndex] = updatedCompanion;
  return updatedCompanion;
}

/**
 * Removes a travel companion and optionally designates a new primary contact
 */
export function removeTravelCompanion(id: number, newPrimaryContactId?: number): boolean {
  const companionIndex = mockTravelCompanions.findIndex(c => c.id === id);
  if (companionIndex === -1) return false;

  const removedCompanion = mockTravelCompanions[companionIndex];

  // Remove the companion
  mockTravelCompanions.splice(companionIndex, 1);

  // If the removed companion was the primary contact, designate a new one
  if (removedCompanion.isPrimaryContact) {
    if (newPrimaryContactId) {
      // Designate the specified companion as new primary contact
      ensureSinglePrimaryContact(newPrimaryContactId);
    } else if (mockTravelCompanions.length > 0) {
      // Automatically designate the first remaining companion as primary contact
      ensureSinglePrimaryContact(mockTravelCompanions[0].id);
    }
  }

  return true;
}

/**
 * Gets the current primary contact companion
 * Returns null if no primary contact exists
 */
export function getPrimaryContactCompanion(): TravelCompanion | null {
  const primaryCompanions = getPrimaryContactCompanions();
  return primaryCompanions.length > 0 ? primaryCompanions[0] : null;
}

/**
 * Validates that the travel companions data maintains the single primary contact rule
 * Returns true if valid, false if multiple primary contacts exist
 */
export function validatePrimaryContactRule(): boolean {
  const primaryCompanions = getPrimaryContactCompanions();
  return primaryCompanions.length <= 1;
}

/**
 * Automatically fixes any violations of the single primary contact rule
 * If multiple primary contacts exist, keeps the first one and demotes the rest
 */
export function fixPrimaryContactRule(): void {
  const primaryCompanions = getPrimaryContactCompanions();
  if (primaryCompanions.length > 1) {
    // Keep the first primary contact, demote the rest
    const firstPrimary = primaryCompanions[0];
    primaryCompanions.slice(1).forEach(companion => {
      companion.isPrimaryContact = false;
    });
  }
}

/**
 * Reinitializes the mock data to ensure the single primary contact rule is enforced
 * This function can be called manually if needed to reset the data state
 */
export function reinitializeMockData(): void {
  console.log('🔄 Reinitializing mock data...');

  // Check if there are multiple primary contacts and fix if needed
  const primaryCompanions = mockTravelCompanions.filter(companion => companion.isPrimaryContact);

  if (primaryCompanions.length > 1) {
    // Keep only the first primary contact, demote the rest
    const firstPrimary = primaryCompanions[0];
    primaryCompanions.slice(1).forEach(companion => {
      companion.isPrimaryContact = false;
    });
    console.log(`🔧 Fixed: Multiple primary contacts detected. Kept ${firstPrimary.firstName} ${firstPrimary.lastName} as primary contact.`);
  } else if (primaryCompanions.length === 0) {
    // If no primary contact exists, designate the first companion as primary
    if (mockTravelCompanions.length > 0) {
      mockTravelCompanions[0].isPrimaryContact = true;
      console.log(`🔧 Fixed: No primary contact found. Designated ${mockTravelCompanions[0].firstName} ${mockTravelCompanions[0].lastName} as primary contact.`);
    }
  } else {
    // Exactly one primary contact - this is correct
    const primary = primaryCompanions[0];
    console.log(`✅ Data is valid with ${primary.firstName} ${primary.lastName} as primary contact.`);
  }

  console.log('✅ Mock data reinitialization complete.');
}