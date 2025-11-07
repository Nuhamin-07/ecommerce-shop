"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Product } from "@/types";
import { productApi } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import SearchBar from "@/components/layout/SearchBar";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";
import { toast } from "sonner";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { ref, inView } = useInView();

  const loadProducts = useCallback(
    async (reset: boolean = false) => {
      try {
        if (reset) {
          setLoading(true);
          setSkip(0);
        } else {
          setLoadingMore(true);
        }

        const currentSkip = reset ? 0 : skip;
        const response = await productApi.getAllProducts(currentSkip, 10);

        if (reset) {
          setProducts(response.products);
        } else {
          setProducts((prev) => [...prev, ...response.products]);
        }

        setSkip(currentSkip + 10);
        setHasMore(response.products.length > 0);
      } catch (error) {
        toast.error("Failed to load products");
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [skip]
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadProducts(true);
      return;
    }

    try {
      setLoading(true);
      const response = await productApi.searchProducts(query);
      setProducts(response.products);
      setHasMore(false);
    } catch (error) {
      toast.error("Failed to search products");
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(true);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loadingMore && !searchQuery) {
      loadProducts();
    }
  }, [inView, hasMore, loadingMore, searchQuery, loadProducts]);

  if (loading && products.length === 0) {
    return <ProductCardSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={`product-${product.id}-${index}`}
            product={product}
          />
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center mt-8">
          <ProductCardSkeleton />
        </div>
      )}

      {hasMore && !searchQuery && <div ref={ref} className="h-10" />}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}
