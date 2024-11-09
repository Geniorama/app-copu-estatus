import { v4 as uuidv4 } from "uuid";
import type { User, Company } from "@/app/types";

export const fetchUploadImage = async (file: File): Promise<string | null> => {
  try {
    const uniqueFileName = `${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;
    const formData = new FormData();
    formData.append("file", file, uniqueFileName);
    const result = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      console.error("File upload failed");
      return null;
    }

    const { fileUrl } = await result.json();
    return fileUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createUserInContentful = async (infoUser: User) => {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(infoUser),
    });

    const dataResponse = await res.json();

    return dataResponse;
  } catch (error) {
    console.log("Error create user", error);
  }
};

export const updatedUserInContentful = async (infoUser: User) => {
  try {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(infoUser),
    });

    const dataResponse = await res.json();

    return dataResponse;
  } catch (error) {
    console.log("Error create user", error);
  }
};

export const createCompanyInContentful = async (data: Company) => {
  try {
    const result = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      const error = await result.text();
      console.error("Error al crear empresa:", error);
      return;
    }

    const dataRes = await result.json();
    return dataRes;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const getAllCompanies = async () => {
  try {
    const res = await fetch("/api/companies");
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log("Error data companies", error);
  }
};

export const getUserByAuth0Id = async (auth0Id: string) => {
  if (!auth0Id) {
    console.error("auth0id is required");
    return;
  }

  const result = await fetch(`/api/user?auth0Id=${auth0Id}`);

  if (result.ok) {
    const data = await result.json();

    return data;
  } else {
    ("Error fetch user data");
  }
};

export const getCompaniesByIds = async (companiesIds: string[]) => {
  if (!Array.isArray(companiesIds) || companiesIds.length === 0) {
    console.error("companiesIds debe ser un array con al menos un ID.");
    return null;
  }

  try {
    const response = await fetch('/api/getCompaniesByIds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: companiesIds }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error al obtener los datos:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud a /api/getCompaniesByIds:", error);
    return null;
  }
};

