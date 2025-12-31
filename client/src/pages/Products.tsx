import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import productImage from "@/Period_products_collection_photo_196a839e.png";


const categories = ["All", "Tampons", "Pads", "Cups", "Underwear", "Discs", "Liners"];

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  features: string[];
  imageUrl: string;
  score?: number;
  matchReasons?: string[];
}

export default function Products() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract sessionId from URL query params
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const sessionId = urlParams.get('sessionId');

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
  queryKey: ['/api/products'],
  queryFn: async () => {
    const res = await fetch('/api/products.json', { credentials: 'include' });
    if (!res.ok) throw new Error(res.statusText);
    return res.json(); // ← reads the static file above
  },
});

  /*    OLD CODE FROM REPLIT
  // Fetch recommendations if sessionId exists, otherwise fetch all products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: sessionId ? ['/api/recommendations', sessionId] : ['/api/products'],
    queryFn: async () => {
      const url = sessionId 
        ? `/api/recommendations?sessionId=${sessionId}`
        : '/api/products';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }
      return response.json();
    },
  });
*/
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              {sessionId ? (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
                    <Sparkles className="h-4 w-4" />
                    Personalized For You
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                    Your Perfect Match
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Based on your survey responses, here are the products we recommend just for you
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                    Our Products
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Discover high-quality period products carefully curated for your comfort and confidence
                  </p>
                </>
              )}
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log(`Searching for: ${e.target.value}`);
                  }}
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category);
                    console.log(`Filtered by category: ${category}`);
                  }}
                  data-testid={`button-category-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {error ? (
              <Card className="border-destructive">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Unable to Load Products</h3>
                    <p className="text-muted-foreground">
                      {error instanceof Error ? error.message : 'An error occurred while fetching products'}
                    </p>
                  </div>
                  {sessionId && (
                    <Button
                      onClick={() => setLocation('/survey')}
                      variant="outline"
                    >
                      Retake Survey
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <ProductCard 
                      {...product} 
                      image={productImage}
                    />
                    {product.matchReasons && product.matchReasons.length > 0 && (
                      <div className="px-2 space-y-1">
                        <p className="text-xs font-semibold text-primary">Why we recommend this:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {product.matchReasons.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
