import { v4 as uuidv4 } from "uuid";
import type { User } from "@/app/types";

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
    
    const dataResponse = await res.json()

    return dataResponse
  } catch (error) {
    console.log("Error create user", error);
  }
};
