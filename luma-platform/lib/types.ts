export type ProviderType = "navigator" | "counselor" | "peer";

export interface Provider {
  id: string;
  name: string;
  locale: string;
  type: ProviderType;
  verified: boolean;
  cost: string;
  description: string;
  tags: string[];
  founded?: string;
  reach?: string;
  image?: string;
}

export interface Hotline {
  name: string;
  number: string;
  text: string;
}

export interface Grant {
  id: string;
  name: string;
  description: string;
  amount: string;
  featured: boolean;
  rolling: boolean;
  image?: string;
}

export interface ChatMessage {
  role: "user" | "luma";
  text: string;
}

export interface EscrowDocument {
  document_title: string;
  fund_source: string;
  designated_use: string;
  stewardship_strategy: string;
  disbursement_conditions: string;
}

export interface OutreachEmail {
  subject: string;
  body: string;
}

export interface ApiError {
  status: "error";
  message: string;
}

export interface ExpertConsultResponse {
  status: "success";
  expert: string;
  response: string;
  framework_used?: string;
  route_to_resources?: boolean;
  priority?: "URGENT_SAFETY_PROTOCOL";
  disclaimer?: string;
  billed_amount: number;
}
