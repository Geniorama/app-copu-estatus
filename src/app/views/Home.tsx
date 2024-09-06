"use client";

import { useEffect, useState } from "react";
import type { Entry } from "contentful-management";
import type { Company } from "@/app/types";
import { useForm, SubmitHandler } from "react-hook-form";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { register, handleSubmit} = useForm<Company>()

  const getCompanies = async () => {
    try {
        const res = await fetch('/api/companies')
        const data = await res.json()

        const updatedData = data.map((item:Entry) => ({
            id: item.sys.id,
            name: item.fields.name['en-US']
        }))
        setCompanies(updatedData)
    } catch (error) {
        console.error(error)
    }
  }

  const createCompany = async (data:Company) => {
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if(!response.ok){
        return
      }

      return response.json()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {    
    getCompanies()
  },[])

  const onSubmit: SubmitHandler<Company> = async (data) => {
      const res = await createCompany(data)
      console.log(res)
  }

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


      <h3 className="mt-10">Create company</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input className="border" type="text" {...register('logo')} placeholder="Logo" />
        <input className="border" type="text" {...register('name')} placeholder="Name" />
        <input className="border" type="text" {...register('address')} placeholder="Address" />
        <input className="border" type="text" {...register('phone')} placeholder="Phone" />

        <button type="submit">Create company</button>
      </form>
    </>
  );
}
