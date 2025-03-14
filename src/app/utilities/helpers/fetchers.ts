import { v4 as uuidv4 } from "uuid";
import type { User, Company, Service, Content } from "@/app/types";

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

    if (!res.ok) {
      throw new Error(
        `Error en la actualización del usuario: ${res.statusText}`
      );
    }

    const dataResponse = await res.json();
    return dataResponse;
  } catch (error) {
    console.log("Error al actualizar el usuario:", error);
    throw error; // Lanza el error para que sea manejado en el bloque catch del componente
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

export const getCompaniesByIds = async (companiesIds: string[], page: number = 1, limit: number = 6) => {
  if (!Array.isArray(companiesIds) || companiesIds.length === 0) {
    console.error("companiesIds debe ser un array con al menos un ID.");
    return null;
  }

  try {
    const response = await fetch("/api/getCompaniesByIds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: companiesIds, page, limit }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        companies: Array.isArray(data.companies) ? data.companies : [],
        total: data.total || 0,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
      };
    } else {
      console.error("Error al obtener los datos:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud a /api/getCompaniesByIds:", error);
    return null;
  }
};

export const getAllUsers = async (limit: number = 6, page: number = 1) => {
  try {
    const fetchUsers = await fetch(`/api/users?limit=${limit}&page=${page}`);
    if (fetchUsers.ok) {
      const res = await fetchUsers.json();
      return res;
    } else {
      console.log("Error fetch all users");
    }
  } catch (error) {
    console.log(error);
  }
};


export const getUsersByCompanyId = async(companyId:string) => {
  try {
    const fetchUsers = await fetch(`/api/getUsersByCompanyId?companyId=${companyId}`);
    if (fetchUsers.ok) {
      const res = await fetchUsers.json();
      return res;
    } else {
      console.log("Error fetch all users");
    }
  } catch (error) {
    console.log(error);
  }
}
export const updateCompany = async (data: Company) => {
  try {
    const fetchUpdate = await fetch("/api/companies", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (fetchUpdate.ok) {
      const response = await fetchUpdate.json();
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllServices = async (limit:number = 6, page:number = 1) => {
  try {
    const res = await fetch(`/api/services?limit=${limit}&page=${page}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch all services");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateService = async (service: Service) => {
  try {
    const res = await fetch("/api/services", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const errorData = await res.json();
      console.log("Error fetch update service", errorData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateServiceStatus = async (serviceId: string, status: boolean) => {
  try {
    const res = await fetch("/api/updateServiceStatus", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: serviceId, status }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch update service status");
    }
  } catch (error) {
    console.log(error);
  }
};


export const createService = async (service: Service) => {
  try {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch update service");
    }
  } catch (error) {
    console.log(error);
  }
};

export const createContent = async (content: Content) => {
  try {
    const res = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch create content");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateContent = async (content: Content) => {
  try {
    const res = await fetch("/api/content", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch update content");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllContents = async (limit: number = 6, page: number = 1) => {
  try {
    const res = await fetch(`/api/content?limit=${limit}&page=${page}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch all services");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getServicesByCompanyId = async (companyId: string) => {
  try {
    const res = await fetch(`/api/getServicesByCompany?companyId=${companyId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error fetch services");
      return null; // Retornar null para indicar fallo
    }
  } catch (error) {
    console.error("Error en fetch:", error);
    return null; // Retornar null para indicar error
  }
};

export const getServiceById = async (serviceId: string) => {
  if (!serviceId) {
    console.error("serviceId is required");
    return null;
  }

  try {
    const res = await fetch(`/api/getServiceById/?serviceId=${serviceId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching service:", res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error in fetch:", error);
    return null;
  }
};


export const getCompanyById = async (companyId: string) => {
  if (!companyId) {
    console.error("serviceId is required");
    return null;
  }

  try {
    const res = await fetch(`/api/getCompanyById/?companyId=${companyId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching company:", res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error in fetch:", error);
    return null;
  }
};

export const getContentsByServiceId = async (serviceId: string) => {
  if (!serviceId) {
    console.error("serviceId is required");
    return null;
  }

  try {
    const res = await fetch(`/api/getContentsByServiceId?serviceId=${serviceId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching contents:", res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error in fetch:", error);
    return null;
  }
};
