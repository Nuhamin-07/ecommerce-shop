import axios from "axios";
import { Product, ProductsResponse, CreateProductRequest } from "@/types";

const BASE_URL = "https://dummyjson.com";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productApi = {
  getAllProducts: async (
    skip: number = 0,
    limit: number = 10
  ): Promise<ProductsResponse> => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  },

  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await api.post("/products/add", product);
    return response.data;
  },

  updateProduct: async (
    id: number,
    product: Partial<CreateProductRequest>
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get("/products/categories");
      const categories = response.data;

      console.log("Raw categories response:", categories);

      // DummyJSON returns an array of strings, but let's handle any case
      if (Array.isArray(categories)) {
        return categories
          .map((category) => {
            // If it's already a string, use it
            if (typeof category === "string") {
              return category;
            }
            // If it's an object, try to extract name or slug
            if (typeof category === "object" && category !== null) {
              const catObj = category as any;
              return catObj.name || catObj.slug || "Unknown";
            }
            // Fallback for any other type
            return String(category || "Unknown");
          })
          .filter((cat) => cat && cat !== "Unknown");
      }

      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
