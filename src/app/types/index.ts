import { Entry } from "contentful-management";
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
  logo?: string | null;
  name?: string;
  address?: string;
  phone?: string;
  linkWhatsApp?: string;
  nit?: string;
  businessName?: string;
  superior?: {metadata:Metadata, sys:Sys, fields:Company} | null;
  superiorId?: string | null;
  driveLink?: string;
  updatedAt?: string | null;
  services?: Service[];
  status?: boolean;
}

export interface Service {
  id?: string;
  name: string;
  description?: string;
  startDate?: string | null;
  endDate?:  string | null;
  company?: Entry | null;
  companyId?: string | null;
  companyName?: string | null;
  plan?: 'anual' | 'mensual' | 'personalizado' | null;
  status?: boolean;
}

export interface SocialListsProps {
  id: string,
  title?: string,
  link?: string,
  statistics?: {
      scope?: number,
      impressions?: number,
      interactions?: number
  }
}

export interface Content {
  id?: string;
  companyName?: string;
  type?: string;
  headline?: string;
  publicationDate?: string | null;
  service?: Service;
  serviceId?: string;
  serviceName?: string;
  socialMediaInfo?: SocialListsProps[];
  createdBy?: string;
  scope?: number;
  impressions?: number;
  interactions?: number;
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
  rows: (string | ReactNode)[][]
}

export interface User{
  id?: string;
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'cliente';
  position?: string;
  companies?: CompanyResponse[] | null;
  auth0Id?: string;
  imageProfile?: string | null;
  linkWhatsApp?: string | null;
  status?: boolean;
  companiesId?: string[];
}
export interface FilterDataProps {
  company?: string | null;
  service?: string | null;
  publicationDate?: string;
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

export interface FeatureService {
  id: string
  title: string,
  description?: string,
  quantity?: number | null
}

export interface CompanyResponse {
  sys: {
    id: string;
    updatedAt: string;
  };
  fields: {
    name: {
      "en-US": string;
    };
    logo: {
      "en-US": string;
    };
    address: {
      "en-US": string;
    };
    phone: {
      "en-US": string;
    };
    whatsappLink?: {
      "en-US": string;
    };
    nit?: {
      "en-US": string;
    };
    businessName?: {
      "en-US": string;
    };
    driveLink?: {
      "en-US": string;
    };
    superior?: {
      "en-US": {metadata:Metadata, sys:Sys, fields:Company} | null;
    };
    status?: {
      "en-US": boolean;
    }
  };
}

export interface OptionSelect {
  value: string;
  name: string;
}

export interface CompanyWithUser extends Company {
  usersAdmin?: User[] | null;
}