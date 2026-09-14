export type Apartment = {
  slug: string;
  name: string;
  area: string;
  address: string;
  summary: string;
  description: string;
  pricePerNight: number;
  cleaningFee: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  /** Short Google Maps link (directions) */
  googleMapsUrl: string;
  /** Where guests leave a Google review. Best: the "Ask for reviews" link from your Google Business Profile. */
  googleReviewUrl: string;
  /** Used for the embedded map (plus code is the most precise) */
  mapQuery: string;
  /** Your Airbnb listing URL — Airbnb buttons are hidden until this is set */
  airbnbUrl?: string;
  featured?: boolean;
};

const photos = (folder: string, ids: number[]) => ids.map((n) => `/photos/${folder}/${String(n).padStart(2, "0")}.jpg`);

// TODO: confirm prices, guests, bedrooms, beds and baths — these are placeholders.
export const apartments: Apartment[] = [
  {
    slug: "alfa-stays-starlight",
    name: "ALFA Stays Starlight",
    area: "Ghaznavi Block, Sector F",
    address: "78 Commercial, Ghaznavi Block, Sector F, Bahria Town, Lahore 53720",
    summary: "Starlight ceilings, a moody lounge and warm designer bedrooms.",
    description:
      "Our signature apartment — the one guests call “one of its kind”. Fall asleep under a glowing fibre-optic starlight ceiling, unwind on the oversized sectional in the lounge, and enjoy designer bedrooms with warm cove lighting and dual air conditioning. A fully equipped kitchen and smart-lock self check-in make it effortless for couples, families and friends.",
    pricePerNight: 15000,
    cleaningFee: 0,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    rating: 4.8,
    reviews: 21,
    images: photos("alfa-stays-starlight", [8, 15, 4, 24, 9, 23, 18, 6, 10, 25, 12, 2]),
    amenities: [
      "Starlight fibre-optic ceilings",
      "Smart-lock self check-in",
      "Dual air conditioning",
      "Two LED TVs",
      "Kitchen with microwave & stove",
      "Electric kettle & utensils",
      "Lounge with sectional sofa",
      "Secure building in Bahria Town",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/BQQRruYzQ26rvC4v5",
    googleReviewUrl: "https://www.google.com/maps?cid=14187019659381994798",
    mapQuery: "85XC+8P Lahore, Pakistan",
    featured: true,
  },
  {
    slug: "alfa-stays-shershah",
    name: "ALFA Stays Shershah",
    area: "Shershah Block, Sector F",
    address: "Plaza 04, Shershah Block, Sector F, Bahria Town, Lahore 53720 (Timmy's building)",
    summary: "Champagne interiors, a bright lounge and hotel-style bedrooms.",
    description:
      "Soft neutral tones, sculpted wall panels and warm lighting throughout. Relax in the bright lounge with a smart TV, share a meal at the four-seat dining table, and retreat to hotel-style bedrooms — including one with a projector for movie nights. Fully furnished with smart-lock self check-in, right in the heart of Bahria Town.",
    pricePerNight: 12000,
    cleaningFee: 0,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    rating: 4.9,
    reviews: 25,
    images: photos("alfa-stays", [8, 7, 9, 15, 3, 11, 16, 6, 4, 13, 20, 1]),
    amenities: [
      "Smart-lock self check-in",
      "Air conditioning",
      "Lounge with smart TV",
      "Projector movie bedroom",
      "Dining table for four",
      "LED vanity bathroom",
      "Hotel-style bedding",
      "Fully furnished",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/wzcRJze4nQQbYXLC9",
    googleReviewUrl: "https://www.google.com/maps?cid=18181730961433277806",
    mapQuery: "955F+3R Lahore, Pakistan",
    featured: true,
  },
];

export const getApartment = (slug: string) => apartments.find((a) => a.slug === slug);

export const totalReviews = apartments.reduce((n, a) => n + a.reviews, 0);
