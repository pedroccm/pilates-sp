export interface OpeningHours {
  day: string;
  hours: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Studio {
  title: string;
  totalScore: number;
  reviewsCount: number;
  street: string;
  postalCode: string;
  neighborhood: string;
  state: string;
  phone: string;
  categoryName: string;
  url: string;
  imageUrl: string;
  website?: string;
  openingHours: OpeningHours[];
  location: Location;
  address: string;
  city: string;
  slug?: string;
}