import type { Card, Carrier, Service, VerizonPerk } from "./types";

export const SERVICES: Record<string, Service> = {
  netflix: {
    name: "Netflix", icon: "📺", category: "streaming",
    tiers: [
      { id: "netflix_ads", name: "Standard with Ads", price: 7.99 },
      { id: "netflix_standard", name: "Standard", price: 17.99 },
      { id: "netflix_premium", name: "Premium (4K)", price: 24.99 },
    ],
  },
  disney: {
    name: "Disney+", icon: "✨", category: "streaming",
    tiers: [
      { id: "disney_ads", name: "With Ads", price: 9.99 },
      { id: "disney_noads", name: "No Ads", price: 15.99 },
    ],
  },
  hulu: {
    name: "Hulu", icon: "📗", category: "streaming",
    tiers: [
      { id: "hulu_ads", name: "With Ads", price: 9.99 },
      { id: "hulu_noads", name: "No Ads", price: 18.99 },
    ],
  },
  max: {
    name: "HBO Max", icon: "🎬", category: "streaming",
    tiers: [
      { id: "max_ads", name: "With Ads", price: 10.99 },
      { id: "max_noads", name: "Ad-Free", price: 18.49 },
      { id: "max_premium", name: "Ultimate (4K)", price: 22.99 },
    ],
  },
  peacock: {
    name: "Peacock", icon: "🦚", category: "streaming",
    tiers: [
      { id: "peacock_select", name: "Select", price: 7.99 },
      { id: "peacock_premium", name: "Premium", price: 10.99 },
      { id: "peacock_plus", name: "Premium Plus", price: 16.99 },
    ],
  },
  paramount: {
    name: "Paramount+", icon: "⛰️", category: "streaming",
    tiers: [
      { id: "paramount_essential", name: "Essential (Ads)", price: 8.99 },
      { id: "paramount_premium", name: "Premium + Showtime", price: 13.99 },
    ],
  },
  appletv: {
    name: "Apple TV+", icon: "🍎", category: "streaming",
    tiers: [
      { id: "appletv_standard", name: "Standard", price: 12.99 },
    ],
  },
  youtube_premium: {
    name: "YouTube Premium", icon: "▶️", category: "streaming",
    tiers: [
      { id: "yt_individual", name: "Individual", price: 13.99 },
      { id: "yt_family", name: "Family", price: 22.99 },
    ],
  },
  spotify: {
    name: "Spotify", icon: "🎵", category: "music",
    tiers: [
      { id: "spotify_individual", name: "Premium", price: 11.99 },
      { id: "spotify_family", name: "Family (6)", price: 19.99 },
      { id: "spotify_student", name: "Student", price: 5.99 },
    ],
  },
  apple_music: {
    name: "Apple Music", icon: "🎵", category: "music",
    tiers: [
      { id: "am_individual", name: "Individual", price: 10.99 },
      { id: "am_family", name: "Family (6)", price: 16.99 },
    ],
  },
  nyt: {
    name: "NY Times", icon: "📰", category: "news",
    tiers: [
      { id: "nyt_digital", name: "Digital Access", price: 17.00 },
      { id: "nyt_all", name: "All Access", price: 25.00 },
      { id: "nyt_games", name: "Games Only", price: 5.00 },
    ],
  },
  amazon_prime: {
    name: "Amazon Prime", icon: "📦", category: "shopping",
    tiers: [
      { id: "prime_monthly", name: "Monthly", price: 14.99 },
      { id: "prime_annual", name: "Annual ($139/yr)", price: 11.58 },
    ],
  },
  icloud: {
    name: "iCloud+", icon: "☁️", category: "productivity",
    tiers: [
      { id: "icloud_50", name: "50GB", price: 0.99 },
      { id: "icloud_200", name: "200GB", price: 2.99 },
      { id: "icloud_2tb", name: "2TB", price: 9.99 },
    ],
  },
  dropbox: {
    name: "Dropbox", icon: "📂", category: "productivity",
    tiers: [
      { id: "dropbox_plus", name: "Plus", price: 11.99 },
      { id: "dropbox_pro", name: "Professional", price: 24.99 },
    ],
  },
};

export const CARRIERS: Record<string, Carrier> = {
  tmobile_beyond: { name: "T-Mobile Experience Beyond", price: 100, freeServices: ["netflix_ads", "appletv_standard", "hulu_ads"], notes: "Netflix req 2+ lines" },
  tmobile_more: { name: "T-Mobile Experience More", price: 90, freeServices: ["netflix_ads"], discounts: [{ service: "appletv_standard", price: 3 }], notes: "Netflix req 2+ lines; Apple TV+ $3/mo" },
  tmobile_value: { name: "T-Mobile Better Value (3 lines)", price: 140, freeServices: ["netflix_ads", "hulu_ads", "appletv_standard"], notes: "$46/line; great family plan" },
  verizon_ultimate: { name: "Verizon Unlimited Ultimate", price: 90, perks: true },
  verizon_plus: { name: "Verizon Unlimited Plus", price: 80, perks: true },
  verizon_welcome: { name: "Verizon Unlimited Welcome", price: 65, perks: true },
  att: { name: "AT&T", price: null, freeServices: [], notes: "No streaming perks; 20% off bundling wireless+fiber" },
  cricket: { name: "Cricket Supreme", price: 55, freeServices: ["max_ads"], notes: "Free HBO Max with ads" },
  other: { name: "Other / unknown", price: null, freeServices: [] },
};

export const VERIZON_PERKS: VerizonPerk[] = [
  { id: "vz_disney", name: "Disney Bundle (D+/Hulu/ESPN)", price: 10, coversServices: ["disney_ads", "hulu_ads"], savingsVsRetail: 18.97 },
  { id: "vz_netflix_max", name: "Netflix + Max (with ads)", price: 10, coversServices: ["netflix_ads", "max_ads"], savingsVsRetail: 8.98 },
  { id: "vz_apple_one", name: "Apple One", price: 15, coversServices: ["appletv_standard", "am_individual"], savingsVsRetail: 8.98 },
  { id: "vz_youtube", name: "YouTube TV discount", price: -10, coversServices: [], savingsVsRetail: 10, notes: "$10 off YouTube TV" },
];

export const CARDS: Record<string, Card> = {
  amex_platinum: {
    name: "Amex Platinum", fee: 895,
    streamingCredit: 25, creditServices: ["disney", "hulu", "peacock", "paramount", "youtube_premium", "nyt"],
    walmartCredit: 12.95,
    notes: "Netflix NOT covered; $25/mo toward eligible streaming; Walmart+ credit → free Paramount+ or Peacock",
  },
  amex_gold: { name: "Amex Gold", fee: 325, streamingCredit: 10, creditServices: ["disney", "hulu", "peacock"] },
  amex_bcp: { name: "Amex Blue Cash Preferred", fee: 95, cashbackRate: 0.06, cashbackOn: "all_streaming", disneyCredit: 10 },
  amex_bce: { name: "Amex Blue Cash Everyday", fee: 0, disneyCredit: 7 },
  chase_sapphire_pref: { name: "Chase Sapphire Preferred", fee: 95, pointsMultiplier: 3, pointValue: 0.0175 },
  chase_sapphire_res: { name: "Chase Sapphire Reserve", fee: 550, pointsMultiplier: 3, pointValue: 0.02 },
  capital_one_savor: { name: "Capital One Savor", fee: 95, cashbackRate: 0.03, cashbackOn: "all_streaming" },
  other: { name: "Other / None", fee: 0 },
};
