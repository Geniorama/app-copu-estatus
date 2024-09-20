export interface Company {
  id?: string;
  logo: string;
  name: string;
  address?: string;
  phone?: string;
  whatsappLink?: string;
  nit?: string;
  businessName?: string;
  superior?: Company;
  driveLink?: string;
}

export interface Service {
  id?: string;
  name: string;
  description?: string;
  features?: string;
  startDate: Date;
  endDate: Date;
  company: Company;
  plan: string;
}

export interface Content {
  id: string;
  type: string;
  headline: string;
  pubDate: Date;
  service: Service;
  socialMediaInfo: JSON;
}

export interface UserAuth0 {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  sid: string;
}

export interface TableDataProps {
  heads: string[];
  rows: string[][];
}
