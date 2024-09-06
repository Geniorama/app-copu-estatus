export type Company = {
    id: string;
    logo: string;
    name: string;
    address?: string;
    phone?: string;
    whatsAppLink?: string;
    nit?: string;
    businessName?: string;
    superior?: Company;
    driveLink?: string;
};