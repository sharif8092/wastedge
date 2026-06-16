import { Category, Profile, Vendor, PickupRequest, Notification } from "./types";

export interface ScrapObjectRate {
  id: string;
  name: string;
  rate: number;
  unit: "kg" | "pc";
  category_id: string;
  market_trend: "up" | "down" | "stable";
  popular_label: string;
  trend_value: string;
}

export const SCRAP_OBJECTS: ScrapObjectRate[] = [
  { id: "newspapers", name: "Daily Newspapers (Raddi)", rate: 15, unit: "kg", category_id: "cat-2", market_trend: "up", popular_label: "Newspaper", trend_value: "+4.2%" },
  { id: "carton", name: "Cardboard Packaging Boxes", rate: 8, unit: "kg", category_id: "cat-2", market_trend: "stable", popular_label: "Cardboard", trend_value: "0.0%" },
  { id: "office_records", name: "Office Records & Files", rate: 14, unit: "kg", category_id: "cat-2", market_trend: "up", popular_label: "Office Paper", trend_value: "+1.5%" },
  { id: "textbooks", name: "School Textbooks & Books", rate: 12, unit: "kg", category_id: "cat-2", market_trend: "down", popular_label: "Books", trend_value: "-2.1%" },
  { id: "pet_bottles", name: "PET Water & Beverage Bottles", rate: 8, unit: "kg", category_id: "cat-1", market_trend: "up", popular_label: "PET Plastic", trend_value: "+8.3%" },
  { id: "plastic_crates", name: "Heavy Plastic Crates/Tubs", rate: 15, unit: "kg", category_id: "cat-1", market_trend: "stable", popular_label: "HDPE Plastic", trend_value: "0.0%" },
  { id: "copper_wire", name: "Pure Unsheathed Copper Wire", rate: 505, unit: "kg", category_id: "cat-3", market_trend: "up", popular_label: "Copper", trend_value: "+12.1%" },
  { id: "brass_utensils", name: "Brass Utensils & Castings", rate: 325, unit: "kg", category_id: "cat-3", market_trend: "stable", popular_label: "Brass", trend_value: "0.0%" },
  { id: "iron_beams", name: "Iron Rods & Steel", rate: 25, unit: "kg", category_id: "cat-3", market_trend: "up", popular_label: "Iron", trend_value: "+4.8%" },
  { id: "aluminum_alloy", name: "Aluminum Scraps & Alloy", rate: 112, unit: "kg", category_id: "cat-3", market_trend: "up", popular_label: "Aluminium", trend_value: "+3.5%" },
  { id: "steel_sinks", name: "Stainless Steel Utensils", rate: 42, unit: "kg", category_id: "cat-3", market_trend: "down", popular_label: "Steel", trend_value: "-0.5%" },
  { id: "smartphones_dead", name: "Dead Smartphones", rate: 90, unit: "pc", category_id: "cat-4", market_trend: "stable", popular_label: "Mobile Phones", trend_value: "0.0%" },
  { id: "appliances_ac", name: "Old Split Air Conditioner (1.5T)", rate: 4500, unit: "pc", category_id: "cat-4", market_trend: "up", popular_label: "Split AC", trend_value: "+7.4%" },
  { id: "laptop", name: "Dead Laptops", rate: 500, unit: "pc", category_id: "cat-4", market_trend: "up", popular_label: "Laptops", trend_value: "+5.1%" },
  { id: "battery_car", name: "Lead-Acid Car Batteries", rate: 81, unit: "kg", category_id: "cat-5", market_trend: "up", popular_label: "Car Battery", trend_value: "+6.0%" },
  { id: "geyser_old", name: "Old Metal Water Geyser", rate: 20, unit: "kg", category_id: "cat-5", market_trend: "up", popular_label: "Geyser", trend_value: "+2.2%" },
  { id: "machinery_motor", name: "Dead Electric Motors", rate: 35, unit: "kg", category_id: "cat-7", market_trend: "up", popular_label: "Motors", trend_value: "+8.5%" },
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    category_name: "Plastic Waste",
    icon_name: "Recycle",
    description: "PET bottles, HDPE containers, broken plastic furniture, crates, and toys.",
    is_active: true
  },
  {
    id: "cat-2",
    category_name: "Paper Waste",
    icon_name: "FileText",
    description: "Newspapers, cardboard boxes, office files, notebooks, and shredded paper manuals.",
    is_active: true
  },
  {
    id: "cat-3",
    category_name: "Metal Scrap",
    icon_name: "Hammer",
    description: "Iron rods, copper wires, brass valves, aluminum cans, steel sheets, and home utensils.",
    is_active: true
  },
  {
    id: "cat-4",
    category_name: "E-Waste",
    icon_name: "Cpu",
    description: "Dead laptops, smartphones, PCB logic boards, old chargers, networking modems, and appliances.",
    is_active: true
  },
  {
    id: "cat-5",
    category_name: "Household Scrap",
    icon_name: "Home",
    description: "Old mattresses, non-functional washing machines, broken glass bottles, and dry waste.",
    is_active: true
  },
  {
    id: "cat-6",
    category_name: "Office Scrap",
    icon_name: "Briefcase",
    description: "Disused desk partitions, office chairs, carton stacks, registers, and redundant files.",
    is_active: true
  },
  {
    id: "cat-7",
    category_name: "Industrial Scrap",
    icon_name: "Container",
    description: "Heavy machinery castings, metallic shavings, barrels, wiring looms, and processing residues.",
    is_active: true
  },
  {
    id: "cat-8",
    category_name: "Construction Waste",
    icon_name: "Building",
    description: "Demolition concrete rubbles, unused bricks, wood offcuts, plumbing pipes, and tiles.",
    is_active: true
  }
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];

// Preseeded Profiles
export const SEED_PROFILES: Profile[] = [
  {
    id: "prof-admin",
    email: "admin@wastedge.in",
    full_name: "Kamran Sharif",
    phone: "9988776655",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    created_at: "2026-01-10T10:00:00Z"
  },
  {
    id: "prof-vendor-1",
    email: "vendor@wastedge.in",
    full_name: "Rajesh Kumar",
    phone: "9876543201",
    role: "vendor",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    created_at: "2026-02-15T09:30:00Z"
  },
  {
    id: "prof-vendor-2",
    email: "greenscrap@wastedge.in",
    full_name: "Amit Patel",
    phone: "8899001122",
    role: "vendor",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    created_at: "2026-05-20T11:00:00Z"
  },
  {
    id: "prof-customer-1",
    email: "customer@wastedge.in",
    full_name: "Aarav Mehta",
    phone: "9876543210",
    role: "customer",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    created_at: "2026-03-01T08:00:00Z"
  }
];

export const SEED_VENDORS: Vendor[] = [
  {
    id: "ven-1",
    user_id: "prof-vendor-1",
    business_name: "Kalyan Green Recyclers Association",
    service_areas: ["400001", "Mumbai", "Kalyan", "Thane", "421301"],
    verification_status: "approved",
    created_at: "2026-02-15T09:45:00Z"
  },
  {
    id: "ven-2",
    user_id: "prof-vendor-2",
    business_name: "Green Planet Scrap Distributors",
    service_areas: ["110001", "Delhi", "Noida", "Gurugram"],
    verification_status: "pending",
    created_at: "2026-05-20T11:15:00Z"
  }
];

export const SEED_REQUESTS: PickupRequest[] = [
  {
    id: "req-101",
    customer_id: "prof-customer-1",
    vendor_id: "prof-vendor-1",
    category_id: "cat-4", // E-waste
    description: "Assorted e-waste: 2 broken desktop computer cabinets, old CRT monitor, bundle of ethernet copper cables, and 3 lithium laptop batteries.",
    address: "B/402 Shanti Sadan, near Kalyan Railway Station, Khadakpada",
    city: "Kalyan",
    state: "Maharashtra",
    pincode: "421301",
    image_urls: [
      "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400"
    ],
    status: "completed",
    notes: "E-waste weighed 18.5 kg. Paid Rs. 450 directly to Aarav. Collected and transferred to e-recycling depot in Rabale.",
    created_at: "2026-05-15T10:00:00Z",
    updated_at: "2026-05-16T14:30:00Z"
  },
  {
    id: "req-102",
    customer_id: "prof-customer-1",
    vendor_id: "prof-vendor-1",
    category_id: "cat-3", // Metal Scrap
    description: "Old corroded steel pipes from bathroom renovation, rusted iron window grilles, and some copper wiring.",
    address: "B/402 Shanti Sadan, near Kalyan Railway Station, Khadakpada",
    city: "Kalyan",
    state: "Maharashtra",
    pincode: "421301",
    image_urls: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400"
    ],
    status: "accepted",
    created_at: "2026-06-05T12:00:00Z",
    updated_at: "2026-06-06T09:15:00Z"
  },
  {
    id: "req-103",
    customer_id: "prof-customer-1",
    category_id: "cat-1", // Plastic
    description: "Cardboard cartons from online deliveries and numerous PET water bottles accumulated over the last 3 months.",
    address: "B/402 Shanti Sadan, near Kalyan Railway Station, Khadakpada",
    city: "Kalyan",
    state: "Maharashtra",
    pincode: "421301",
    image_urls: [
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400"
    ],
    status: "pending",
    created_at: "2026-06-07T16:45:00Z",
    updated_at: "2026-06-07T16:45:00Z"
  }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "not-1",
    user_id: "prof-customer-1",
    title: "Pickup Confirmed!",
    message: "Your e-waste request was successfully completed by Rajesh Kumar. Paid: ₹450.",
    type: "pickup_completed",
    is_read: false,
    created_at: "2026-05-16T14:31:00Z"
  },
  {
    id: "not-2",
    user_id: "prof-vendor-1",
    title: "New Job Assigned",
    message: "Admin assigned a new Metal Scrap pickup request from Aarav Mehta.",
    type: "vendor_assigned",
    is_read: false,
    created_at: "2026-06-06T09:00:00Z"
  },
  {
    id: "not-3",
    user_id: "prof-customer-1",
    title: "Vendor Assigned",
    message: "Rajesh Kumar has accepted your metal scrap pickup request and is preparing the dispatch.",
    type: "vendor_assigned",
    is_read: true,
    created_at: "2026-06-06T09:15:00Z"
  }
];
