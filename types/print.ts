export interface PrintProductVariation {
  id: string;
  product_id: string;
  name: string;
  image_url: string;
}

export interface PrintProduct {
  id: string; // UUID from Supabase
  name: string;
  description?: string | null;
  base_price: number;
  image_url?: string | null;
  category?: string; // Optional for backward compatibility in UI, but DB has default
  sub_category?: string | null;
  active?: boolean | null;
  created_at?: string | null;
  variations?: PrintProductVariation[];
}

export interface NewPrintOrderPayload {
  product_id: string;
  variation_id?: string | null;
  full_name: string;
  phone: string;
  email?: string | null;
  location: string;
  quantity: number;
  notes?: string | null;
}

export type PrintOrderStatus = "pending" | "contacted" | "completed" | "cancelled";
