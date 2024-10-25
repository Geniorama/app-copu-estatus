import { ReactNode } from "react";

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
  rows: ReactNode[][] | string[][];
}

export interface User{
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
  position?: string;
  companies?: string[];
  auth0Id?: string;
  imageProfile?: string;
  linkWhatsApp?: string;
  status?: boolean;
}
export interface FilterDataProps {
  company?: string | null;
  startDate?: string;
  endDate?: string;
}