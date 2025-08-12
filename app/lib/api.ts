const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const textError = await response.text();
        if (textError.includes("<!DOCTYPE") || textError.includes("<html")) {
          errorMessage = `Server returned HTML instead of JSON. Check if the backend server is running at ${API_BASE_URL}`;
        } else {
          errorMessage = textError;
        }
      }
    } catch (e) {
      // If we can't parse the error, use the default message
    }

    throw new ApiError(errorMessage, response.status);
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(response);
    },
  },

  // Upload endpoints
  upload: {
    image: async (imageFile: File, title: string, token: string) => {
      const formData = new FormData();
      formData.append("image", imageFile); // Backend expects 'image' field name
      formData.append("title", title);
      console.log("Uploading image to Cloudinary with title:", formData);
      const response = await fetch(`${API_BASE_URL}/api/cloudinary/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return handleResponse(response);
    },
  },

  // Items endpoints
  items: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/api/items`);
      return handleResponse(response);
    },

    create: async (itemData: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });
      return handleResponse(response);
    },
  },
};

export default api;
