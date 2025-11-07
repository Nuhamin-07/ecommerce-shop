"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { productApi } from "@/lib/api";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";
import { Star, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/lib/features/favorites/favoritesSlice";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productApi.getProduct(id);
        setProduct(productData);
      } catch (error) {
        toast.error("Failed to load product");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!product) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
      toast.success("Removed from favorites");
    } else {
      dispatch(addToFavorites(product));
      toast.success("Added to favorites");
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (
      !confirm(
        `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    try {
      await productApi.deleteProduct(id);
      toast.success("Product deleted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <ProductCardSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Product not found
        </h1>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-700 mb-6 inline-block"
      >
        ← Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 capitalize mt-2">
              {product.brand} • {product.category}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-lg font-medium">{product.rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-lg text-gray-600 dark:text-gray-400">
              {product.stock} in stock
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-green-600">
                  {product.discountPercentage}% off
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleFavoriteToggle}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
            <Link
              href={`/edit-product/${product.id}`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-center transition-colors flex items-center justify-center space-x-2"
            >
              <span>Edit Product</span>
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleteLoading ? "Deleting..." : "Delete Product"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
