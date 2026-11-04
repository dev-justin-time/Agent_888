/** Domain types shared by API routes and client pages. */

export type ProviderType = "navigator" | "counselor" | "peer";
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  id: string;
  locale: string;
  name: string;
  number: string;
  text: string;
}

export interface Grant {
  id: string;
  name: string;
  description: string;
  amount: string;
  coverage: string;
  featured: boolean;
  rolling: boolean;
  tags: string[];
  image?: string;
}

export interface ProviderApplication {
  id: string;
  userId: string;
  name: string;
  type: string;
  cost: string;
  description: string;
  tags: string[];
  status: ApplicationStatus;
  createdAt: string;
  user?: { email: string };
}

export interface AdminStats {
  users: number;
  applications: number;
  hotlines: number;
  grants: number;
  providers: number;
  pendingApplications: number;
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

export interface EscrowResult {
  escrow_document: EscrowDocument;
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
