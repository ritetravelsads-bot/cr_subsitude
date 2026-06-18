// Database collection names
export const COLLECTIONS = {
  USERS: "users",
  PROPERTIES: "properties",
  STATES: "states",
  CATEGORIES: "categories",
  AMENITIES: "amenities",
  DEVELOPERS: "developers",
  FACILITIES: "facilities",
  REVIEWS: "reviews",
  TICKETS: "tickets",
  NEWS: "news",
  LEADS: "leads",
  TESTIMONIALS: "testimonials",
}

// User types
export type UserType = "buyer" | "seller" | "agent" | "admin"

export interface User {
  _id?: string
  username: string
  email: string
  password: string
  phone_number: string
  user_type: UserType
  profile_picture?: string
  date_joined: Date
  last_login?: Date
  is_verified?: boolean
}

export interface Property {
  _id?: string
  property_type: string
  property_name: string
  slug: string
  status: "available" | "sold" | "rented"
  lowest_price: number
  max_price: number
  area_sqft: number
  bedrooms: number
  bathrooms: number
  garage: number
  garage_size?: number
  address: string
  city: string
  state: string
  postal_code: string
  property_size: number
  property_video?: string
  neighborhood: string
  builder?: string
  possession: string
  latitude: number
  longitude: number
  rera_no?: string
  availability_status: "available" | "pending" | "sold"
  is_featured: boolean
  is_hot: boolean
  agent: string
  amenities: string[]
  facilities: string[]
  main_thumbnail: string
  main_banner: string
  multiple_images: string[]
  meta_title: string
  meta_keywords: string
  meta_description: string
  created_at: Date
  updated_at: Date
  
  // New fields for enhanced property detail page
  about_project?: string
  project_highlights?: string[]
  units?: Array<{
    type: string
    size_range?: string
    price_range?: string
    available?: boolean
  }>
  location_connectivity?: Array<{
    type: "metro" | "airport" | "highway" | "hospital" | "school" | "mall" | "railway" | "bus_stand"
    name: string
    distance: string
  }>
  faqs?: Array<{
    question: string
    answer: string
  }>
  payment_plan_details?: string
}

export interface State {
  _id?: string
  name: string
  slug: string
}

export interface Category {
  _id?: string
  name: string
  slug: string
  icon_class: string
}

export interface Amenities {
  _id?: string
  name: string
  icon_class: string
}

export interface Builder {
  _id?: string
  name: string
  slug: string
  logo?: string
}

export interface Facilities {
  _id?: string
  name: string
  icon_class: string
}

export interface Review {
  _id?: string
  property: string
  user: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: Date
}

export interface Ticket {
  _id?: string
  user: string
  subject: string
  description: string
  priority: "low" | "medium" | "high"
  status: "open" | "in_progress" | "resolved" | "closed"
  created_at: Date
  updated_at: Date
}

export interface News {
  _id?: string
  title: string
  slug: string
  content: string
  author: string
  publication_date: Date
  is_published: boolean
  cover_image: string
  meta_title?: string
  meta_description?: string
  created_at: Date
  updated_at: Date
}

// Lead status workflow: new → contacted → qualified → converted/lost
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost"
export type LeadSource = "property_enquiry" | "contact_form" | "phone_call" | "whatsapp" | "walk_in" | "referral" | "other"
export type LeadPriority = "low" | "medium" | "high" | "urgent"

export interface Lead {
  _id?: string
  
  // Contact Information
  name: string
  email: string
  phone: string
  message?: string
  
  // Property & Source
  property_id?: string          // MongoDB ObjectId as string
  property_name?: string        // Denormalized for quick display
  property_slug?: string        // For linking to property page
  source: LeadSource
  source_url?: string           // The page URL where lead was captured
  
  // Ownership & Assignment
  property_owner_id?: string    // The agent/admin who owns the property
  property_owner_type?: "admin" | "agent"
  assigned_to?: string          // Agent ID if admin assigns to an agent
  assigned_by?: string          // Admin ID who assigned the lead
  assigned_at?: Date
  
  // Status & Priority
  status: LeadStatus
  priority: LeadPriority
  
  // Follow-up tracking
  notes?: Array<{
    content: string
    created_by: string
    created_by_type: "admin" | "agent"
    created_at: Date
  }>
  last_contacted_at?: Date
  next_follow_up?: Date
  
  // Budget & Requirements (optional, from enquiry form)
  budget_min?: number
  budget_max?: number
  preferred_bhk?: number
  preferred_location?: string
  
  // Timestamps
  created_at: Date
  updated_at: Date
}

// Lead with populated property and user data
export interface LeadWithDetails extends Lead {
  property?: Property
  owner?: User
  assignee?: User
}

// Testimonial Model
export interface Testimonial {
  _id?: string
  name: string
  location: string
  property_bought: string
  rating: number          // 1–5
  text: string
  is_approved: boolean
  created_at: Date
}
