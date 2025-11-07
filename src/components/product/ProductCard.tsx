// src/components/product/ProductCard.tsx
"use client";

import { Product } from "@/types";
import { Heart, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/lib/features/favorites/favoritesSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite

    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
      toast.success("Removed from favorites");
    } else {
      dispatch(addToFavorites(product));
      toast.success("Added to favorites");
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={handleFavoriteToggle}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </Button>
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700">
            {product.discountPercentage}% OFF
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        <Badge variant="outline" className="mb-2 capitalize">
          {product.category}
        </Badge>

        <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
          </div>
          <span>•</span>
          <span>{product.stock} in stock</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-2xl font-bold">${product.price}</span>
        <span className="text-sm text-muted-foreground">
          Click to view details
        </span>
      </CardFooter>
    </Card>
  );
}
