import { ReactNode } from "react";

// Representa los datos del sistema de un recurso en Contentful
export interface Sys {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  locale?: string;
  // Otros campos opcionales que podrías necesitar
}

// Representa los datos de metadata de un recurso en Contentful
export interface Metadata {
  tags: { 
    sys: { 
      type: string; 
      id: string;
    };
  }[];
}


export interface Company {
  id?: string;
  logo?: string;
  name?: string;
  address?: string;
  phone?: string;
  linkWhatsApp?: string;
  nit?: string;
  businessName?: string;
  superior?: {metadata:Metadata, sys:Sys, fields:Company}[] | null;
  driveLink?: string;
  updatedAt?: string | null;
  services?: any
}

export interface Service {
  id?: string;
  name: string;
  description?: string;
  features?: string;
  startDate: Date;
  endDate: Date;
  company: {metadata:Metadata, sys:Sys, fields:Company}[] | null;
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
  role: 'admin' | 'cliente';
  position?: string;
  companies?: {metadata:Metadata, sys:Sys, fields:Company}[] | null;
  auth0Id?: string;
  imageProfile?: string;
  linkWhatsApp?: string | null;
  status?: boolean;
}
export interface FilterDataProps {
  company?: string | null;
  startDate?: string;
  endDate?: string;
}

export interface CompanyContentful {
  logo?: string,
  name?: string,
  address?: string,
  phone?: string,
  whatsappLink?: string,
  nit?: string,
  businessName?: string,
  driveLink?: string,
}