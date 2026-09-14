// Real Google Maps reviews (lightly trimmed for length). Update as new reviews come in.

export type GoogleReview = {
  name: string;
  apt: "alfa-stays-starlight" | "alfa-stays-shershah";
  place: string;
  stars: number;
  text: string;
  /** shown in the home page marquee */
  featured?: boolean;
};

export const googleReviews: GoogleReview[] = [
  { name: "Ali T.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, featured: true, text: "So far the best stays I've come across in Bahria Town. Special thanks to Asim bhai for going above and beyond to make the stay perfect. Their apartments are very neat and clean, and specially the Starlight apartment is one of its kind." },
  { name: "Hira A.", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, featured: true, text: "Such a lovely apartment! Great ambiance, well-maintained, and feels like home. Totally deserves 5 stars!" },
  { name: "Abdullah", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, featured: true, text: "The room was very clean, neat, and comfortable. The location felt safe and peaceful throughout my stay. The host, Asim Bhai, was extremely cooperative, friendly, and always ready to help." },
  { name: "Abdullah", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, text: "Everything was clean, comfortable, and well-maintained. The environment was peaceful and felt just like home. The host, Asim, was extremely kind, cooperative, and helpful throughout my stay." },
  { name: "Hamid N.", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, featured: true, text: "Best place for living in Lahore. Fully furnished and self check in/out." },
  { name: "Sami U.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, featured: true, text: "Very clean, perfect room for family. I really like the accommodation. Best part — easy entry by smart lock key. No hassle waiting for someone to hand over the keys." },
  { name: "Sk Official", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, text: "I had a wonderful stay at this apartment. It was very clean, well-maintained, and had a peaceful environment. The rooms were spotless, and everything was organized perfectly." },
  { name: "Waqas H.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, featured: true, text: "Nice luxury apartment at an affordable price, and privacy is never compromised." },
  { name: "Wajid M.", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, text: "Very neat, comfortable and perfect stay to live in Lahore." },
  { name: "Rana A.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, featured: true, text: "The place was clean, comfortable, and exactly as described. Asim bhai is an amazing host — very welcoming, helpful, and made sure I had everything I needed. I would happily stay here again." },
  { name: "Mirza A.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, text: "Best stay so far in Bahria. Environment 💯 Hygiene 💯 Behavior 💯 Security 💯 Recommend 💯" },
  { name: "Shahwani Z.", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, text: "Affordable and cozy apartment for stay." },
  { name: "Muneeb J.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, featured: true, text: "Excellent stay! Clean rooms, peaceful environment, and very friendly staff. Great service and comfortable accommodation. Highly recommended for anyone looking for a relaxing stay." },
  { name: "Malik F.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, text: "I stayed at Starlight Apartment and had a wonderful experience. The apartment was clean, comfortable, and well-maintained and the location was convenient." },
  { name: "Khawaja A.", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, text: "Wonderful stay and good experience in Lahore." },
  { name: "Adnan N.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, text: "Ambience was very good. Their apartments are very neat, clean and secure. Highly recommended!" },
  { name: "Shahzaib N.", apt: "alfa-stays-shershah", place: "Shershah", stars: 5, text: "Good environment and clean apartment." },
  { name: "Zuhair A.", apt: "alfa-stays-starlight", place: "Starlight", stars: 5, text: "Safe and secure place for family and friends." },
];
