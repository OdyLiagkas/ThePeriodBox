import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductCardProps {
  id: string; // NEW – needed for keying likes
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  features?: string[];
}

export function ProductCardNoHeart({ id, name, description, price, image, category, features = [] }: ProductCardProps) {
  /*  read initial like state from localStorage  */
  const [liked, setLiked] = useState<boolean>(() => {
    const likes = JSON.parse(localStorage.getItem("liked_products") || "[]");
    return likes.includes(id);
  });

  /*  keep localStorage in sync  */
  useEffect(() => {
    const likes = new Set(JSON.parse(localStorage.getItem("liked_products") || "[]"));
    if (liked) likes.add(id);
    else likes.delete(id);
    localStorage.setItem("liked_products", JSON.stringify(Array.from(likes)));
  }, [liked, id]);

  return (
    <Card className="overflow-hidden hover-elevate transition-all group" data-testid="card-product">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid="img-product"
        />
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold font-accent text-lg" data-testid="text-product-name">{name}</h3>
            <Badge variant="secondary" className="shrink-0">{category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded-md">
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent" data-testid="text-price">
            {price}
          </div>
          <Button size="sm" data-testid="button-learn-more">Learn More</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/*
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  features?: string[];
}

export function ProductCard({ name, description, price, image, category, features = [] }: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="overflow-hidden hover-elevate transition-all group" data-testid="card-product">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid="img-product"
        />
        <button
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border transition-colors ${
            liked ? "bg-primary text-primary-foreground border-primary" : "bg-background/80 border-border"
          }`}
          onClick={() => {
            setLiked(!liked);
            console.log(`${liked ? "Unliked" : "Liked"} ${name}`);
          }}
          data-testid="button-like"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold font-accent text-lg" data-testid="text-product-name">{name}</h3>
            <Badge variant="secondary" className="shrink-0">{category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded-md">
                {feature}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent" data-testid="text-price">
            {price}
          </div>
          <Button size="sm" data-testid="button-learn-more">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
*/