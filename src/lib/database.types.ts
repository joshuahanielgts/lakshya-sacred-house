export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          in_stock: boolean;
          featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          in_stock?: boolean;
          featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: string;
          in_stock?: boolean;
          featured?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          customer_whatsapp: string | null;
          customer_email: string | null;
          items: OrderItem[];
          total_amount: number;
          status: OrderStatus;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          customer_whatsapp?: string | null;
          customer_email?: string | null;
          items: OrderItem[];
          total_amount: number;
          status?: OrderStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_name?: string;
          customer_phone?: string;
          customer_whatsapp?: string | null;
          customer_email?: string | null;
          items?: OrderItem[];
          total_amount?: number;
          status?: OrderStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          phone: string;
          whatsapp: string | null;
          interest: string | null;
          status: InquiryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          whatsapp?: string | null;
          interest?: string | null;
          status?: InquiryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          whatsapp?: string | null;
          interest?: string | null;
          status?: InquiryStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type OrderStatus =
  | "pending"
  | "payment_initiated"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type InquiryStatus = "new" | "contacted" | "closed";

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

// Convenience row types
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
