"use client";

import { useAppSelector } from "@/lib/hooks";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect } from "react";

export default function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.items);

  useEffect(() => {
    if (favorites.length > 0) {
      const ids = favorites.map((p) => p.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

      if (duplicateIds.length > 0) {
        console.error("DUPLICATE PRODUCT IDs FOUND:", duplicateIds);
        console.log("All favorites:", favorites);
      }

      favorites.forEach((product, index) => {
        if (typeof product.id === "object") {
          console.error("PRODUCT ID IS OBJECT:", product, "at index:", index);
        }
      });
    }
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {favorites.length} {favorites.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Continue Shopping
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding products to your favorites list!
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product, index) => (
            <ProductCard
              key={`favorite-${product.id}-${index}`}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
