export type Company = {
    name: string;
    id: string;
};

export type EntryExample = Company & {
    desc: string
}

export interface UserProps {
    name: string
    title: string
}