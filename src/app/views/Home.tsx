"use client";

import { useEffect, useState } from "react";
import type { Entry } from "contentful";
import type { Company } from "@/app/types";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const getCompanies = async () => {
    try {
        const res = await fetch('/api/getEntries')
        const data = await res.json()

        const updatedData = data.map((item:Entry) => ({
            id: item.sys.id,
            name: item.fields.name
        }))

        setCompanies(updatedData)
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {    
    getCompanies()
  },[])

  return (
    <>
      <h1 className=" bg-slate-800 text-white py-5 px-10 text-center">
        Companies: {companies.length}
      </h1>
      <a className="underline" href="/api/auth/logout">Logout API</a>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>{company.name}</li>
        ))}
      </ul>
    </>
  );
}
