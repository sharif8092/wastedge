export type UserRole = "customer" | "vendor" | "admin";

export type VendorVerificationStatus = "pending" | "approved" | "rejected";

export type PickupRequestStatus = 
  | "pending"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  user_id: string; // References Profile.id
  business_name: string;
  service_areas: string[]; // cities or pincodes
  verification_status: VendorVerificationStatus;
  rejection_reason?: string;
  created_at: string;
}

export interface Category {
  id: string;
  category_name: string;
  icon_name: string;
  description: string;
  is_active: boolean;
}

export interface PickupRequest {
  id: string;
  customer_id: string; // References Profile.id
  vendor_id?: string; // References Profile.id (the vendor profile ID)
  category_id: string; // References Category.id
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  image_urls: string[]; // Can be object URLs or base64 strings
  status: PickupRequestStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string; // References Profile.id
  title: string;
  message: string;
  type: string; // "request_created" | "vendor_assigned" | "vendor_accepted" | "vendor_declined" | "pickup_completed" | "pickup_started" | "vendor_status";
  is_read: boolean;
  created_at: string;
}
