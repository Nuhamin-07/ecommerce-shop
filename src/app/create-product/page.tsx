"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface ProductForm {
  title: string;
  description: string;
  price: string;
  stock: string;
  brand: string;
  category: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await productApi.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (
        !form.title.trim() ||
        !form.description.trim() ||
        !form.brand.trim() ||
        !form.category.trim()
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const price = parseFloat(form.price);
      const stock = parseInt(form.stock);

      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price");
        setLoading(false);
        return;
      }

      if (isNaN(stock) || stock < 0) {
        toast.error("Please enter a valid stock quantity");
        setLoading(false);
        return;
      }

      // Create product - DummyJSON will return a mock response
      const response = await productApi.createProduct({
        title: form.title.trim(),
        description: form.description.trim(),
        price: price,
        stock: stock,
        brand: form.brand.trim(),
        category: form.category.trim(),
      });

      console.log("Product created:", response);
      toast.success("Product created successfully!");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      toast.error("Failed to create product");
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: keyof ProductForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to products
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Product</CardTitle>
            <CardDescription>
              Add a new product to your store. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category, index) => (
                      <SelectItem key={`cat-${index}`} value={category}>
                        {category && category.length > 0
                          ? category.charAt(0).toUpperCase() + category.slice(1)
                          : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  asChild
                >
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
