import { NextResponse } from "next/server";
import clientContentful from "@/app/lib/contentful";

export async function GET(){
    try {
        const result = await clientContentful.getEntries({
            content_type: 'company',
            limit: 5
        })
    
        const items = result.items
    
        return NextResponse.json(items, {status: 200})
    } catch (error) {
        console.error('Error fetching data from Contentful:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });   
    }
}